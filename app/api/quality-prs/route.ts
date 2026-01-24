import { NextResponse } from 'next/server';

// Team member configuration
const TEAM_MEMBERS = [
    { name: 'Geetansh Goyal', github: 'geetxnshgoyal', role: 'Club President', avatar: '/geetansh.jpg' },
    { name: 'Lay Shah', github: 'Layyzyy', role: 'Event Coordinator', avatar: '/lay.png' },
    { name: 'Luvya Rana', github: 'luvyarana', role: 'Tech Lead', avatar: '/luvya.jpg' },
    { name: 'Vikas Sharma', github: 'sharmavikas18', role: 'Member', avatar: '/vikas.png' },
    { name: 'Aryan Patel', github: 'AryanPatel-ui', role: 'Member', avatar: '/aryan.png' },
    { name: 'Nithyaraj', github: 'nithyarajmudhaliyar', role: 'Member', avatar: '/nithyaraj.png' },
    { name: 'Prateek', github: 'prateek6789-ai', role: 'Member', avatar: '/prateek.jpg' },
    { name: 'Sahitya Singh', github: 'Sahitya0805', role: 'Designer', avatar: '/sahitya.png' },
    { name: 'Saurabh', github: 'saurabhyuvi14-ai', role: 'Member', avatar: '/saurabh.jpg' },
    { name: 'Sidharth', github: 'SidharthxNST', role: 'Member', avatar: '/sidharth.png' },
    { name: 'Bhavesh Sharma', github: 'bhavesh-210', role: 'Member', avatar: '/bhavesh.jpg' },
    { name: 'Unnati Jaiswal', github: 'unnati-jaiswal24', role: 'Member', avatar: '/unnati.png' },
    { name: 'Shristi Kumari', github: 'Shristibot', role: 'Member', avatar: 'https://github.com/Shristibot.png' },
    { name: 'Dhiraj Rathod', github: 'dhiraj-143r', role: 'Member', avatar: 'https://github.com/dhiraj-143r.png' }
];

interface QualityPR {
    title: string;
    url: string;
    number: number;
    mergedAt: string;
    repoName: string;
    repoUrl: string;
    repoStars: number;
    repoForks: number;
    author: {
        name: string;
        github: string;
        avatar: string;
    };
}

interface QualityPRsResponse {
    prs: QualityPR[];
    totalCount: number;
    lastUpdated: string;
}

async function fetchQualityPRsForUser(member: typeof TEAM_MEMBERS[0]): Promise<QualityPR[]> {
    try {
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'DevForge-PR-Stats'
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        // Fetch all merged PRs
        const query = `author:${member.github} is:pr is:merged`;
        const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

        const searchResponse = await fetch(searchUrl, {
            headers,
            next: { revalidate: 300 }
        });

        if (!searchResponse.ok) {
            console.error(`Failed to fetch PRs for ${member.github}: ${searchResponse.status}`);
            return [];
        }

        const searchData = await searchResponse.json();
        const prs = searchData.items || [];
        const qualityPRs: QualityPR[] = [];
        const repoCache = new Map<string, { stars: number; forks: number; name: string } | null>();

        for (const pr of prs) {
            const repoUrl = pr.repository_url;

            // Check cache
            if (repoCache.has(repoUrl)) {
                const cachedRepo = repoCache.get(repoUrl);
                if (cachedRepo && (cachedRepo.stars >= 100 && cachedRepo.forks >= 100)) {
                    qualityPRs.push({
                        title: pr.title,
                        url: pr.html_url,
                        number: pr.number,
                        mergedAt: pr.closed_at,
                        repoName: cachedRepo.name,
                        repoUrl: `https://github.com/${cachedRepo.name}`,
                        repoStars: cachedRepo.stars,
                        repoForks: cachedRepo.forks,
                        author: {
                            name: member.name,
                            github: member.github,
                            avatar: member.avatar
                        }
                    });
                }
                continue;
            }

            // Fetch repo details
            try {
                const repoResponse = await fetch(repoUrl, {
                    headers,
                    next: { revalidate: 3600 }
                });

                if (repoResponse.ok) {
                    const repoData = await repoResponse.json();
                    const stars = repoData.stargazers_count || 0;
                    const forks = repoData.forks_count || 0;
                    const fullName = repoData.full_name;

                    repoCache.set(repoUrl, { stars, forks, name: fullName });

                    if (stars >= 100 && forks >= 100) {
                        qualityPRs.push({
                            title: pr.title,
                            url: pr.html_url,
                            number: pr.number,
                            mergedAt: pr.closed_at,
                            repoName: fullName,
                            repoUrl: `https://github.com/${fullName}`,
                            repoStars: stars,
                            repoForks: forks,
                            author: {
                                name: member.name,
                                github: member.github,
                                avatar: member.avatar
                            }
                        });
                    }
                } else {
                    repoCache.set(repoUrl, null);
                }
            } catch {
                repoCache.set(repoUrl, null);
            }
        }

        return qualityPRs;
    } catch (error) {
        console.error(`Error fetching quality PRs for ${member.github}:`, error);
        return [];
    }
}

export async function GET() {
    try {
        // Fetch quality PRs for all team members in parallel
        const allPRsArrays = await Promise.all(
            TEAM_MEMBERS.map(member => fetchQualityPRsForUser(member))
        );

        // Flatten and sort by merge date (newest first)
        const allPRs = allPRsArrays.flat().sort((a, b) =>
            new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
        );

        const response: QualityPRsResponse = {
            prs: allPRs,
            totalCount: allPRs.length,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching quality PRs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quality PRs' },
            { status: 500 }
        );
    }
}
