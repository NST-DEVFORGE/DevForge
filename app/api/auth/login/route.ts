import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE, signSession, verifyPassword } from "@/lib/auth";
import { getMember } from "@/lib/session";
import { checkRateLimit, clientIp, resetRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

/** One message for every failure mode, so the endpoint can't be used to enumerate members. */
const INVALID = "Invalid username or password";

export async function POST(request: NextRequest) {
    const ip = clientIp(request);
    const limit = await checkRateLimit("login", ip, RATE_LIMITS.login);
    if (!limit.ok) {
        return NextResponse.json(
            { ok: false, message: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).` },
            { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
        );
    }

    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ ok: false, message: INVALID }, { status: 400 });
    }

    const { username, password } = parsed.data;
    const member = await getMember(username);

    // Hash the supplied password even when the member is missing, so response
    // timing doesn't reveal which usernames exist.
    const valid = await verifyPassword(password, member?.passwordHash ?? "");

    if (!member || !valid) {
        return NextResponse.json({ ok: false, message: INVALID }, { status: 401 });
    }
    if (member.status !== "approved") {
        return NextResponse.json(
            { ok: false, message: "Your membership is still pending approval." },
            { status: 403 },
        );
    }

    await resetRateLimit("login", ip);

    const response = NextResponse.json({
        ok: true,
        mustChangePassword: member.mustChangePassword === true,
        user: {
            usn: member.usn,
            name: member.name,
            role: member.role,
            points: member.points ?? 0,
            badges: member.badges ?? 0,
        },
    });

    response.cookies.set(AUTH_COOKIE, signSession({ usn: member.usn, name: member.name, role: member.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
}
