import { NextResponse } from 'next/server';

// All DevForge GitHub handles
const GITHUB_HANDLES = [
    'geetxnshgoyal',
    'ravisharma-09',
    'Layyzyy',
    'luvyarana',
    'sharmavikas18',
    'AryanPatel-ui',
    'nithyarajmudhaliyar',
    'prateek6789-ai',
    'Sahitya0805',
    'saurabhyuvi14-ai',
    'SidharthxNST',
    'bhavesh-210',
    'unnati-jaiswal24',
    'Shristibot',
    'dhiraj-143r',
    'nishtha-agarwal-211',
];

// The 5 target orgs — GitHub org slug (lowercase) → display label
const TARGET_ORGS: Record<string, string> = {
    'opensuse':         'openSUSE',
    'openfoodfacts':    'OpenFoodFacts',
    'json-schema-org':  'JSONSchema',
    'zulip':            'Zulip',
    'mit-cml':          'MIT App',
};

// Jan 2026 – Jun 2026 monthly buckets
const MONTHS = [
    { label: 'Jan', start: '2026-01-01', end: '2026-01-31' },
    { label: 'Feb', start: '2026-02-01', end: '2026-02-28' },
    { label: 'Mar', start: '2026-03-01', end: '2026-03-31' },
    { label: 'Apr', start: '2026-04-01', end: '2026-04-30' },
    { label: 'May', start: '2026-05-01', end: '2026-05-31' },
    { label: 'Jun', start: '2026-06-01', end: '2026-06-30' },
];

function buildHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevForge-Graph-Stats',
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
}

async function searchCount(query: string): Promise<number> {
    try {
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`;
        const res = await fetch(url, {
            headers: buildHeaders(),
            next: { revalidate: 600 },
        });
        if (!res.ok) return 0;
        const data = await res.json();
        return data.total_count ?? 0;
    } catch {
        return 0;
    }
}

async function fetchAllMergedPRItems(username: string): Promise<Array<{ repository_url: string }>> {
    // Fetch up to 500 merged PRs for org counting (paginated)
    const items: Array<{ repository_url: string }> = [];
    let page = 1;
    while (true) {
        try {
            const url = `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${username} type:pr is:merged`)}&per_page=100&page=${page}`;
            const res = await fetch(url, { headers: buildHeaders(), next: { revalidate: 600 } });
            if (!res.ok) break;
            const data = await res.json();
            if (!data.items?.length) break;
            items.push(...data.items);
            if (data.items.length < 100 || items.length >= 500) break;
            page++;
            await new Promise(r => setTimeout(r, 250));
        } catch { break; }
    }
    return items;
}

async function processMember(username: string) {
    // ── Monthly counts: one accurate search-count call per month ──
    const monthlyPromises = MONTHS.map(m =>
        searchCount(`author:${username} type:pr is:merged merged:${m.start}..${m.end}`)
    );

    // ── Org counts: fetch all PR items and filter by target org slugs ──
    const [monthlyCounts, allPRItems] = await Promise.all([
        Promise.all(monthlyPromises),
        fetchAllMergedPRItems(username),
    ]);

    const orgCounts: Record<string, number> = {};
    for (const item of allPRItems) {
        const repoUrl = item.repository_url || '';
        const match = repoUrl.match(/repos\/([^/]+)\//);
        if (match) {
            const orgSlug = match[1].toLowerCase();
            if (TARGET_ORGS[orgSlug]) {
                orgCounts[orgSlug] = (orgCounts[orgSlug] || 0) + 1;
            }
        }
    }

    // Total all-time merged PRs for this member
    const totalMerged = await searchCount(`author:${username} type:pr is:merged`);

    return { monthlyCounts, orgCounts, totalMerged };
}

export async function GET() {
    try {
        // Run all member fetches concurrently
        const results = await Promise.all(
            GITHUB_HANDLES.map(handle => processMember(handle))
        );

        // Aggregate
        const totalMonthCounts = Array(MONTHS.length).fill(0);
        const totalOrgCounts: Record<string, number> = {};
        let totalMergedPRs = 0;

        for (const { monthlyCounts, orgCounts, totalMerged } of results) {
            monthlyCounts.forEach((c, i) => { totalMonthCounts[i] += c; });
            for (const [org, count] of Object.entries(orgCounts)) {
                totalOrgCounts[org] = (totalOrgCounts[org] || 0) + count;
            }
            totalMergedPRs += totalMerged;
        }

        const monthlyData = MONTHS.map((m, i) => ({
            month: m.label,
            count: totalMonthCounts[i],
        }));

        const orgData = Object.entries(TARGET_ORGS).map(([slug, displayName]) => ({
            org: displayName,
            count: totalOrgCounts[slug] || 0,
        }));

        return NextResponse.json(
            { monthlyData, orgData, totalMergedPRs, fetchedAt: new Date().toISOString() },
            { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1200' } }
        );
    } catch (error) {
        console.error('graph-stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch graph stats' }, { status: 500 });
    }
}
