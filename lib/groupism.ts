import fs from "fs";
import path from "path";
import seedDataJson from "@/data/groupism-seed.json";

export interface GroupismPR {
    id: number;
    number: number;
    title: string;
    repo: string;
    org: string;
    url: string;
    created_at: string;
    merged_at: string;
    additions: number;
    deletions: number;
    total_lines: number;
    changed_files: number;
    author: "geetansh" | "sahitya";
}

export interface CompetitorProfile {
    key: "geetansh" | "sahitya";
    username: string;
    name: string;
    title: string;
    avatar: string;
    githubUrl: string;
    orgs: string[];
    orgLabels: string[];
    themeColor: string; // Tailwind color accent
    tagline: string;
    prs: GroupismPR[];
    stats: {
        totalPRs: number;
        additions: number;
        deletions: number;
        totalLines: number;
        netLines: number;
        biggestPR: GroupismPR | null;
        avgLinesPerPR: number;
    };
}

export interface GroupismResponse {
    lastUpdated: string;
    source: "live" | "snapshot";
    geetansh: CompetitorProfile;
    sahitya: CompetitorProfile;
    summary: {
        totalLinesCombined: number;
        totalPRsCombined: number;
        rateDefault: number; // ₹10 / line
        differenceLines: number;
        leader: "geetansh" | "sahitya" | "tied";
        netDebt: number; // at rateDefault
    };
}

function calculateProfileStats(prs: GroupismPR[]) {
    const totalPRs = prs.length;
    const additions = prs.reduce((sum, pr) => sum + (pr.additions || 0), 0);
    const deletions = prs.reduce((sum, pr) => sum + (pr.deletions || 0), 0);
    const totalLines = additions + deletions;
    const netLines = additions - deletions;

    let biggestPR: GroupismPR | null = null;
    let maxLines = -1;
    for (const pr of prs) {
        if (pr.total_lines > maxLines) {
            maxLines = pr.total_lines;
            biggestPR = pr;
        }
    }

    const avgLinesPerPR = totalPRs > 0 ? Math.round(totalLines / totalPRs) : 0;

    return {
        totalPRs,
        additions,
        deletions,
        totalLines,
        netLines,
        biggestPR,
        avgLinesPerPR,
    };
}

