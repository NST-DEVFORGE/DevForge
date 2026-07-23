import { NextResponse, type NextRequest } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireAdmin, requireUser } from "@/lib/session";
import { eventInputSchema, type ClubEvent } from "@/lib/events";

export const runtime = "nodejs";

/** Every approved member can see the schedule. */
export async function GET() {
    try {
        await requireUser();
        const snap = await club<ClubEvent>(COLLECTIONS.events).get();
        const events = snap.docs.map((d) => d.data()).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
        return NextResponse.json({ ok: true, events });
    } catch (error) {
        return authErrorResponse(error);
    }
}

/** Only admins and mentors schedule sessions. */
export async function POST(request: NextRequest) {
    try {
        const { member } = await requireAdmin();

        const parsed = eventInputSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid session" },
                { status: 400 },
            );
        }

        const ref = club<ClubEvent>(COLLECTIONS.events).doc();
        const now = new Date().toISOString();
        const event: ClubEvent = {
            ...parsed.data,
            id: ref.id,
            createdBy: member.usn,
            createdAt: now,
            updatedAt: now,
        };

        await ref.set(event);
        return NextResponse.json({ ok: true, event }, { status: 201 });
    } catch (error) {
        return authErrorResponse(error);
    }
}
