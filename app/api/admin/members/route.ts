import { NextResponse } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireAdmin, type MemberRecord } from "@/lib/session";

export const runtime = "nodejs";

export interface AdminMemberRow {
    usn: string;
    name: string;
    email: string;
    role: string;
    status: string;
    note?: string;
    requestedAt?: string;
    joinedAt?: string;
    /** True once they've replaced the password we emailed them. */
    hasSignedIn: boolean;
}

/** Full roster including pending and rejected. Admins and mentors only. */
export async function GET() {
    try {
        await requireAdmin();

        const snap = await club<MemberRecord & { note?: string; requestedAt?: string; joinedAt?: string; passwordChangedAt?: string }>(
            COLLECTIONS.members,
        ).get();

        const rows: AdminMemberRow[] = snap.docs.map((d) => {
            const m = d.data();
            return {
                usn: m.usn,
                name: m.name,
                email: m.email,
                role: m.role,
                status: m.status,
                note: m.note,
                requestedAt: m.requestedAt,
                joinedAt: m.joinedAt,
                hasSignedIn: Boolean(m.passwordChangedAt),
            };
        });

        const order = { pending: 0, approved: 1, rejected: 2 } as Record<string, number>;
        rows.sort(
            (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3) || a.name.localeCompare(b.name),
        );

        return NextResponse.json({ ok: true, members: rows });
    } catch (error) {
        return authErrorResponse(error);
    }
}
