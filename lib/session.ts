import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, verifySession, type MemberRole, type SessionClaims } from "./auth";
import { club, COLLECTIONS } from "./firebase/collections";
import { can, canAccessAdminArea, type Capability } from "./permissions";

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
    /**
     * Identity fields, optional. Student members leave these unset and their
     * GitHub/LinkedIn/photo are read from the student portal by USN. Off-roster
     * members (mentors, staff) aren't in that portal, so they carry their own
     * here instead. `photo` is a base64 data URI when present.
     */
    github?: string;
    linkedin?: string;
    photo?: string;
    /** Executive Council title, e.g. "President". Unset for regular members. */
    councilPosition?: string;
    joinedAt?: string;
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

/**
 * Wrapped in React cache() so the dashboard layout and the page it renders
 * share a single read per request instead of hitting Firestore twice on every
 * navigation. (Deduped within a request only; not cached across navigations,
 * so points/role stay current.)
 */
export const getMember = cache(async (usn: string): Promise<MemberRecord | null> => {
    const snap = await club<MemberRecord>(COLLECTIONS.members).doc(usn).get();
    return snap.exists ? (snap.data() as MemberRecord) : null;
});

/**
 * Loads the current member and confirms the account is active. Authorizes
 * against the *current* Firestore record, not the token's claims, tokens live
 * 7 days, so anything encoded at sign-in would outlive a change.
 */
export async function requireActiveMember(): Promise<{ session: SessionClaims; member: MemberRecord }> {
    const session = await requireUser();
    const member = await getMember(session.usn);
    if (!member || member.status !== "approved") throw new AuthError(403, "Account is not active");
    return { session, member };
}

/**
 * Requires a specific governance capability (see lib/permissions). Powers come
 * from the member's council position, not a blanket admin role.
 */
export async function requireCapability(
    capability: Capability,
): Promise<{ session: SessionClaims; member: MemberRecord }> {
    const { session, member } = await requireActiveMember();
    if (!can(member, capability)) throw new AuthError(403, "You don't have permission to do that");
    return { session, member };
}

/**
 * @deprecated Prefer requireCapability. Kept for the admin area gate: passes if
 * the member has any capability the /admin surfaces expose.
 */
export async function requireAdmin(): Promise<{ session: SessionClaims; member: MemberRecord }> {
    const { session, member } = await requireActiveMember();
    if (!canAccessAdminArea(member)) throw new AuthError(403, "Admin access required");
    return { session, member };
}

/** Turns an AuthError into its response; rethrows anything else so real bugs still surface. */
export function authErrorResponse(error: unknown): NextResponse {
    if (error instanceof AuthError) {
        return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }
    throw error;
}
