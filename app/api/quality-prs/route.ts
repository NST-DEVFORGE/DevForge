import { NextResponse } from "next/server";
import { ossRoster, type Contributor } from "@/lib/oss-roster";
import {
    GithubError,
    QUALITY_FORKS,
    QUALITY_STARS,
    allPRsFor,
    isQualityRepo,
    prState,
    repoFacts,
} from "@/lib/github-prs";

export const runtime = "nodejs";

interface QualityPR {
    title: string;
    url: string;
    number: number;
    mergedAt: string | null;
    repoName: string;
    repoUrl: string;
    repoStars: number;
    repoForks: number;
    author: { name: string; github: string; avatar: string };
}

/**
 * Merged PRs into repositories with genuine adoption behind them.
 *
 * Paging matters here more than anywhere else on the site: the old single
 * hundred-result request meant the most prolific contributors — the exact
 * people this page exists to show — were the ones getting cut off.
 */
async function qualityPRsFor(person: Contributor): Promise<QualityPR[]> {
    const merged = (await allPRsFor(person.github)).filter((pr) => prState(pr) === "merged");
    const out: QualityPR[] = [];

    for (const pr of merged) {
        const facts = await repoFacts(pr.repository_url);
        if (!isQualityRepo(facts) || !facts) continue;

        out.push({
            title: pr.title,
            url: pr.html_url,
            number: pr.number,
            mergedAt: pr.closed_at,
            repoName: facts.name,
            repoUrl: `https://github.com/${facts.name}`,
            repoStars: facts.stars,
            repoForks: facts.forks,
            author: { name: person.name, github: person.github, avatar: person.avatar },
        });
    }

    return out;
}

export async function GET() {
    try {
        const roster = await ossRoster();
        const prs: QualityPR[] = [];
        const unavailable: string[] = [];

        for (const person of roster) {
            try {
                prs.push(...(await qualityPRsFor(person)));
            } catch (error) {
                console.error(`[quality-prs] ${person.github}:`, error);
                unavailable.push(person.github);
            }
        }

        prs.sort((a, b) => (b.mergedAt ?? "").localeCompare(a.mergedAt ?? ""));

        return NextResponse.json({
            prs,
            totalCount: prs.length,
            threshold: { stars: QUALITY_STARS, forks: QUALITY_FORKS },
            lastUpdated: new Date().toISOString(),
            unavailable,
        });
    } catch (error) {
        const status = error instanceof GithubError ? 503 : 500;
        console.error("[quality-prs] failed:", error);
        return NextResponse.json(
            { message: error instanceof GithubError ? error.message : "Could not load quality PRs." },
            { status },
        );
    }
}
