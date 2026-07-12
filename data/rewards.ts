export interface RewardTier {
    achievement: string;
    threshold: string;
    reward: string;
    /** The "leeway" — a privilege or flexibility earned, not just a prize. */
    privilege?: string;
}

export interface RewardLadder {
    title: string;
    emoji: string;
    description: string;
    tiers: RewardTier[];
}

/**
 * The club's recognition structure. The principle: a student who is
 * visibly achieving and learning earns not just prizes but *leeway* —
 * flexibility, priority, and trust. Contribution milestones mirror the
 * ones already live on /pr-stats; learning and community ladders are new.
 */
export const rewardLadders: RewardLadder[] = [
    {
        title: "Open Source",
        emoji: "🔀",
        description: "Based on quality PRs (merged into repos with ≥100 stars and forks), same counts as the live leaderboard.",
        tiers: [
            { achievement: "🌱 Beginner", threshold: "5 quality PRs", reward: "Shout-out in the weekly session" },
            { achievement: "🪪 Contributor", threshold: "15 quality PRs", reward: "Official club ID card", privilege: "One free skip of a weekly session, no questions asked" },
            { achievement: "👕 Active", threshold: "25 quality PRs", reward: "Club T-shirt", privilege: "Priority pick of session topics and POC slots" },
            { achievement: "🏅 Champion", threshold: "50 quality PRs", reward: "Full swag kit", privilege: "Flexible deadlines on club assignments — you've earned the trust" },
            { achievement: "👑 Legend", threshold: "100 quality PRs", reward: "Mystery prize", privilege: "Standing invite to represent the club at external events" },
            { achievement: "🚀 Master", threshold: "200 quality PRs", reward: "Premium prize", privilege: "Attendance fully flexible — output speaks for itself" },
        ],
    },
    {
        title: "Learning",
        emoji: "📚",
        description: "Based on the Learning Tracks — verified by a short teach-back, not just checked boxes.",
        tiers: [
            { achievement: "First track completed", threshold: "1 track + teach-back", reward: "Learner badge on the members page" },
            { achievement: "Cross-trained", threshold: "3 tracks + teach-backs", reward: "Featured in a Student Spotlight", privilege: "First pick of masterclass seats when capacity is limited" },
            { achievement: "Track author", threshold: "Design a new track or module the club adopts", reward: "Named credit on /learn", privilege: "Skip-pass for weekly sessions during the weeks you're authoring" },
        ],
    },
    {
        title: "Teaching & Mentoring",
        emoji: "🎓",
        description: "The fastest way to earn leeway: multiply your learning through others.",
        tiers: [
            { achievement: "Session lead", threshold: "Run 1 workshop or masterclass", reward: "Mentor badge + your session linked from the Learning Tracks", privilege: "One session skip-pass per workshop taught" },
            { achievement: "Regular mentor", threshold: "3+ sessions or ongoing mentoring", reward: "Mentor listing on the club page", privilege: "Exempt from routine attendance requirements — mentoring counts as attendance" },
        ],
    },
    {
        title: "Competition & Programs",
        emoji: "🏆",
        description: "Hackathons, GSSoC ranks, GSoC selections — the record the whole site is built on.",
        tiers: [
            { achievement: "Hackathon podium", threshold: "Top-3 at any hackathon", reward: "Featured on Memory Lane with your team's story", privilege: "Priority for club-sponsored travel to the next external hackathon" },
            { achievement: "GSSoC top rank", threshold: "Leaderboard rank under 500", reward: "Hall of Fame placement on the homepage" },
            { achievement: "GSoC / major program selection", threshold: "Selected", reward: "Dedicated Student Spotlight + conference talk support", privilege: "Full flexibility during the program's coding period — the program is the club work" },
        ],
    },
];

export const rewardPrinciples = [
    "Leeway is earned, visible, and revocable — it comes from the public record (PRs, sessions taught, tracks finished), not from asking.",
    "Recognition is always public (shout-outs, badges, spotlights); accountability conversations are always private.",
    "Prizes are one-time; privileges persist while the activity that earned them continues.",
    "Anyone can see exactly what earns what — no discretionary favorites.",
];
