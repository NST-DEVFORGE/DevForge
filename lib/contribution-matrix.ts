import prData from "@/pr-data-report.json";
import esocStats from "@/data/esoc-stats.json";

export interface ContributionCell {
    member: string;
    org: string;
    count: number;
}

/**
 * Real member -> organization PR counts, built entirely from static data
 * already in the repo (no live GitHub calls, so it can't fail at request
 * time the way /api/pr-breakdown can). Only covers members with recorded
 * GSoC-org PR lists or ESoC org breakdowns — not every contributor has
 * org-level detail available, so this is a real but partial view.
 */
export function buildContributionMatrix() {
    // esoc-stats.json only carries a github handle (in both `name` and `github`);
    // pr-data-report.json has real display names. Key everything by handle so the
    // two sources merge into one row per person instead of two.
    const displayName = new Map<string, string>();
    for (const m of prData.members) displayName.set(m.github, m.name);

    const cellMap = new Map<string, ContributionCell>();

    const addCount = (github: string, org: string, count: number) => {
        if (count <= 0) return;
        const key = `${github}::${org}`;
        const existing = cellMap.get(key);
        if (existing) {
            existing.count += count;
        } else {
            cellMap.set(key, { member: displayName.get(github) ?? github, org, count });
        }
    };

    for (const m of prData.members) {
        const orgCounts = new Map<string, number>();
        for (const pr of m.gsocPRList ?? []) {
            const org = pr.repo.split("/")[0];
            orgCounts.set(org, (orgCounts.get(org) ?? 0) + 1);
        }
        orgCounts.forEach((count, org) => addCount(m.github, org, count));
    }

    for (const m of esocStats.members) {
        for (const org of m.esocPRs.orgs) {
            addCount(m.github, org.name, org.merged + org.open);
        }
    }

    const cells = Array.from(cellMap.values());
    const members = Array.from(new Set(cells.map((c) => c.member))).sort();
    const orgs = Array.from(new Set(cells.map((c) => c.org))).sort();
    const maxCount = Math.max(...cells.map((c) => c.count), 1);

    return { cells, members, orgs, maxCount };
}
