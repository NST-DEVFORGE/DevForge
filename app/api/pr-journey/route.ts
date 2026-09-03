import { NextResponse } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { resolveGithub } from "@/lib/member-github";
import { emptyJourney, type JourneyRecord } from "@/lib/pr-journey";

export const runtime = "nodejs";

/**
 * The signed-in member's own journey. Returns an empty record rather than a 404
 * for someone who has not started — "not started" is a state of the journey,
 * not an error.
 */
export async function GET() {
    try {
        const session = await requireUser();
        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        const snap = await club<JourneyRecord>(COLLECTIONS.prJourney).doc(session.usn).get();
        const github = await resolveGithub(session.usn, member.github);

        return NextResponse.json({
            ok: true,
            github,
            journey: snap.exists ? snap.data() : emptyJourney(session.usn, member.name, github),
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}
