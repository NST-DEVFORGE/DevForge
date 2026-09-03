export type Arena = "workbook" | "club" | "external";

export interface Milestone {
    n: number;
    title: string;
    goal: string;
    arena: Arena;
    /** Acceptance criteria. All must be true before the milestone is signed off. */
    done: string[];
    /** The specific way students fail this one. Written from real club PRs. */
    trap: string;
    /** Asked in addition to the five standard reflection fields. */
    reflect: string;
    est: string;
}

export const ARENA_LABELS: Record<Arena, string> = {
    workbook: "This workbook",
    club: "A DevForge repo",
    external: "A real outside project",
};

/**
 * The 10 PR Journey.
 *
 * Ordering rules that produced this ladder:
 *  - Nobody touches an external repo before milestone 3. The first two PRs are
 *    supervised, because a cohort of beginners opening typo PRs at strangers is
 *    how a club gets a reputation it cannot undo.
 *  - Documentation is milestone 6, not 1. Docs written after you have been
 *    confused by a codebase are worth reading; typo fixes teach only git.
 *  - Tests come before fixes. A test PR has the highest acceptance rate of
 *    anything a beginner can open, and it forces you to read the code.
 *  - Milestone 9 cannot be completed by getting it right the first time.
 */
export const milestones: Milestone[] = [
    {
        n: 1,
        title: "Sign the workbook",
        goal: "Open a pull request against this workbook adding your own entry. Your first PR is to us, not to a stranger.",
        arena: "workbook",
        done: [
            "You worked on a branch, not on main — your PR shows one file changed, not forty",
            "A senior member left at least one review comment",
            "You pushed a follow-up commit that addressed it (not a new PR)",
            "Merged",
        ],
        trap: "Committing to main on your fork, then wondering why the PR contains everyone else's work. If your diff has files you did not touch, close it and start the branch again.",
        reflect: "Which part of fork → branch → commit → PR did you have to look up? Be honest — everyone looks something up here.",
        est: "One evening",
    },
    {
        n: 2,
        title: "Fix something that is ours",
        goal: "A real code change in a DevForge repo — the portal, a club project, a script. Real review, forgiving maintainer.",
        arena: "club",
        done: [
            "An issue exists and is assigned to you before you write code",
            "The diff is under ~50 lines",
            "CI is green without anyone re-running it for you",
            "Reviewed by a maintainer and merged",
        ],
        trap: "Picking something too big because it sounded more impressive. If your diff passes 100 lines at milestone 2, you chose wrong — split it or pick again.",
        reflect: "How long between understanding the bug and having a fix? Where did that time actually go — reading, setup, or typing?",
        est: "Two to four evenings",
    },
    {
        n: 3,
        title: "File a bug nobody can dismiss",
        goal: "A reproducible issue on a real outside project. No code in this milestone at all.",
        arena: "external",
        done: [
            "Exact version, OS, and commit SHA",
            "Minimal steps a stranger can follow without asking you anything",
            "Expected behaviour vs. what actually happened, stated separately",
            "You searched the existing issues first and linked the closest one you found",
            "A maintainer responded — any response counts, including 'duplicate'",
        ],
        trap: "\"It doesn't work.\" Also: filing before searching. Being a duplicate is fine if you say what you searched for; being unreproducible is not.",
        reflect: "Paste the maintainer's first reply verbatim. What did it assume you already knew?",
        est: "About a week of watching one repo",
    },
    {
        n: 4,
        title: "Add a test for something that already works",
        goal: "Cover existing untested behaviour. No behaviour change. This is the highest-acceptance PR a beginner can open.",
        arena: "external",
        done: [
            "You broke a line of the source on purpose and watched your test fail — output pasted in the reflection",
            "It follows the repo's existing test conventions, not your own",
            "You can run the full suite locally",
            "CI green",
        ],
        trap: "Writing a test that passes even when the feature is broken. If you did not watch it fail, you did not write a test — you wrote a comment that takes 40ms to run.",
        reflect: "What did reading the test suite tell you about this codebase that reading the source did not?",
        est: "About a week",
    },
    {
        n: 5,
        title: "Fix the bug",
        goal: "Fix the issue you filed at milestone 3, or a good-first-issue that a maintainer assigned to you.",
        arena: "external",
        done: [
            "You commented on the issue and got a reply before writing code",
            "The fix ships with a test — the skill you built at milestone 4",
            "The PR closes the issue with 'Fixes #N'",
            "At least one round of review that you responded to",
        ],
        trap: "Opening the PR before commenting on the issue. Two people silently fixing the same bug is how contributors burn out and how maintainers stop labelling issues for beginners.",
        reflect: "What was the actual root cause, and what did you believe it was during the first hour?",
        est: "About two weeks",
    },
    {
        n: 6,
        title: "Write the documentation you needed",
        goal: "Document the exact thing that confused you at milestone 4 or 5. Now you have earned this PR.",
        arena: "external",
        done: [
            "Not a typo fix — a new explanation, a worked example, or a section you rewrote",
            "You can name the moment you were confused and link the code that confused you",
            "Merged, or carrying maintainer feedback you have responded to",
        ],
        trap: "This is the milestone that looks easy and is not. If you cannot point at the hour you were stuck, you have not earned it yet — go back and finish 4.",
        reflect: "What did the existing docs assume about the reader that turned out to be untrue for you?",
        est: "Three to five days",
    },
    {
        n: 7,
        title: "Ship a feature you negotiated first",
        goal: "A change the maintainers agreed to before you built it. The conversation is the milestone; the code is the receipt.",
        arena: "external",
        done: [
            "An issue or discussion where you proposed it and a maintainer said some version of yes",
            "The scope you shipped matches the scope that was agreed",
            "The PR links that conversation",
            "Merged, or open with active maintainer engagement",
        ],
        trap: "Building first and asking after. Second trap: the unsolicited refactor. If your PR title starts with 'refactor' and nobody asked for it, expect it closed. Refactor when a reviewer asks, inside the PR they asked in.",
        reflect: "What did the maintainer change about your proposal before agreeing to it?",
        est: "Three to four weeks",
    },
    {
        n: 8,
        title: "Review someone else's work",
        goal: "Two reviews: one on a club member's PR, one on a stranger's. Sit on the other side of the table.",
        arena: "external",
        done: [
            "Each review carries at least one specific, actionable comment — 'LGTM' is not a review",
            "You ran or genuinely read the code, and can say which",
            "You asked at least one real question about something you did not understand",
        ],
        trap: "Rubber-stamping, and its mirror image — nitpicking whitespace and naming that a linter already handles. Both tell the author you did not read it.",
        reflect: "What did you fail to understand in their code, and did you say so out loud in the review?",
        est: "About a week",
    },
    {
        n: 9,
        title: "Survive a hard review",
        goal: "A PR that took three or more rounds, or one that got closed. This is the only milestone you cannot complete by getting it right first time.",
        arena: "external",
        done: [
            "Three or more rounds of review that you worked through — or a closed PR",
            "A closed PR completes this milestone in full. That is the point of it",
            "You did not argue past the second 'no', and you did not disappear",
        ],
        trap: "Arguing, or ghosting. They end the same way, and maintainers remember both.",
        reflect: "Quote the harshest piece of feedback you received. Was it right? What would you tell yourself the day before you opened that PR?",
        est: "However long it takes",
    },
    {
        n: 10,
        title: "The one you would defend",
        goal: "A contribution the project actually keeps, and that you can talk about for fifteen minutes without notes.",
        arena: "external",
        done: [
            "Merged, and shipped in a release or a release branch",
            "You can explain the root cause, the approaches you rejected, and what a reviewer caught that you missed",
            "You presented it to the club in five minutes and took questions",
        ],
        trap: "Choosing the largest diff instead of the one you understand best. Nobody in an interview counts your lines.",
        reflect: "This is your interview answer. Write it as one, out loud, and time yourself.",
        est: "The rest of the semester",
    },
];

