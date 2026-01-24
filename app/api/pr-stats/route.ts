import { NextResponse } from 'next/server';

// Team member configuration
const TEAM_MEMBERS = [
    {
        name: 'Geetansh Goyal',
        github: 'geetxnshgoyal',
        role: 'Club President',
        avatar: '/geetansh.jpg'
    },
    {
        name: 'Lay Shah',
        github: 'Layyzyy',
        role: 'Event Coordinator',
        avatar: '/lay.png'
    },
    {
        name: 'Luvya Rana',
        github: 'luvyarana',
        role: 'Tech Lead',
        avatar: '/luvya.jpg'
    },
    {
        name: 'Vikas Sharma',
        github: 'sharmavikas18',
        role: 'Member',
        avatar: '/vikas.png'
    },
    {
        name: 'Aryan Patel',
        github: 'AryanPatel-ui',
        role: 'Member',
        avatar: '/aryan.png'
    },
    {
        name: 'Nithyaraj',
        github: 'nithyarajmudhaliyar',
        role: 'Member',
        avatar: '/nithyaraj.png'
    },
    {
        name: 'Prateek',
        github: 'prateek6789-ai',
        role: 'Member',
        avatar: '/prateek.jpg'
    },
    {
        name: 'Sahitya Singh',
        github: 'Sahitya0805',
        role: 'Designer',
        avatar: '/sahitya.png'
    },
    {
        name: 'Saurabh',
        github: 'saurabhyuvi14-ai',
        role: 'Member',
        avatar: '/saurabh.jpg'
    },
    {
        name: 'Sidharth',
        github: 'SidharthxNST',
        role: 'Member',
        avatar: '/sidharth.png'
    },
    {
        name: 'Bhavesh Sharma',
        github: 'bhavesh-210',
        role: 'Member',
        avatar: '/bhavesh.jpg'
    },
    {
        name: 'Unnati Jaiswal',
        github: 'unnati-jaiswal24',
        role: 'Member',
        avatar: '/unnati.png'
    },
    {
        name: 'Shristi Kumari',
        github: 'Shristibot',
        role: 'Member',
        avatar: 'https://github.com/Shristibot.png'
    },
    {
        name: 'Dhiraj Rathod',
        github: 'dhiraj-143r',
        role: 'Member',
        avatar: 'https://github.com/dhiraj-143r.png'
    }
];

// Milestone definitions
const TEAM_MILESTONES = [
    { name: 'Bronze', count: 50, emoji: '🥉' },
    { name: 'Silver', count: 100, emoji: '🥈' },
    { name: 'Gold', count: 250, emoji: '🥇' },
    { name: 'Platinum', count: 500, emoji: '💎' },
    { name: 'Diamond', count: 1000, emoji: '🏆' }
];

const INDIVIDUAL_MILESTONES = [
    { name: 'Beginner', count: 5, emoji: '🌱' },
    { name: 'Contributor', count: 15, emoji: '🪪' }, // Club ID card with lanyard!
    { name: 'Active', count: 25, emoji: '👕' }, // Club T-shirt reward!
    { name: 'Champion', count: 50, emoji: '🏅' },
    { name: 'Legend', count: 100, emoji: '👑' },
    { name: 'Master', count: 200, emoji: '🚀' }
];

interface PRStats {
    name: string;
    github: string;
    role: string;
    avatar: string;
    prCount: number; // Quality PRs only
    totalPRs: number; // All merged PRs
    milestones: Array<{ name: string; count: number; emoji: string }>;
    nextMilestone: { name: string; count: number; emoji: string; progress: number } | null;
}

interface TeamStats {
    totalPRs: number; // Total quality PRs across team
    totalAllPRs: number; // All merged PRs across team
    members: PRStats[];
    teamMilestones: Array<{ name: string; count: number; emoji: string }>;
    nextTeamMilestone: { name: string; count: number; emoji: string; progress: number } | null;
    lastUpdated: string;
}

