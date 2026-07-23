import { NextResponse } from "next/server";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";

export const runtime = "nodejs";

/** Current member, read fresh from Firestore so role and points aren't stale token claims. */
export async function GET() {
    try {
        const session = await requireUser();
        const member = await getMember(session.usn);

        if (!member || member.status !== "approved") {
            return NextResponse.json({ ok: false, message: "Account is not active" }, { status: 403 });
        }

        return NextResponse.json({
            ok: true,
            user: {
                usn: member.usn,
                name: member.name,
                email: member.email,
                role: member.role,
                points: member.points ?? 0,
                badges: member.badges ?? 0,
                mustChangePassword: member.mustChangePassword === true,
            },
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}
