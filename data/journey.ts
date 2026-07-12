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
        year: "2025",
        status: "documented",
        headline: "Year one — founded with the first batch",
        summary:
            "The college opened its doors in 2025, and DevForge started with it. One batch, a first set of workshops, and the first wins on the board before the year was out.",
        highlights: [
            "DevForge founded at NST x SVYASA alongside the college's first-ever batch",
            "First workshops run by members: Getting Started with Open Source (Sahitya Singh), Web Development Bootcamp (Unnati Jaiswal), AI & Machine Learning 101 (Sujan YD)",
            `${hackathonWinsByYear("2025")} first-place hackathon wins in the first year, including the DevForge Hackathon and Ideathon`,
            "First members start contributing to GSSoC-affiliated open-source organizations",
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
