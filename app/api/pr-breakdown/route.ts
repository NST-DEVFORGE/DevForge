import { NextResponse } from 'next/server';

const TEAM_MEMBERS = [
    { name: 'Geetansh Goyal', github: 'geetxnshgoyal' },
    { name: 'Lay Shah', github: 'Layyzyy' },
    { name: 'Luvya Rana', github: 'luvyarana' },
    { name: 'Vikas Sharma', github: 'sharmavikas18' },
    { name: 'Aryan Patel', github: 'AryanPatel-ui' },
    { name: 'Nithyaraj', github: 'nithyarajmudhaliyar' },
    { name: 'Prateek', github: 'prateek6789-ai' },
    { name: 'Sahitya Singh', github: 'Sahitya0805' },
    { name: 'Saurabh', github: 'saurabhyuvi14-ai' },
    { name: 'Sidharth', github: 'SidharthxNST' },
    { name: 'Bhavesh Sharma', github: 'bhavesh-210' },
    { name: 'Unnati Jaiswal', github: 'unnati-jaiswal24' },
    { name: 'Shristi Kumari', github: 'Shristibot' },
    { name: 'Dhiraj Rathod', github: 'dhiraj-143r' }
];

const GSOC_ORGS = [
    'opensuse', 'mozilla', 'kubernetes', 'apache', 'google', 'tensorflow',
    'gnome', 'kde', 'fedora', 'python', 'numpy', 'django', 'zulip',
    'cncf', 'hashicorp', 'grafana', 'prometheus', 'jenkins', 'gitlab'
];

interface PR {
    title: string;
    url: string;
    repo: string;
    number: number;
    date: string;
    state: 'merged' | 'open' | 'closed';
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

async function fetchPRsForUser(member: { name: string; github: string }): Promise<MemberData> {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevForge-PR-Stats'
    };

    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const result: MemberData = {
        name: member.name,
        github: member.github,
        merged: [],
        open: [],
        closed: [],
        gsocPRs: []
    };

    const states = [
        { key: 'merged' as const, query: `author:${member.github} is:pr is:merged` },
        { key: 'open' as const, query: `author:${member.github} is:pr is:open` },
        { key: 'closed' as const, query: `author:${member.github} is:pr is:closed is:unmerged` }
    ];

    for (const { key, query } of states) {
        try {
            const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;
            const response = await fetch(searchUrl, { headers, next: { revalidate: 300 } });

            if (!response.ok) continue;

            const data = await response.json();
            const prs = data.items || [];

            for (const pr of prs) {
                const repoUrl = pr.repository_url;
                const repoName = repoUrl.split('/').slice(-2).join('/');
                const org = repoName.split('/')[0].toLowerCase();
                const isGsoc = GSOC_ORGS.some(g => org.includes(g));

                const prData: PR = {
                    title: pr.title,
                    url: pr.html_url,
                    repo: repoName,
                    number: pr.number,
                    date: pr.closed_at || pr.created_at,
                    state: key,
                    isGsoc
                };

                result[key].push(prData);
                if (isGsoc) result.gsocPRs.push(prData);
            }
        } catch (error) {
            console.error(`Error fetching ${key} PRs for ${member.github}:`, error);
        }
    }

    return result;
}

export async function GET() {
    try {
        const membersData = await Promise.all(TEAM_MEMBERS.map(fetchPRsForUser));

        const summary = {
            merged: 0, open: 0, closed: 0, total: 0,
            gsocMerged: 0, gsocOpen: 0, gsocClosed: 0, gsocTotal: 0
        };

        for (const m of membersData) {
            summary.merged += m.merged.length;
            summary.open += m.open.length;
            summary.closed += m.closed.length;
            summary.gsocMerged += m.gsocPRs.filter(p => p.state === 'merged').length;
            summary.gsocOpen += m.gsocPRs.filter(p => p.state === 'open').length;
            summary.gsocClosed += m.gsocPRs.filter(p => p.state === 'closed').length;
        }
        summary.total = summary.merged + summary.open + summary.closed;
        summary.gsocTotal = summary.gsocMerged + summary.gsocOpen + summary.gsocClosed;

        return NextResponse.json({
            summary,
            members: membersData.map(m => ({
                name: m.name,
                github: m.github,
                merged: m.merged.length,
                open: m.open.length,
                closed: m.closed.length,
                gsocMerged: m.gsocPRs.filter(p => p.state === 'merged').length,
                gsocOpen: m.gsocPRs.filter(p => p.state === 'open').length,
                gsocClosed: m.gsocPRs.filter(p => p.state === 'closed').length,
                gsocPRs: m.gsocPRs
            })),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
