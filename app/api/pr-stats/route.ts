import { NextResponse } from "next/server";
import { ossRoster, type Contributor } from "@/lib/oss-roster";
import { GithubError, allPRsFor, isQualityRepo, prState, repoFacts } from "@/lib/github-prs";

export const runtime = "nodejs";

const TEAM_MILESTONES = [
    { name: "Bronze", count: 50, emoji: "🥉" },
    { name: "Silver", count: 100, emoji: "🥈" },
    { name: "Gold", count: 250, emoji: "🥇" },
    { name: "Platinum", count: 500, emoji: "💎" },
    { name: "Diamond", count: 1000, emoji: "🏆" },
];

const INDIVIDUAL_MILESTONES = [
    { name: "Beginner", count: 5, emoji: "🌱" },
    { name: "Contributor", count: 15, emoji: "🪪" },
    { name: "Active", count: 25, emoji: "👕" },
    { name: "Champion", count: 50, emoji: "🏅" },
    { name: "Legend", count: 100, emoji: "👑" },
    { name: "Master", count: 200, emoji: "🚀" },
];

type Milestone = (typeof INDIVIDUAL_MILESTONES)[number];

interface PRStats extends Contributor {
    /** Merged PRs into repositories with real adoption. Counted, never typed in. */
    prCount: number;
    /** Every merged PR, anywhere. */
    totalPRs: number;
    milestones: Milestone[];
    nextMilestone: (Milestone & { progress: number }) | null;
    /** False when GitHub could not be reached for this member. */
    live: boolean;
}

function calculateMilestones(count: number, milestones: Milestone[]) {
    const achieved = milestones.filter((m) => count >= m.count);
    const next = milestones.find((m) => count < m.count);

    if (!next) return { achieved, nextMilestone: null };

    const previousCount = achieved[achieved.length - 1]?.count ?? 0;
    const progress = ((count - previousCount) / (next.count - previousCount)) * 100;
    return { achieved, nextMilestone: { ...next, progress } };
}

/**
 * Both counts for one member, from GitHub.
 *
 * Quality PRs used to be a number somebody typed into this file and edited by
 * hand when it drifted, which meant this route and /api/quality-prs — which
 * computed the same thing live — regularly disagreed on the same page. Both now
 * apply the same rule to the same data.
 */
async function statsFor(person: Contributor): Promise<PRStats> {
    try {
        const merged = (await allPRsFor(person.github)).filter((pr) => prState(pr) === "merged");

        // Sequential on purpose: repoFacts caches per repository, and a parallel
        // burst would fire duplicate lookups for the same repo before the first
        // one lands. Popular repositories repeat constantly here.
        let quality = 0;
        for (const pr of merged) {
            if (isQualityRepo(await repoFacts(pr.repository_url))) quality++;
        }

        const { achieved, nextMilestone } = calculateMilestones(quality, INDIVIDUAL_MILESTONES);
        return {
            ...person,
            prCount: quality,
            totalPRs: merged.length,
            milestones: achieved,
            nextMilestone,
            live: true,
        };
    } catch (error) {
        // Reported as zero and flagged, not silently replaced with a stale
        // hand-written number that looks exactly like a real one.
        console.error(`[pr-stats] ${person.github}:`, error);
        return {
            ...person,
            prCount: 0,
            totalPRs: 0,
            milestones: [],
            nextMilestone: null,
            live: false,
        };
    }
}

export async function GET() {
    try {
        const roster = await ossRoster();

        const members: PRStats[] = [];
        for (const person of roster) {
            members.push(await statsFor(person));
        }

        const totalPRs = members.reduce((sum, m) => sum + m.prCount, 0);
        const totalAllPRs = members.reduce((sum, m) => sum + m.totalPRs, 0);
        const { achieved, nextMilestone } = calculateMilestones(totalPRs, TEAM_MILESTONES);
        const stale = members.filter((m) => !m.live).map((m) => m.github);

        return NextResponse.json({
            totalPRs,
            totalAllPRs,
            members: members.sort((a, b) => b.prCount - a.prCount || b.totalPRs - a.totalPRs),
            teamMilestones: achieved,
            nextTeamMilestone: nextMilestone,
            lastUpdated: new Date().toISOString(),
            // Named so a page can say "some figures could not be refreshed"
            // instead of quietly rendering zeroes as though they were counts.
            unavailable: stale,
        });
    } catch (error) {
        const status = error instanceof GithubError ? 503 : 500;
        console.error("[pr-stats] failed:", error);
        return NextResponse.json(
            { message: error instanceof GithubError ? error.message : "Could not load PR stats." },
            { status },
        );
    }
}
