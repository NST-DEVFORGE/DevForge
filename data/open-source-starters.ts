export interface StarterRepo {
    name: string;
    url: string;
    kind: "practice" | "repo" | "guide" | "discovery";
    why: string;
}

/**
 * Real, active repositories and guides for first-time contributors —
 * curated from the club's own onboarding doc. The goal: a beginner should
 * be able to set one of these up locally within ~4 days and learn Git
 * (fork, PR), environment setup, and project structure by struggling
 * productively through it.
 */
export const starterRepos: StarterRepo[] = [
    {
        name: "First Contributions",
        url: "https://firstcontributions.github.io/",
        kind: "practice",
        why: "Make your literal first PR here — a repo that exists solely to walk you through fork → branch → PR → merge, with maintainers who merge fast.",
    },
    {
        name: "24 Pull Requests",
        url: "https://24pullrequests.com/",
        kind: "practice",
        why: "Suggests small open-source contributions and tracks your streak — good for building the habit after your first PR.",
    },
    {
        name: "ant-design/ant-design",
        url: "https://github.com/ant-design/ant-design",
        kind: "repo",
        why: "One of the most-used React UI libraries in the world. Huge, active, well-documented — a real production codebase with labeled beginner issues.",
    },
    {
        name: "ether/etherpad-lite",
        url: "https://github.com/ether/etherpad-lite/issues",
        kind: "repo",
        why: "The classic collaborative editor. Long-running project with an approachable issue tracker.",
    },
    {
        name: "mastra-ai/mastra",
        url: "https://github.com/mastra-ai/mastra/issues",
        kind: "repo",
        why: "Fast-moving TypeScript AI-agent framework — very active, so issues and reviews turn around quickly.",
    },
    {
        name: "tinyplex/tinybase",
        url: "https://github.com/tinyplex/tinybase",
        kind: "repo",
        why: "A local-first TypeScript database with famously tidy code and docs — great for learning what a well-kept repo looks like.",
    },
    {
        name: "json-schema-org/website",
        url: "https://github.com/json-schema-org/website/issues",
        kind: "repo",
        why: "The JSON Schema org's site — docs-heavy, beginner-friendly issues, and an org DevForge members have already merged PRs into.",
    },
    {
        name: "localfirstfm/local-first-landscape",
        url: "https://github.com/localfirstfm/local-first-landscape",
        kind: "repo",
        why: "A community-maintained landscape of local-first tools — contributions are mostly research and writing, a gentle on-ramp.",
    },
    {
        name: "GitHub Trending (JavaScript)",
        url: "https://github.com/trending/javascript",
        kind: "discovery",
        why: "Check weekly. Trending repos are active by definition — pick one you actually use and read its open issues.",
    },
    {
        name: "freeCodeCamp: How to Contribute to Open Source",
        url: "https://www.freecodecamp.org/news/how-to-contribute-to-open-source-handbook/",
        kind: "guide",
        why: "The full handbook — read it alongside your first contribution, not instead of it.",
    },
    {
        name: "Microsoft Learn: Contribute to an open-source project",
        url: "https://learn.microsoft.com/en-us/training/modules/contribute-open-source/3-contribute",
        kind: "guide",
        why: "A short structured module if you prefer guided lessons over handbooks.",
    },
];
