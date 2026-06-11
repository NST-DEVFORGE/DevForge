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
        name: 'Ravi Sharma',
        github: 'ravisharma-09',
        role: 'Member',
        avatar: '/ravi.jpg'
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

const MEMBER_DATA = [
    { name: 'Geetansh Goyal', github: 'geetxnshgoyal', role: 'Club President', avatar: '/geetansh.jpg', merged: 40, quality: 7 },
    { name: 'Ravi Sharma', github: 'ravisharma-09', role: 'Member', avatar: '/ravi.jpg', merged: 8, quality: 3 },
    { name: 'Lay Shah', github: 'Layyzyy', role: 'Event Coordinator', avatar: '/lay.png', merged: 8, quality: 1 },
    { name: 'Luvya Rana', github: 'luvyarana', role: 'Tech Lead', avatar: '/luvya.jpg', merged: 10, quality: 5 },
    { name: 'Vikas Sharma', github: 'sharmavikas18', role: 'Member', avatar: '/vikas.png', merged: 5, quality: 0 },
    { name: 'Aryan Patel', github: 'AryanPatel-ui', role: 'Member', avatar: '/aryan.png', merged: 8, quality: 1 },
    { name: 'Nithyaraj', github: 'nithyarajmudhaliyar', role: 'Member', avatar: '/nithyaraj.png', merged: 10, quality: 8 },
    { name: 'Prateek', github: 'prateek6789-ai', role: 'Member', avatar: '/prateek.jpg', merged: 5, quality: 0 },
    { name: 'Sahitya Singh', github: 'Sahitya0805', role: 'Designer', avatar: '/sahitya.png', merged: 27, quality: 8 },
    { name: 'Saurabh', github: 'saurabhyuvi14-ai', role: 'Member', avatar: '/saurabh.jpg', merged: 6, quality: 1 },
    { name: 'Sidharth', github: 'SidharthxNST', role: 'Member', avatar: '/sidharth.png', merged: 4, quality: 2 },
    { name: 'Bhavesh Sharma', github: 'bhavesh-210', role: 'Member', avatar: '/bhavesh.jpg', merged: 13, quality: 0 },
    { name: 'Unnati Jaiswal', github: 'unnati-jaiswal24', role: 'Member', avatar: '/unnati.png', merged: 8, quality: 3 },
    { name: 'Shristi Kumari', github: 'Shristibot', role: 'Member', avatar: 'https://github.com/Shristibot.png', merged: 8, quality: 3 },
    { name: 'Dhiraj Rathod', github: 'dhiraj-143r', role: 'Member', avatar: 'https://github.com/dhiraj-143r.png', merged: 28, quality: 18 }
];

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
        const memberStats = MEMBER_DATA.map((member) => {
            const { achieved, nextMilestone } = calculateMilestones(member.quality, INDIVIDUAL_MILESTONES);

            return {
                name: member.name,
                github: member.github,
                role: member.role,
                avatar: member.avatar,
                prCount: member.quality, // Quality PRs for milestones
                totalPRs: member.merged,  // All merged PRs
                milestones: achieved,
                nextMilestone
            };
        });

        // Use the exact hardcoded totals requested by the user
        const totalQualityPRs = 60;
        const totalAllPRs = 188;

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
