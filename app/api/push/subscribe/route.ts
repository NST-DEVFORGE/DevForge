import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireUser } from "@/lib/session";
import { subscriptionId, type PushSubscriptionRecord } from "@/lib/push";

export const runtime = "nodejs";

const schema = z.object({
    endpoint: z.string().url().max(2000),
    keys: z.object({ p256dh: z.string().max(500), auth: z.string().max(500) }),
});

export async function POST(request: NextRequest) {
    try {
        const session = await requireUser();

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Invalid subscription" }, { status: 400 });
        }

        const { endpoint, keys } = parsed.data;
        const id = subscriptionId(endpoint);

        // Keyed by endpoint, so re-subscribing on the same browser updates the
        // row instead of piling up duplicates that all deliver the same push.
        await club<PushSubscriptionRecord>(COLLECTIONS.pushSubscriptions).doc(id).set({
            id,
            usn: session.usn,
            endpoint,
            keys,
            userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? undefined,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return authErrorResponse(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await requireUser();
        const parsed = schema.pick({ endpoint: true }).safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
        }
        await club(COLLECTIONS.pushSubscriptions).doc(subscriptionId(parsed.data.endpoint)).delete();
        return NextResponse.json({ ok: true });
    } catch (error) {
        return authErrorResponse(error);
    }
}
