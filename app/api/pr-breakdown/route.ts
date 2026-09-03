import { NextResponse } from "next/server";
import { isGsocOrg } from "@/data/gsoc-orgs";
import { ossRoster, type Contributor } from "@/lib/oss-roster";
import { GithubError, allPRsFor, prState, repoNameFromUrl, type PRState } from "@/lib/github-prs";

export const runtime = "nodejs";

interface PR {
    title: string;
    url: string;
    repo: string;
    number: number;
    date: string;
    state: PRState;
    isGsoc: boolean;
}

interface MemberData {
    name: string;
    github: string;
    merged: PR[];
    open: PR[];
    closed: PR[];
    gsocPRs: PR[];
}

async function fetchPRsForUser(person: Contributor): Promise<MemberData> {
    const result: MemberData = {
        name: person.name,
        github: person.github,
        merged: [],
        open: [],
        closed: [],
        gsocPRs: [],
    };

    // One paged query for every state at once. Three separate searches per
    // member is what exhausted the search budget and left open and closed
    // silently empty on the GSoC page.
    const prs = await allPRsFor(person.github);

    for (const pr of prs) {
        const repo = repoNameFromUrl(pr.repository_url);
        const isGsoc = isGsocOrg(repo.split("/")[0]);
        const state: PRState = prState(pr);

        const entry: PR = {
            title: pr.title,
            url: pr.html_url,
            repo,
            number: pr.number,
            date: pr.closed_at ?? pr.created_at,
            state,
            isGsoc,
        };

        result[state].push(entry);
        if (isGsoc) result.gsocPRs.push(entry);
    }

    return result;
}

export async function GET() {
    try {
        const roster = await ossRoster();

        const membersData: MemberData[] = [];
        const unavailable: string[] = [];

        for (const person of roster) {
            try {
                membersData.push(await fetchPRsForUser(person));
            } catch (error) {
                console.error(`[pr-breakdown] ${person.github}:`, error);
                unavailable.push(person.github);
            }
        }

        const summary = {
            merged: 0,
            open: 0,
            closed: 0,
            total: 0,
            gsocMerged: 0,
            gsocOpen: 0,
            gsocClosed: 0,
            gsocTotal: 0,
        };

        for (const m of membersData) {
            summary.merged += m.merged.length;
            summary.open += m.open.length;
            summary.closed += m.closed.length;
            summary.gsocMerged += m.gsocPRs.filter((p) => p.state === "merged").length;
            summary.gsocOpen += m.gsocPRs.filter((p) => p.state === "open").length;
            summary.gsocClosed += m.gsocPRs.filter((p) => p.state === "closed").length;
        }
        summary.total = summary.merged + summary.open + summary.closed;
        summary.gsocTotal = summary.gsocMerged + summary.gsocOpen + summary.gsocClosed;

        return NextResponse.json({
            summary,
            members: membersData
                .map((m) => {
                    const orgStats: Record<string, { merged: number; open: number; closed: number; prs: PR[] }> = {};
                    for (const pr of m.gsocPRs) {
                        const org = pr.repo.split("/")[0];
                        orgStats[org] ??= { merged: 0, open: 0, closed: 0, prs: [] };
                        orgStats[org][pr.state]++;
                        orgStats[org].prs.push(pr);
                    }

                    return {
                        name: m.name,
                        github: m.github,
                        merged: m.merged.length,
                        open: m.open.length,
                        closed: m.closed.length,
                        gsocMerged: m.gsocPRs.filter((p) => p.state === "merged").length,
                        gsocOpen: m.gsocPRs.filter((p) => p.state === "open").length,
                        gsocClosed: m.gsocPRs.filter((p) => p.state === "closed").length,
                        gsocPRs: m.gsocPRs,
                        orgBreakdown: Object.entries(orgStats)
                            .map(([org, stats]) => ({
                                org,
                                merged: stats.merged,
                                open: stats.open,
                                closed: stats.closed,
                                total: stats.merged + stats.open + stats.closed,
                                prs: stats.prs,
                            }))
                            .sort((a, b) => b.total - a.total),
                    };
                })
                .filter((m) => m.gsocPRs.length > 0),
            lastUpdated: new Date().toISOString(),
            unavailable,
        });
    } catch (error) {
        const status = error instanceof GithubError ? 503 : 500;
        console.error("[pr-breakdown] failed:", error);
        return NextResponse.json(
            { message: error instanceof GithubError ? error.message : "Could not load the PR breakdown." },
            { status },
        );
    }
}
