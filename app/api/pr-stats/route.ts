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
    prCount: number;
    milestones: Array<{ name: string; count: number; emoji: string }>;
    nextMilestone: { name: string; count: number; emoji: string; progress: number } | null;
}

interface TeamStats {
    totalPRs: number;
    members: PRStats[];
    teamMilestones: Array<{ name: string; count: number; emoji: string }>;
    nextTeamMilestone: { name: string; count: number; emoji: string; progress: number } | null;
    lastUpdated: string;
}

async function fetchUserPRs(username: string): Promise<number> {
    try {
        // GitHub API endpoint for searching PRs
        const query = `author:${username} is:pr is:merged`;
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`;

        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'DevForge-PR-Stats'
        };

        // Add GitHub token if available (for higher rate limits)
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(url, {
            headers,
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            if (response.status === 403) {
                console.error(`GitHub API rate limit exceeded for ${username}`);
                // Return 0 instead of throwing to prevent complete failure
                return 0;
            }
            console.error(`Failed to fetch PRs for ${username}: ${response.status}`);
            return 0;
        }

        const data = await response.json();
        return data.total_count || 0;
    } catch (error) {
        console.error(`Error fetching PRs for ${username}:`, error);
        return 0;
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
                const prCount = await fetchUserPRs(member.github);
                const { achieved, nextMilestone } = calculateMilestones(prCount, INDIVIDUAL_MILESTONES);

                return {
                    name: member.name,
                    github: member.github,
                    role: member.role,
                    avatar: member.avatar,
                    prCount,
                    milestones: achieved,
                    nextMilestone
                };
            })
        );

        // Calculate total PRs
        const totalPRs = memberStats.reduce((sum, member) => sum + member.prCount, 0);

        // Calculate team milestones
        const { achieved: teamMilestonesAchieved, nextMilestone: nextTeamMilestone } =
            calculateMilestones(totalPRs, TEAM_MILESTONES);

        const stats: TeamStats = {
            totalPRs,
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
