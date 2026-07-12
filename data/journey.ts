import { TOTAL_MERGED_PRS, TOTAL_CONTRIBUTORS } from "@/lib/site-stats";
import { hackathonWinners } from "@/data/hackathons";

export interface JourneyChapter {
    year: string;
    status: "documented" | "tbd";
    headline: string;
    summary: string;
    highlights: string[];
    stats?: { label: string; value: string }[];
}

const hackathonWinsByYear = (year: string) =>
    hackathonWinners.filter((h) => h.year === year && h.position === "1st Place").length;

export const journeyChapters: JourneyChapter[] = [
    {
        year: "2023",
        status: "tbd",
        headline: "Where it started",
        summary:
            "The founding story — date, founders, first workshop — hasn't been recorded here yet. This chapter ships once the team confirms it, rather than guessing.",
        highlights: [],
    },
    {
        year: "2024",
        status: "documented",
        headline: "First open-source seat",
        summary: "The club's first documented open-source milestone: a member selected into Google Summer of Code.",
        highlights: [
            "Sahitya Singh selected for Google Summer of Code (GSoC) 2024, working with GirlScript Foundation",
        ],
    },
    {
        year: "2025",
        status: "documented",
        headline: "First wins",
        summary: "Hackathon results start showing up as a record, not a claim.",
        highlights: [
            `${hackathonWinsByYear("2025")} first-place hackathon wins, including the DevForge Hackathon and Ideathon`,
            "First cohort of members contributing to GSSoC-affiliated open-source organizations",
        ],
    },
    {
        year: "2026",
        status: "documented",
        headline: "Scale",
        summary: "The year the numbers became the story — a live, verifiable record instead of a highlight reel.",
        highlights: [
            `${hackathonWinsByYear("2026")} first-place hackathon wins across CodeDay, Campfire Bengaluru, and AI for a Drug-Free India`,
            "GSoC 2026 selection",
            "A GSSoC leaderboard with members ranked in the low hundreds",
            "A weekly session calendar running through masterclasses, monthly hackathons, and big events",
        ],
        stats: [
            { label: "Merged PRs", value: TOTAL_MERGED_PRS.toLocaleString() },
            { label: "Contributors", value: String(TOTAL_CONTRIBUTORS) },
        ],
    },
];
