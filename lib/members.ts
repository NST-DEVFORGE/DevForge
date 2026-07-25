import { unstable_cache } from "next/cache";
import { FieldPath } from "firebase-admin/firestore";
import { club, external, COLLECTIONS } from "./firebase/collections";
import type { MemberRecord } from "./session";

/** Cache tag for anything derived from the member roster; revalidated on writes. */
export const MEMBERS_TAG = "members";

export interface MemberCard {
    usn: string;
    name: string;
    role: string;
    councilPosition?: string;
    points: number;
    badges: number;
    /** Bare GitHub username, never a URL, see normalizeGithub. */
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
async function fetchRoster(): Promise<MemberCard[]> {
    const snap = await club<MemberRecord>(COLLECTIONS.members).get();
    const members = snap.docs.map((d) => d.data()).filter((m) => m.status === "approved");

    // One batched query for every student we need, instead of a read per member
    // (the old N+1). Firestore caps `in` at 30, so chunk the USNs.
    const needPortal = members
        .filter((m) => !m.github || !m.linkedin || m.photo === undefined)
        .map((m) => m.usn);

    const students = new Map<string, Record<string, string>>();
    for (let i = 0; i < needPortal.length; i += 30) {
        const chunk = needPortal.slice(i, i + 30);
        if (chunk.length === 0) continue;
        const result = await external("students").where(FieldPath.documentId(), "in", chunk).get();
        result.forEach((doc) => students.set(doc.id, doc.data() as Record<string, string>));
    }

    return members
        .map((member): MemberCard => {
            const data = students.get(member.usn) ?? {};
            return {
                usn: member.usn,
                name: member.name,
                role: member.role,
                councilPosition: member.councilPosition,
                points: member.points ?? 0,
                badges: member.badges ?? 0,
                github: normalizeGithub(member.github ?? data.github),
                linkedin: normalizeLinkedin(member.linkedin ?? data.linkedin),
                hasPhoto: Boolean(member.photo || data.photo),
            };
        })
        .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

/**
 * Cached roster. The members page and leaderboard both call this; without a
 * cache each visit cost ~27 Firestore reads (the members collection plus a
 * student read each), which on the free tier's daily read budget adds up fast.
 * Now it's ~14 reads at most once per minute, shared across every navigation
 * and every user, a large cut in both latency and read count. A newly approved
 * member appears in the directory within a minute.
 */
export const loadRoster = unstable_cache(fetchRoster, ["devforge-roster"], {
    tags: [MEMBERS_TAG],
    revalidate: 60,
});
