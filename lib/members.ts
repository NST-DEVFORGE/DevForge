import { club, external, COLLECTIONS } from "./firebase/collections";
import type { MemberRecord } from "./session";

export interface MemberCard {
    usn: string;
    name: string;
    role: string;
    points: number;
    badges: number;
    /** Bare GitHub username, never a URL — see normalizeGithub. */
    github?: string;
    linkedin?: string;
    /** Photos are fetched separately from /api/members/[usn]/avatar. */
    hasPhoto: boolean;
}

/**
 * The student portal stores `github` as a full URL, and a few rows point at a
 * repository rather than a profile ("…/aditithakur1408/To-do-list"). Everything
 * downstream wants the bare username, so take the first path segment.
 */
export function normalizeGithub(value: string | undefined | null): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const withoutHost = trimmed
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .replace(/^github\.com\//i, "");

    const username = withoutHost.split(/[/?#]/)[0]?.trim();
    // GitHub usernames: alphanumeric and hyphens, no leading/trailing hyphen.
    return username && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)
        ? username
        : undefined;
}

/** Full https URL for an href, or undefined if it isn't one. */
export function normalizeLinkedin(value: string | undefined | null): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
}

/**
 * Club roster for the member directory. Contact details are deliberately
 * omitted: the club app has no reason to redistribute the student portal's
 * email addresses or phone numbers, so only what a profile card renders is
 * returned.
 */
export async function loadRoster(): Promise<MemberCard[]> {
    const snap = await club<MemberRecord>(COLLECTIONS.members).get();
    const members = snap.docs.map((d) => d.data()).filter((m) => m.status === "approved");

    const cards = await Promise.all(
        members.map(async (member): Promise<MemberCard> => {
            // Off-roster members (mentors) carry their own identity fields;
            // student members leave them unset and we look them up by USN. Only
            // hit the portal when the member doc doesn't already have the field.
            const needsPortal = !member.github || !member.linkedin || member.photo === undefined;
            const student = needsPortal ? await external("students").doc(member.usn).get() : null;
            const data = student?.exists ? (student.data() as Record<string, string>) : {};
            return {
                usn: member.usn,
                name: member.name,
                role: member.role,
                points: member.points ?? 0,
                badges: member.badges ?? 0,
                github: normalizeGithub(member.github ?? data.github),
                linkedin: normalizeLinkedin(member.linkedin ?? data.linkedin),
                hasPhoto: Boolean(member.photo || data.photo),
            };
        }),
    );

    return cards.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}
