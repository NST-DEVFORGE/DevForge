export interface Project {
    slug: string;
    title: string;
    tagline: string;
    tech: string[];
    tags: string[];
    demoUrl?: string;
    githubUrl?: string;
}

export const projects: Project[] = [
    {
        slug: "devforge-hackathon",
        title: "DevForge Hackathon",
        tagline: "Our flagship 12-hour hackathon platform with live judging and real-time updates",
        tech: ["Next.js", "Firebase", "TailwindCSS"],
        tags: ["hackathon-platform", "club-tool"],
        demoUrl: "https://hackathon.code4o4.xyz",
    },
    {
        slug: "club-dashboard",
        title: "Club Dashboard",
        tagline: "Member management and event tracking system for the dev club",
        tech: ["React", "Node.js", "MongoDB"],
        tags: ["club-tool"],
        demoUrl: "https://code4o4.xyz",
    },
];

export const allTechTags = Array.from(new Set(projects.flatMap((p) => p.tech))).sort();
