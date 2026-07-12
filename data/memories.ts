export interface Memory {
    photo: string;
    title: string;
    date: string;
    story: string;
}

/**
 * Seeded only from photos that already have a real, dated event attached
 * to them elsewhere in the repo (cross-referenced against
 * data/hackathons.ts) — not just what happens to sit in /public.
 *
 * /public also has hackathon-1.png, hackathon-2.png, hackathon-3.png,
 * hackathon-4.png, and hackathon-selfie.png — real photos, but with zero
 * attribution anywhere in the codebase (no event name, no date, no
 * caption). Rather than guess what they depict, they're left out until
 * someone who was there captions them.
 */
export const memories: Memory[] = [
    {
        photo: "/hackathon-new.jpg",
        title: "AI for a Drug-Free India — 1st Place",
        date: "2026",
        story:
            "Team Drug Free Nation (Dhiraj Rathod, Shrishti Nagpure) took 1st overall, plus 1st in TalkBot Arena, 1st in Hack4Change, and 2nd in Think Smart Say No — building an AI chat and live-call support system.",
    },
];

export const uncaptionedPhotoCount = 5;
