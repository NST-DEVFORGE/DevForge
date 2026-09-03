/**
 * The one place the site talks to the GitHub search API.
 *
 * Three routes previously each had their own copy of the fetch logic, and all
 * three shared the same two faults: a single `per_page=100` request with no
 * paging, so anybody past a hundred pull requests was silently truncated; and a
 * failed request that returned zero, indistinguishable from a member who
 * genuinely has none. The second fault is the worse one — a rate-limited
 * response quietly became "0 PRs", and one route papered over that by
 * substituting hand-typed numbers, so a broken fetch rendered as plausible
 * stale data with no indication anything had gone wrong.
 *
 * Here, truncation is fixed by paging and failure is thrown. Callers decide
 * what to show, but they can no longer mistake an outage for an empty result.
 */

const API = "https://api.github.com";
const PER_PAGE = 100;
/** GitHub's search API refuses to page past 1000 results for any query. */
const SEARCH_CEILING = 1000;
/** Stats are not live-ops data; half an hour of staleness costs nothing. */
export const STATS_REVALIDATE = 1800;

export class GithubError extends Error {
    constructor(
        readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "GithubError";
    }
}

function headers(): HeadersInit {
    const h: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "DevForge-PR-Stats",
    };
    if (process.env.GITHUB_TOKEN) h.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    return h;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* Search throttle                                                     */
/* ------------------------------------------------------------------ */

/**
 * GitHub's search endpoint has its own budget — 30 requests a minute with a
 * token, 10 without — entirely separate from the 5000/hour core budget that
 * `/rate_limit` reports first and that everyone reads as "we have plenty".
 *
 * The stats routes need roughly one search per member per state, so a single
 * cold page load asks for about fifty. Fired together they blew straight
 * through the minute budget, and the old code answered a rejected request with
 * `continue`, so the failures were invisible: merged counts (queried first)
 * survived, open and closed came back empty, and the GSoC page rendered zeroes
 * that looked like real numbers.
 *
 * Every search now goes through this gate, one at a time, pacing itself off the
 * budget GitHub reports back rather than a fixed sleep — full speed while there
 * is headroom, waiting only when the window is genuinely spent.
 */
let chain: Promise<unknown> = Promise.resolve();
let remaining = Infinity;
let resetAtMs = 0;

function noteBudget(response: Response): void {
    const left = Number(response.headers.get("x-ratelimit-remaining"));
    const reset = Number(response.headers.get("x-ratelimit-reset"));
    if (Number.isFinite(left)) remaining = left;
    if (Number.isFinite(reset)) resetAtMs = reset * 1000;
}

/** Waits out the current window when the budget is spent. */
async function awaitBudget(): Promise<void> {
    if (remaining > 1) return;
    const waitMs = Math.max(0, resetAtMs - Date.now()) + 1000;
    // A spent window is at most a minute wide; anything longer means the clock
    // or the header is wrong, so cap it rather than hang the request.
    await sleep(Math.min(waitMs, 65_000));
    remaining = Infinity;
}

/** Serializes search calls so concurrent callers share one budget, not race it. */
function queued<T>(work: () => Promise<T>): Promise<T> {
    const run = chain.then(work, work);
    chain = run.catch(() => undefined);
    return run;
}

async function searchFetch(url: string, revalidate: number): Promise<Response> {
    for (let attempt = 0; attempt < 3; attempt++) {
        await awaitBudget();
        const response = await fetch(url, { headers: headers(), next: { revalidate } });
        noteBudget(response);

        if (response.status !== 403 && response.status !== 429) return response;

        // Secondary rate limits answer with Retry-After; primary ones only move
        // the reset timestamp. Honour whichever is present, then try again.
        const retryAfter = Number(response.headers.get("retry-after"));
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : Math.max(0, resetAtMs - Date.now()) + 1000;
        await sleep(Math.min(waitMs, 65_000));
        remaining = Infinity;
    }

    throw new GithubError(
        429,
        "GitHub kept rate-limiting the search API. Without GITHUB_TOKEN the limit is 10 searches a minute; with one it is 30.",
    );
}

export interface SearchedPR {
    title: string;
    html_url: string;
    number: number;
    repository_url: string;
    created_at: string;
    closed_at: string | null;
    state: "open" | "closed";
    /** Present on pull requests; `merged_at` is what separates merged from rejected. */
    pull_request?: { merged_at: string | null };
}

