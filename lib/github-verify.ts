import { EvidenceError, parseGithubRef, type Evidence, type PRState } from "./pr-journey";

const API = "https://api.github.com";

function headers(): Record<string, string> {
    const h: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "DevForge-PR-Journey",
    };
    if (process.env.GITHUB_TOKEN) h.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    return h;
}

interface GithubPR {
    html_url: string;
    number: number;
    title: string;
    state: string;
    merged_at: string | null;
    created_at: string;
    user: { login: string } | null;
}

/**
 * Reads the PR or issue behind a submitted link.
 *
 * Unauthenticated GitHub allows 60 requests an hour per IP, which a cohort of
 * students submitting on the same evening will exhaust immediately — set
 * GITHUB_TOKEN (the same one the PR-stats routes already use) and the ceiling
 * becomes 5000. The failure is reported honestly rather than silently accepting
 * unverified evidence, because unverified evidence is the whole thing this
 * feature exists to prevent.
 */
export async function verifyEvidence(url: string): Promise<Evidence> {
    const ref = parseGithubRef(url);
    if (!ref) {
        throw new EvidenceError(
            "That is not a GitHub pull request or issue link. It should look like " +
                "https://github.com/owner/repo/pull/123",
        );
    }

    // Issues and PRs share a numbering space; the issues endpoint answers for
    // both, and PRs carry `pull_request` on the issue representation. Asking the
    // right endpoint for each keeps `merged_at` available for PRs.
    const path =
        ref.kind === "pr"
            ? `${API}/repos/${ref.owner}/${ref.repo}/pulls/${ref.number}`
            : `${API}/repos/${ref.owner}/${ref.repo}/issues/${ref.number}`;

    const response = await fetch(path, { headers: headers(), cache: "no-store" });

    if (response.status === 404) {
        throw new EvidenceError(
            "GitHub returned 404 for that link. Check the URL, and note that a private repository cannot be verified.",
        );
    }
    if (response.status === 403 || response.status === 429) {
        // 403 covers more than rate limiting, and blaming the limit for all of
        // it sends whoever debugs this down the wrong path — as it did once
        // already. Report what GitHub said, and whether we were even
        // authenticated, because an unauthenticated deployment on a shared
        // egress IP sits permanently over the 60-an-hour anonymous ceiling and
        // looks exactly like a rate limit that never clears.
        const detail = await response
            .json()
            .then((body: { message?: string }) => body?.message)
            .catch(() => undefined);
        const authenticated = Boolean(process.env.GITHUB_TOKEN);

        console.error(
            `[github-verify] ${response.status} for ${path} (token configured: ${authenticated}): ${detail ?? "no message"}`,
        );

        throw new EvidenceError(
            authenticated
                ? `GitHub refused the check (${response.status}). Try again in a few minutes. ${detail ?? ""}`.trim()
                : "This deployment has no GITHUB_TOKEN, so links cannot be checked — anonymous requests share one small quota per server. Set GITHUB_TOKEN and redeploy.",
        );
    }
    if (!response.ok) {
        throw new EvidenceError(`GitHub answered ${response.status} for that link. Try again shortly.`);
    }

    const data = (await response.json()) as GithubPR;
    const author = data.user?.login;
    if (!author) throw new EvidenceError("GitHub did not report an author for that link.");

    const state: PRState = data.merged_at ? "merged" : data.state === "closed" ? "closed" : "open";

    return {
        url: data.html_url,
        kind: ref.kind,
        repo: `${ref.owner}/${ref.repo}`,
        number: data.number ?? ref.number,
        title: data.title,
        author,
        state,
        reviewRounds: ref.kind === "pr" ? await countReviewRounds(ref.owner, ref.repo, ref.number) : 0,
        openedAt: data.created_at,
        verifiedAt: new Date().toISOString(),
    };
}

/**
 * A "round" is one submitted review, not one inline comment — five nitpicks in
 * a single review is one round, which is what milestone 9 means by it. A
 * failure here is not fatal: the count only gates milestone 9, so it degrades
 * to zero rather than blocking an otherwise valid submission.
 */
async function countReviewRounds(owner: string, repo: string, number: number): Promise<number> {
    try {
        const response = await fetch(`${API}/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=100`, {
            headers: headers(),
            cache: "no-store",
        });
        if (!response.ok) return 0;
        const reviews = (await response.json()) as { state: string }[];
        return reviews.filter((r) => r.state !== "PENDING").length;
    } catch {
        return 0;
    }
}
