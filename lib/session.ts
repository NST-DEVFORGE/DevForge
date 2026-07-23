import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifySession, type MemberRole, type SessionClaims } from "./auth";
import { club, COLLECTIONS } from "./firebase/collections";

const ELEVATED: MemberRole[] = ["admin", "mentor"];

export interface MemberRecord {
    usn: string;
    name: string;
    email: string;
    role: MemberRole;
    status: "pending" | "approved" | "rejected";
    passwordHash: string;
    mustChangePassword?: boolean;
    points?: number;
    badges?: number;
}

export class AuthError extends Error {
    constructor(
        readonly status: 401 | 403,
        message: string,
    ) {
        super(message);
        this.name = "AuthError";
    }
}

/** Session claims from the httpOnly cookie, or null. Never throws. */
export async function getSession(): Promise<SessionClaims | null> {
    const store = await cookies();
    return verifySession(store.get(AUTH_COOKIE)?.value);
}

export async function requireUser(): Promise<SessionClaims> {
    const session = await getSession();
    if (!session) throw new AuthError(401, "Sign in to continue");
    return session;
}

export async function getMember(usn: string): Promise<MemberRecord | null> {
    const snap = await club<MemberRecord>(COLLECTIONS.members).doc(usn).get();
    return snap.exists ? (snap.data() as MemberRecord) : null;
}

/**
 * Authorizes against the member's *current* Firestore record, not the token's
 * claims. Tokens live 7 days, so a role encoded at sign-in would otherwise
 * outlive a demotion or a revoked account.
 */
export async function requireAdmin(): Promise<{ session: SessionClaims; member: MemberRecord }> {
    const session = await requireUser();
    const member = await getMember(session.usn);

    if (!member || member.status !== "approved") throw new AuthError(403, "Account is not active");
    if (!ELEVATED.includes(member.role)) throw new AuthError(403, "Admin access required");

    return { session, member };
}

/** Turns an AuthError into its response; rethrows anything else so real bugs still surface. */
export function authErrorResponse(error: unknown): NextResponse {
    if (error instanceof AuthError) {
        return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    throw error;
}
