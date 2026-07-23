import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireAdmin, type MemberRecord } from "@/lib/session";
import { sendToMembers } from "@/lib/push";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
    title: z.string().trim().min(1).max(80),
    body: z.string().trim().min(1).max(300),
    url: z.string().trim().startsWith("/", "Link must be a path on this site").max(300).optional(),
    /** Omit to notify every approved member. */
    usns: z.array(z.string()).max(500).optional(),
});

/**
 * Sends a push notification. Admins and mentors only — this reaches every
 * member's lock screen, so it is not something a regular account can trigger.
 */
export async function POST(request: NextRequest) {
    try {
        const { member } = await requireAdmin();

        const limit = await checkRateLimit("push-send", member.usn, RATE_LIMITS.passwordChange);
        if (!limit.ok) {
            return NextResponse.json(
                { ok: false, message: "Slow down — too many notifications sent recently." },
                { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
            );
        }

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid notification" },
                { status: 400 },
            );
        }

        let usns = parsed.data.usns;
        if (!usns) {
            const snap = await club<MemberRecord>(COLLECTIONS.members).where("status", "==", "approved").get();
            usns = snap.docs.map((d) => d.data().usn);
        }

        const report = await sendToMembers(usns, {
            title: parsed.data.title,
            body: parsed.data.body,
            url: parsed.data.url,
        });

        return NextResponse.json({
            ok: true,
            message: `Sent to ${report.sent} device${report.sent === 1 ? "" : "s"}.${
                report.pruned ? ` Removed ${report.pruned} expired.` : ""
            }`,
            ...report,
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}