export interface ReflectionField {
    label: string;
    limit: string;
    hint: string;
}

/**
 * Five fields, hard caps, filed within 48 hours of the review.
 * Free-form journals die in week three; a short fixed template survives a semester.
 */
export const reflectionTemplate: ReflectionField[] = [
    {
        label: "What I tried",
        limit: "100 words",
        hint: "The approach you took — including the one you abandoned before it.",
    },
    {
        label: "What broke",
        limit: "100 words",
        hint: "The error, the wrong assumption, or the dead end. \"Nothing\" is not an answer; if nothing broke, the task was too small.",
    },
    {
        label: "What the reviewer said",
        limit: "verbatim",
        hint: "Paste the actual comment. Do not paraphrase — paraphrasing sands the lesson off.",
    },
    {
        label: "What I would do differently",
        limit: "60 words",
        hint: "One concrete change to how you'd approach the next one.",
    },
    {
        label: "The numbers",
        limit: "one line",
        hint: "Hours spent · rounds of review · status (merged / open / closed).",
    },
];

/** The rules that stop this becoming a checklist people game. */
export const rules: { rule: string; why: string }[] = [
    {
        rule: "A closed PR still counts.",
        why: "Every milestone except the last completes on a good reflection, not on a merge. You do not control whether a maintainer merges you; you control what you learned.",
    },
    {
        rule: "No pull request before the issue.",
        why: "From milestone 3 onward you comment first and wait for a reply. Unannounced PRs are the single fastest way to waste a maintainer's afternoon.",
    },
    {
        rule: "One repo, at least three milestones.",
        why: "Depth beats breadth. Maintainers review known names properly and drive-by contributors barely at all — and you cannot do milestone 10 in a codebase you met last week.",
    },
    {
        rule: "Milestones 1 and 2 stay in-house on purpose.",
        why: "You do not take training wheels into a stranger's repository. Learn the mechanics where the cost of getting it wrong is a teammate's five minutes.",
    },
    {
        rule: "Reflections are due within 48 hours of the review.",
        why: "Written at the end of the semester they are fiction. Written the same week they are the thing you actually bring to an interview.",
    },
    {
        rule: "The goal is one deep story, not ten checkmarks.",
        why: "No interviewer is moved by ten pull requests. They are moved by one you can explain for fifteen minutes. The other nine are what make that one possible.",
    },
];

export const workbookMeta = {
    slug: "pr-workbook",
    cadence: "Roughly one milestone every two weeks — about a semester. Milestones 7, 9 and 10 will overlap, and should.",
    notThis: "This is not a course, and finishing it is not a certificate. Nothing here is completed by watching a video.",
};
