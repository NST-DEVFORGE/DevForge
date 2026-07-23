import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireAdmin, type MemberRecord } from "@/lib/session";
import { generatePassword, hashPassword } from "@/lib/auth";
import { sendCredentialsEmail } from "@/lib/email";

export const runtime = "nodejs";

type Params = { params: Promise<{ usn: string }> };

const schema = z.object({
    action: z.enum(["approve", "reject", "set-role"]),
    role: z.enum(["member", "mentor", "admin"]).optional(),
});

export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { member: actor } = await requireAdmin();
        const { usn } = await params;

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
        }
        const { action, role } = parsed.data;

        const ref = club<MemberRecord>(COLLECTIONS.members).doc(usn);
        const snap = await ref.get();
        if (!snap.exists) return NextResponse.json({ ok: false, message: "No such member" }, { status: 404 });

        const target = snap.data() as MemberRecord;

        // An admin demoting or rejecting themselves can lock everyone out of
        // the admin area, so it is refused outright.
        if (target.usn === actor.usn && action !== "approve") {
            return NextResponse.json(
                { ok: false, message: "You can't change your own access." },
                { status: 409 },
            );
        }

        if (action === "set-role") {
            if (!role) return NextResponse.json({ ok: false, message: "No role given" }, { status: 400 });
            await ref.update({ role });
            return NextResponse.json({ ok: true, message: `${target.name} is now ${role}.` });
        }

        if (action === "reject") {
            await ref.update({ status: "rejected", passwordHash: "" });
            return NextResponse.json({ ok: true, message: `${target.name}'s request was declined.` });
        }

        // approve
        if (target.status === "approved") {
            return NextResponse.json({ ok: true, message: `${target.name} is already a member.` });
        }
        if (!target.email) {
            return NextResponse.json(
                { ok: false, message: `No email on ${target.name}'s student record — can't send credentials.` },
                { status: 409 },
            );
        }

        const password = generatePassword();
        await ref.update({
            status: "approved",
            role: target.role || "member",
            passwordHash: await hashPassword(password),
            mustChangePassword: true,
            points: target.points ?? 0,
            badges: target.badges ?? 0,
            joinedAt: new Date().toISOString(),
        });

        try {
            await sendCredentialsEmail({
                to: target.email,
                name: target.name,
                username: target.usn,
                password,
            });
        } catch {
            // The account is live either way; say so plainly rather than
            // implying the member has credentials they never received.
            return NextResponse.json({
                ok: true,
                message: `${target.name} was approved, but the credentials email failed to send. Reissue it from the roster.`,
            });
        }

        return NextResponse.json({ ok: true, message: `${target.name} approved and emailed.` });
    } catch (error) {
        return authErrorResponse(error);
    }
}