export function getSeedGroupismData(): GroupismResponse {
    try {
        let seed: any = seedDataJson;
        try {
            const seedPath = path.join(process.cwd(), "data", "groupism-seed.json");
            if (fs.existsSync(seedPath)) {
                const raw = fs.readFileSync(seedPath, "utf-8");
                seed = JSON.parse(raw);
            }
        } catch {
            seed = seedDataJson;
        }

        const geetanshPrs: GroupismPR[] = (seed.geetansh?.prs || []).map((pr: any) => ({
            ...pr,
            author: "geetansh",
        }));

        const sahityaPrs: GroupismPR[] = (seed.sahitya?.prs || []).map((pr: any) => ({
            ...pr,
            author: "sahitya",
        }));

        const geetanshStats = calculateProfileStats(geetanshPrs);
        const sahityaStats = calculateProfileStats(sahityaPrs);

        const diff = sahityaStats.totalLines - geetanshStats.totalLines;
        const leader = diff > 0 ? "sahitya" : diff < 0 ? "geetansh" : "tied";
        const rateDefault = 10; // ₹10 per line of code based on user prompt (57 lines = ₹570)
        const netDebt = Math.abs(diff) * rateDefault;

        return {
            lastUpdated: seed.lastUpdated || new Date().toISOString(),
            source: "snapshot",
            geetansh: {
                key: "geetansh",
                username: "geetxnshgoyal",
                name: "Geetansh Goyal",
                title: "openSUSE & Uyuni Champion",
                avatar: "https://avatars.githubusercontent.com/geetxnshgoyal",
                githubUrl: "https://github.com/geetxnshgoyal",
                orgs: ["openSUSE", "uyuni-project"],
                orgLabels: ["openSUSE 🦎", "Uyuni Project 🚀"],
                themeColor: "#22c55e", // emerald/green
                tagline: "Ruling the green lizard realm & enterprise systems automation",
                prs: geetanshPrs.sort((a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()),
                stats: geetanshStats,
            },
            sahitya: {
                key: "sahitya",
                username: "sahitya0xsingh",
                name: "Sahitya Singh",
                title: "Checkstyle Code Quality Titan",
                avatar: "https://avatars.githubusercontent.com/sahitya0xsingh",
                githubUrl: "https://github.com/sahitya0xsingh",
                orgs: ["checkstyle"],
                orgLabels: ["Checkstyle ☕"],
                themeColor: "#f59e0b", // amber/gold
                tagline: "Enforcing clean Java code across thousands of repositories",
                prs: sahityaPrs.sort((a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()),
                stats: sahityaStats,
            },
            summary: {
                totalLinesCombined: geetanshStats.totalLines + sahityaStats.totalLines,
                totalPRsCombined: geetanshStats.totalPRs + sahityaStats.totalPRs,
                rateDefault,
                differenceLines: Math.abs(diff),
                leader,
                netDebt,
            },
        };
    } catch (err) {
        console.error("Failed to read groupism seed:", err);
        throw err;
    }
}

// Live fetcher with GitHub token
export async function fetchLiveGroupismData(): Promise<GroupismResponse> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return getSeedGroupismData();
    }

    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "DevForge-Groupism",
        Authorization: `token ${token}`,
    };

    async function fetchUserPRs(author: string, orgs: string[], authorKey: "geetansh" | "sahitya"): Promise<GroupismPR[]> {
        const results: GroupismPR[] = [];

        for (const org of orgs) {
            const q = `author:${author} org:${org} is:pr is:merged`;
            const sRes = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100`, {
                headers,
                next: { revalidate: 3600 },
            });
            if (!sRes.ok) continue;
            const sData = await sRes.json();
            const items = sData.items || [];

            const pullPromises = items.map(async (item: any) => {
                const repoUrl = item.repository_url;
                const [owner, repo] = repoUrl.split("/").slice(-2);
                try {
                    const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${item.number}`, {
                        headers,
                        next: { revalidate: 3600 },
                    });
                    if (prRes.ok) {
                        const p = await prRes.json();
                        return {
                            id: p.id,
                            number: p.number,
                            title: p.title,
                            repo: `${owner}/${repo}`,
                            org: owner,
                            url: p.html_url,
                            created_at: p.created_at,
                            merged_at: p.merged_at || item.closed_at,
                            additions: p.additions || 0,
                            deletions: p.deletions || 0,
                            total_lines: (p.additions || 0) + (p.deletions || 0),
                            changed_files: p.changed_files || 0,
                            author: authorKey,
                        } as GroupismPR;
                    }
                } catch {
                    // fall back
                }
                return null;
            });
            const pulled = (await Promise.all(pullPromises)).filter((p): p is GroupismPR => p !== null);
            results.push(...pulled);
        }

        return results;
    }

    try {
        const [geetanshPrs, sahityaPrs] = await Promise.all([
            fetchUserPRs("geetxnshgoyal", ["openSUSE", "uyuni-project"], "geetansh"),
            fetchUserPRs("sahitya0xsingh", ["checkstyle"], "sahitya"),
        ]);

        if (geetanshPrs.length === 0 && sahityaPrs.length === 0) {
            return getSeedGroupismData();
        }

        const geetanshStats = calculateProfileStats(geetanshPrs);
        const sahityaStats = calculateProfileStats(sahityaPrs);
        const diff = sahityaStats.totalLines - geetanshStats.totalLines;
        const leader = diff > 0 ? "sahitya" : diff < 0 ? "geetansh" : "tied";
        const rateDefault = 10;
        const netDebt = Math.abs(diff) * rateDefault;

        return {
            lastUpdated: new Date().toISOString(),
            source: "live",
            geetansh: {
                key: "geetansh",
                username: "geetxnshgoyal",
                name: "Geetansh Goyal",
                title: "openSUSE & Uyuni Champion",
                avatar: "https://avatars.githubusercontent.com/geetxnshgoyal",
                githubUrl: "https://github.com/geetxnshgoyal",
                orgs: ["openSUSE", "uyuni-project"],
                orgLabels: ["openSUSE 🦎", "Uyuni Project 🚀"],
                themeColor: "#22c55e",
                tagline: "Ruling the green lizard realm & enterprise systems automation",
                prs: geetanshPrs.sort((a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()),
                stats: geetanshStats,
            },
            sahitya: {
                key: "sahitya",
                username: "sahitya0xsingh",
                name: "Sahitya Singh",
                title: "Checkstyle Code Quality Titan",
                avatar: "https://avatars.githubusercontent.com/sahitya0xsingh",
                githubUrl: "https://github.com/sahitya0xsingh",
                orgs: ["checkstyle"],
                orgLabels: ["Checkstyle ☕"],
                themeColor: "#f59e0b",
                tagline: "Enforcing clean Java code across thousands of repositories",
                prs: sahityaPrs.sort((a, b) => new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime()),
                stats: sahityaStats,
            },
            summary: {
                totalLinesCombined: geetanshStats.totalLines + sahityaStats.totalLines,
                totalPRsCombined: geetanshStats.totalPRs + sahityaStats.totalPRs,
                rateDefault,
                differenceLines: Math.abs(diff),
                leader,
                netDebt,
            },
        };
    } catch {
        return getSeedGroupismData();
    }
}
