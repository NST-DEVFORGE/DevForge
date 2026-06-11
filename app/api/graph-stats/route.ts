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

// The 5 target orgs — GitHub org slug → display name
const TARGET_ORGS: Record<string, string> = {
    'openSUSE':         'openSUSE',
    'openfoodfacts':    'OpenFoodFacts',
    'json-schema-org':  'JSONSchema',
    'zulip':            'Zulip',
    'mit-cml':          'MIT App',
};

// Jan 2026 – Jun 2026
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

async function searchMergedPRs(
    username: string,
    extraFilters: string = ''
): Promise<{ total_count: number; items: Array<{ repository_url: string; closed_at: string }> }> {
    try {
        const query = `author:${username} type:pr is:merged ${extraFilters}`.trim();
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;
        const res = await fetch(url, {
            headers: buildHeaders(),
            next: { revalidate: 600 }, // cache 10 min
        });
        if (!res.ok) return { total_count: 0, items: [] };
        return await res.json();
    } catch {
        return { total_count: 0, items: [] };
    }
}

async function fetchMemberMonthlyAndOrgData(username: string) {
    // Fetch all merged PRs from Jan 2026 – Jun 2026 in one query
    const data = await searchMergedPRs(
        username,
        'merged:2026-01-01..2026-06-30'
    );

    const monthCounts: Record<string, number> = {};
    const orgCounts: Record<string, number> = {};

    for (const item of data.items) {
        // Monthly aggregation via closed_at (= merge date for merged PRs)
        const mergedAt = item.closed_at;
        if (mergedAt) {
            const monthKey = mergedAt.substring(0, 7); // e.g. "2026-03"
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        }

        // Org aggregation via repository_url
        // e.g. "https://api.github.com/repos/openSUSE/open-build-service"
        const repoUrl = item.repository_url || '';
        const match = repoUrl.match(/repos\/([^/]+)\//);
        if (match) {
            const orgSlug = match[1];
            const normalizedSlug = Object.keys(TARGET_ORGS).find(
                k => k.toLowerCase() === orgSlug.toLowerCase()
            );
            if (normalizedSlug) {
                orgCounts[normalizedSlug] = (orgCounts[normalizedSlug] || 0) + 1;
            }
        }
    }

    return { monthCounts, orgCounts };
}

export async function GET() {
    try {
        // Fetch all members concurrently (but GitHub search has rate limits — 10 req/s unauthenticated)
        // Stagger slightly to avoid rate limiting
        const results = await Promise.all(
            GITHUB_HANDLES.map(handle => fetchMemberMonthlyAndOrgData(handle))
        );

        // Aggregate monthly counts across all members
        const totalMonthCounts: Record<string, number> = {};
        const totalOrgCounts: Record<string, number> = {};

        for (const { monthCounts, orgCounts } of results) {
            for (const [month, count] of Object.entries(monthCounts)) {
                totalMonthCounts[month] = (totalMonthCounts[month] || 0) + count;
            }
            for (const [org, count] of Object.entries(orgCounts)) {
                totalOrgCounts[org] = (totalOrgCounts[org] || 0) + count;
            }
        }

        // Build ordered monthly data (Jan–Jun 2026)
        const monthlyData = MONTHS.map(m => {
            const key = m.start.substring(0, 7);
            return { month: m.label, count: totalMonthCounts[key] || 0 };
        });

        // Build ordered org data
        const orgData = Object.entries(TARGET_ORGS).map(([slug, displayName]) => ({
            org: displayName,
            count: totalOrgCounts[slug] || 0,
        }));

        return NextResponse.json(
            { monthlyData, orgData, fetchedAt: new Date().toISOString() },
            {
                headers: {
                    'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
                },
            }
        );
    } catch (error) {
        console.error('graph-stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch graph stats' },
            { status: 500 }
        );
    }
}
