import { NextResponse } from "next/server";
import { external } from "@/lib/firebase/collections";
import { normalizeGithub } from "@/lib/members";
import { authErrorResponse, requireUser } from "@/lib/session";

export const runtime = "nodejs";

export interface GithubRepo {
    name: string;
    fullName: string;
    description: string | null;
    url: string;
    homepage: string | null;
    language: string | null;
    stars: number;
    updatedAt: string;
    fork: boolean;
}

interface GithubApiRepo {
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
    fork: boolean;
    private: boolean;
}

/**
 * The signed-in member's own public repositories, for the picker on the
 * project form.
 *
 * The username is resolved from their student record rather than taken as a
 * parameter. Accepting one would turn this into an open GitHub proxy backed by
 * our token — anyone with an account could enumerate arbitrary users through
 * it, and the rate limit would be ours to lose.
 */
export async function GET() {
    try {
        const session = await requireUser();

        const student = await external("students").doc(session.usn).get();
        const username = normalizeGithub(
            student.exists ? (student.data() as { github?: string }).github : undefined,
        );

        if (!username) {
            return NextResponse.json(
                { ok: false, reason: "no-github", message: "No GitHub username on your student record." },
                { status: 404 },
            );
        }

        const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                    // Raises the rate limit from 60/hr to 5000/hr. Optional so
                    // local development works without a token configured.
                    ...(process.env.GITHUB_TOKEN
                        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                        : {}),
                },
                // Repos change rarely; this keeps the picker snappy on reopen.
                next: { revalidate: 300 },
            },
        );

        if (response.status === 404) {
            return NextResponse.json(
                { ok: false, reason: "not-found", message: `GitHub has no user "${username}".` },
                { status: 404 },
            );
        }
        if (!response.ok) {
            return NextResponse.json(
                { ok: false, reason: "upstream", message: "GitHub is not responding right now." },
                { status: 502 },
            );
        }

        const repos = (await response.json()) as GithubApiRepo[];
        const mapped: GithubRepo[] = repos
            .filter((r) => !r.private)
            .map((r) => ({
                name: r.name,
                fullName: r.full_name,
                description: r.description,
                url: r.html_url,
                homepage: r.homepage,
                language: r.language,
                stars: r.stargazers_count,
                updatedAt: r.updated_at,
                fork: r.fork,
            }));

        // Sources before forks, then most recently pushed.
        mapped.sort(
            (a, b) =>
                Number(a.fork) - Number(b.fork) || b.updatedAt.localeCompare(a.updatedAt),
        );

        return NextResponse.json({ ok: true, username, repos: mapped });
    } catch (error) {
        return authErrorResponse(error);
    }
}