async function fetchUserPRs(username: string): Promise<{ total: number; quality: number }> {
    try {
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'DevForge-PR-Stats'
        };

        // Add GitHub token if available (for higher rate limits)
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        // Fetch all merged PRs (up to 100 per page, can be paginated if needed)
        const query = `author:${username} is:pr is:merged`;
        const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

        const searchResponse = await fetch(searchUrl, {
            headers,
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!searchResponse.ok) {
            if (searchResponse.status === 403) {
                console.error(`GitHub API rate limit exceeded for ${username}`);
                return { total: 0, quality: 0 };
            }
            console.error(`Failed to fetch PRs for ${username}: ${searchResponse.status}`);
            return { total: 0, quality: 0 };
        }

        const searchData = await searchResponse.json();
        const prs = searchData.items || [];
        const totalPRs = prs.length;

        // Quality filter: Only count PRs to repos with ≥100 stars OR ≥150 forks
        let qualityPRCount = 0;
        const repoCache = new Map<string, boolean>(); // Cache repo quality checks

        for (const pr of prs) {
            // Extract repo URL from PR
            const repoUrl = pr.repository_url;

            // Check cache first
            if (repoCache.has(repoUrl)) {
                if (repoCache.get(repoUrl)) {
                    qualityPRCount++;
                }
                continue;
            }

            // Fetch repository details
            try {
                const repoResponse = await fetch(repoUrl, {
                    headers,
                    next: { revalidate: 3600 } // Cache repo data for 1 hour
                });

                if (repoResponse.ok) {
                    const repoData = await repoResponse.json();
                    const stars = repoData.stargazers_count || 0;
                    const forks = repoData.forks_count || 0;

                    // Quality criteria: ≥100 stars AND ≥100 forks
                    const isQualityRepo = stars >= 100 && forks >= 100;
                    repoCache.set(repoUrl, isQualityRepo);

                    if (isQualityRepo) {
                        qualityPRCount++;
                    }
                }
            } catch (error) {
                console.error(`Error fetching repo data for ${repoUrl}:`, error);
                // Skip this PR if we can't verify repo quality
            }
        }

        console.log(`${username}: ${qualityPRCount} quality PRs out of ${totalPRs} total merged PRs`);
        return { total: totalPRs, quality: qualityPRCount };
    } catch (error) {
        console.error(`Error fetching PRs for ${username}:`, error);
        return { total: 0, quality: 0 };
    }
}

function calculateMilestones(count: number, milestones: typeof INDIVIDUAL_MILESTONES) {
    const achieved = milestones.filter(m => count >= m.count);
    const next = milestones.find(m => count < m.count);

    let nextMilestone = null;
    if (next) {
        const previous = achieved[achieved.length - 1];
        const previousCount = previous ? previous.count : 0;
        const progress = ((count - previousCount) / (next.count - previousCount)) * 100;
        nextMilestone = { ...next, progress };
    }

    return { achieved, nextMilestone };
}

export async function GET() {
    try {
        // Fetch PR counts for all team members
        const memberStats = await Promise.all(
            TEAM_MEMBERS.map(async (member) => {
                const { total, quality } = await fetchUserPRs(member.github);
                const { achieved, nextMilestone } = calculateMilestones(quality, INDIVIDUAL_MILESTONES);

                return {
                    name: member.name,
                    github: member.github,
                    role: member.role,
                    avatar: member.avatar,
                    prCount: quality, // Quality PRs for milestones
                    totalPRs: total,  // All merged PRs
                    milestones: achieved,
                    nextMilestone
                };
            })
        );

        // Calculate totals
        const totalQualityPRs = memberStats.reduce((sum, member) => sum + member.prCount, 0);
        const totalAllPRs = memberStats.reduce((sum, member) => sum + member.totalPRs, 0);

        // Calculate team milestones based on quality PRs
        const { achieved: teamMilestonesAchieved, nextMilestone: nextTeamMilestone } =
            calculateMilestones(totalQualityPRs, TEAM_MILESTONES);

        const stats: TeamStats = {
            totalPRs: totalQualityPRs,
            totalAllPRs,
            members: memberStats,
            teamMilestones: teamMilestonesAchieved,
            nextTeamMilestone,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching PR stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch PR statistics' },
            { status: 500 }
        );
    }
}
