import { NextResponse, type NextRequest } from "next/server";
import { club, unguardedDb, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { isPast, rsvpId, type ClubEvent, type Rsvp } from "@/lib/events";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/** Who's coming. Visible to any signed-in member. */
export async function GET(_request: NextRequest, { params }: Params) {
    try {
        await requireUser();
        const { id } = await params;
        const snap = await club<Rsvp>(COLLECTIONS.rsvps).where("eventId", "==", id).get();
        return NextResponse.json({
            ok: true,
            attendees: snap.docs.map((d) => d.data()).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
        });
    } catch (error) {
        return authErrorResponse(error);
    }
}

/**
 * Claims a spot. The RSVP id is `${eventId}:${usn}`, so a double-click can't
 * produce two rows, and the capacity check runs inside a transaction — two
 * members racing for the last seat can't both win.
 */
export async function POST(_request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id } = await params;

        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        const eventRef = club<ClubEvent>(COLLECTIONS.events).doc(id);
        const rsvpRef = club<Rsvp>(COLLECTIONS.rsvps).doc(rsvpId(id, session.usn));

        const result = await unguardedDb().runTransaction(async (tx) => {
            const eventSnap = await tx.get(eventRef);
            if (!eventSnap.exists) return { status: 404 as const, message: "That session doesn't exist." };

            const event = eventSnap.data() as ClubEvent;
            if (isPast(event)) return { status: 409 as const, message: "That session has already happened." };

            const existing = await tx.get(rsvpRef);
            if (existing.exists) return { status: 200 as const, message: "You're already on the list.", going: true };

            if (event.capacity !== null) {
                const taken = await tx.get(club<Rsvp>(COLLECTIONS.rsvps).where("eventId", "==", id));
                if (taken.size >= event.capacity) {
                    return { status: 409 as const, message: "That session is full." };
                }
            }

            tx.set(rsvpRef, {
                id: rsvpRef.id,
                eventId: id,
                usn: member.usn,
                name: member.name,
                createdAt: new Date().toISOString(),
            });
            return { status: 201 as const, message: "You're going.", going: true };
        });

        return NextResponse.json(
            { ok: result.status < 400, message: result.message, going: result.going ?? false },
            { status: result.status },
        );
    } catch (error) {
        return authErrorResponse(error);
    }
}

/** Gives the spot back. Idempotent — cancelling twice is not an error. */
export async function DELETE(_request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id } = await params;
        await club(COLLECTIONS.rsvps).doc(rsvpId(id, session.usn)).delete();
        return NextResponse.json({ ok: true, going: false, message: "You're no longer going." });
    } catch (error) {
        return authErrorResponse(error);
    }
}