export type PRState = "merged" | "open" | "closed";

export function prState(pr: SearchedPR): PRState {
    if (pr.pull_request?.merged_at) return "merged";
    return pr.state === "closed" ? "closed" : "open";
}

/**
 * Every pull request a member has authored, in one query.
 *
 * The routes used to ask three separate questions per member — merged, open,
 * closed — which tripled the cost against the tightest budget on the API. The
 * search result already carries `state` and `pull_request.merged_at`, so one
 * query answers all three, and every route sharing this exact query string
 * means they also share one cache entry instead of spending the budget again.
 */
export async function allPRsFor(handle: string, revalidate = STATS_REVALIDATE): Promise<SearchedPR[]> {
    return searchAllPRs(`author:${handle} is:pr`, revalidate);
}

interface SearchPage {
    total_count: number;
    items: SearchedPR[];
}

async function searchPage(query: string, page: number, revalidate: number): Promise<SearchPage> {
    const url = `${API}/search/issues?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${page}`;
    const response = await queued(() => searchFetch(url, revalidate));

    if (!response.ok) {
        throw new GithubError(response.status, `GitHub search failed with ${response.status}.`);
    }
    return (await response.json()) as SearchPage;
}

/** How many results a query has, without pulling any of them. */
export async function countPRs(query: string, revalidate = STATS_REVALIDATE): Promise<number> {
    const first = await searchPage(query, 1, revalidate);
    return first.total_count ?? 0;
}

/**
 * Every result for a query, paged. Stops at GitHub's 1000-result ceiling rather
 * than looping forever against an API that will only answer with an error.
 */
export async function searchAllPRs(query: string, revalidate = STATS_REVALIDATE): Promise<SearchedPR[]> {
    const first = await searchPage(query, 1, revalidate);
    const total = Math.min(first.total_count ?? 0, SEARCH_CEILING);
    const items = [...(first.items ?? [])];

    const pages = Math.ceil(total / PER_PAGE);
    for (let page = 2; page <= pages; page++) {
        const next = await searchPage(query, page, revalidate);
        if (!next.items?.length) break;
        items.push(...next.items);
    }

    return items;
}

export interface RepoFacts {
    name: string;
    stars: number;
    forks: number;
}

/**
 * Repository metadata, cached across every member in a request rather than
 * per member. The quality-PR calculation looks up the repository behind each
 * pull request; without a shared cache, twenty contributors to the same popular
 * project cost twenty identical lookups. Popular repositories are exactly the
 * ones that repeat, so this is where the request budget was going.
 */
const repoCache = new Map<string, { facts: RepoFacts | null; at: number }>();
const REPO_TTL_MS = 60 * 60 * 1000;

export async function repoFacts(repositoryUrl: string): Promise<RepoFacts | null> {
    const cached = repoCache.get(repositoryUrl);
    if (cached && Date.now() - cached.at < REPO_TTL_MS) return cached.facts;

    let facts: RepoFacts | null = null;
    try {
        const response = await fetch(repositoryUrl, { headers: headers(), next: { revalidate: 3600 } });
        if (response.ok) {
            const data = (await response.json()) as {
                full_name?: string;
                stargazers_count?: number;
                forks_count?: number;
            };
            facts = {
                name: data.full_name ?? repoNameFromUrl(repositoryUrl),
                stars: data.stargazers_count ?? 0,
                forks: data.forks_count ?? 0,
            };
        }
    } catch (error) {
        console.error(`[github] repo lookup failed for ${repositoryUrl}:`, error);
    }

    repoCache.set(repositoryUrl, { facts, at: Date.now() });
    return facts;
}

/** "https://api.github.com/repos/owner/name" -> "owner/name". */
export function repoNameFromUrl(repositoryUrl: string): string {
    return repositoryUrl.split("/").slice(-2).join("/");
}

/** The bar for a "quality" PR: a repository with real adoption behind it. */
export const QUALITY_STARS = 100;
export const QUALITY_FORKS = 100;

export function isQualityRepo(facts: RepoFacts | null): boolean {
    return Boolean(facts && facts.stars >= QUALITY_STARS && facts.forks >= QUALITY_FORKS);
}
