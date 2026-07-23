import { z } from "zod";

export type ProjectStatus = "draft" | "published";

export interface Project {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    tech: string[];
    repoUrl?: string;
    demoUrl?: string;
    /** USN of the member who created it. Only they (or an admin) may edit. */
    ownerUsn: string;
    ownerName: string;
    /** USNs of members who asked to join and were accepted by the owner. */
    collaborators: string[];
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

/** http(s) only — a javascript: or data: URL here would end up in an href. */
const externalUrl = z
    .string()
    .trim()
    .url("Enter a full URL including https://")
    .refine((v) => /^https?:\/\//i.test(v), "Only http and https links are allowed")
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const projectInputSchema = z.object({
    title: z.string().trim().min(3, "Give it a title").max(80),
    tagline: z.string().trim().min(10, "One line on what it does").max(160),
    description: z.string().trim().max(4000).default(""),
    tech: z
        .array(z.string().trim().min(1).max(30))
        .max(12, "Twelve technologies is plenty")
        .default([]),
    repoUrl: externalUrl,
    demoUrl: externalUrl,
    status: z.enum(["draft", "published"]).default("draft"),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

/**
 * URL-safe slug. Uniqueness is enforced at write time by suffixing, since two
 * members can reasonably name projects the same thing.
 */
export function slugify(title: string): string {
    const base = title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);
    return base || "project";
}

export function canEditProject(
    project: Pick<Project, "ownerUsn">,
    actor: { usn: string; role: string },
): boolean {
    return project.ownerUsn === actor.usn || actor.role === "admin" || actor.role === "mentor";
}
