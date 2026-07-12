export interface BlogAuthor {
    slug: string;
    name: string;
    bio: string;
    avatar: string;
}

/**
 * Seed posts are published under the club account, not a specific member's
 * name, since we don't have consent to attribute personal voice to an
 * individual for AI-drafted content. A member who wants to publish under
 * their own name can be added here later, keyed by their github handle so
 * it can cross-reference data/club-info.ts / data/students.ts.
 */
export const blogAuthors: BlogAuthor[] = [
    {
        slug: "devforge-team",
        name: "DevForge Team",
        bio: "Posted from the club account — not attributed to a single member.",
        avatar: "/logo.png",
    },
];

export function getAuthor(slug: string): BlogAuthor {
    return blogAuthors.find((a) => a.slug === slug) ?? blogAuthors[0];
}
