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
    { label: 'Jan', key: '2026-01' },
    { label: 'Feb', key: '2026-02' },
    { label: 'Mar', key: '2026-03' },
    { label: 'Apr', key: '2026-04' },
    { label: 'May', key: '2026-05' },
    { label: 'Jun', key: '2026-06' },
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

interface PRItem {
    repository_url: string;
    closed_at: string;
    pull_request?: { merged_at?: string };
}

async function fetchAllMergedPRs(username: string): Promise<PRItem[]> {
    const items: PRItem[] = [];
    let page = 1;

    while (true) {
        try {
            const query = `author:${username} type:pr is:merged`;
            const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&page=${page}`;
            const res = await fetch(url, {
                headers: buildHeaders(),
                next: { revalidate: 600 },
            });

            if (!res.ok) break;

            const data = await res.json();
            if (!data.items || data.items.length === 0) break;

            items.push(...data.items);

            // Stop if we got fewer than 100 items (last page) or exceed 500 total
            if (data.items.length < 100 || items.length >= 500) break;
            page++;

            // Small delay between pages to respect rate limits
            await new Promise(r => setTimeout(r, 200));
        } catch {
            break;
        }
    }

    return items;
}

function extractOrgSlug(repositoryUrl: string): string {
    // "https://api.github.com/repos/openSUSE/open-build-service" → "opensuse"
    const match = repositoryUrl.match(/repos\/([^/]+)\//);
    return match ? match[1].toLowerCase() : '';
}

async function processMember(username: string) {
    const prs = await fetchAllMergedPRs(username);

    const monthCounts: Record<string, number> = {};
    const orgCounts: Record<string, number> = {};

    for (const pr of prs) {
        // Use closed_at as merge date (for merged PRs, closed_at === merged date)
        const mergedAt = pr.closed_at || '';

        // Monthly count — only for Jan–Jun 2026
        if (mergedAt) {
            const monthKey = mergedAt.substring(0, 7); // "2026-01"
            if (monthKey >= '2026-01' && monthKey <= '2026-06') {
                monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
            }
        }

        // Org count — ALL TIME, for the 5 target orgs
        const orgSlug = extractOrgSlug(pr.repository_url || '');
        if (orgSlug && TARGET_ORGS[orgSlug]) {
            orgCounts[orgSlug] = (orgCounts[orgSlug] || 0) + 1;
        }
    }

    return { username, prCount: prs.length, monthCounts, orgCounts };
}

export async function GET() {
    try {
        // Fetch all members in parallel (16 members × ~1 API call each)
        const results = await Promise.all(
            GITHUB_HANDLES.map(handle => processMember(handle))
        );

        // Aggregate across all members
        const totalMonthCounts: Record<string, number> = {};
        const totalOrgCounts: Record<string, number> = {};
        let totalMergedPRs = 0;

        for (const { prCount, monthCounts, orgCounts } of results) {
            totalMergedPRs += prCount;

            for (const [month, count] of Object.entries(monthCounts)) {
                totalMonthCounts[month] = (totalMonthCounts[month] || 0) + count;
            }
            for (const [org, count] of Object.entries(orgCounts)) {
                totalOrgCounts[org] = (totalOrgCounts[org] || 0) + count;
            }
        }

        // Build ordered monthly data (Jan–Jun 2026)
        const monthlyData = MONTHS.map(m => ({
            month: m.label,
            count: totalMonthCounts[m.key] || 0,
        }));

        // Build ordered org data (all-time merged PRs per org)
        const orgData = Object.entries(TARGET_ORGS).map(([slug, displayName]) => ({
            org: displayName,
            count: totalOrgCounts[slug] || 0,
        }));

        return NextResponse.json(
            {
                monthlyData,
                orgData,
                totalMergedPRs,
                fetchedAt: new Date().toISOString(),
            },
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
