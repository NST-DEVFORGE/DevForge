import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE, hashPassword, signSession, verifyPassword } from "@/lib/auth";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
        .string()
        .min(10, "Use at least 10 characters")
        .max(200, "That password is too long")
        .refine((v) => !/^\s|\s$/.test(v), "Password can't start or end with a space"),
});

export async function POST(request: NextRequest) {
    try {
        const session = await requireUser();

        const limit = await checkRateLimit("password-change", session.usn, RATE_LIMITS.passwordChange);
        if (!limit.ok) {
            return NextResponse.json(
                { ok: false, message: "Too many attempts. Try again shortly." },
                { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
            );
        }

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request" },
                { status: 400 },
            );
        }

        const { currentPassword, newPassword } = parsed.data;
        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        if (!(await verifyPassword(currentPassword, member.passwordHash))) {
            return NextResponse.json({ ok: false, message: "Current password is incorrect" }, { status: 401 });
        }
        if (await verifyPassword(newPassword, member.passwordHash)) {
            return NextResponse.json(
                { ok: false, message: "New password must be different from the current one" },
                { status: 400 },
            );
        }

        await club(COLLECTIONS.members).doc(session.usn).update({
            passwordHash: await hashPassword(newPassword),
            mustChangePassword: false,
            passwordChangedAt: new Date().toISOString(),
        });

        // Reissue so the session reflects the change and the old cookie's
        // remaining lifetime isn't tied to the retired password.
        const response = NextResponse.json({ ok: true, message: "Password updated" });
        response.cookies.set(
            AUTH_COOKIE,
            signSession({ usn: member.usn, name: member.name, role: member.role }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            },
        );
        return response;
    } catch (error) {
        return authErrorResponse(error);
    }
}
