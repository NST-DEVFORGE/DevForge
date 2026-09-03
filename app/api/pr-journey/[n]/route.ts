import { NextResponse, type NextRequest } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { verifyEvidence } from "@/lib/github-verify";
import {
    EVIDENCE_RULES,
    EvidenceError,
    checkArena,
    checkAuthor,
    checkHardReview,
    checkKind,
    checkMilestone10,
    emptyJourney,
    milestoneExists,
    validateReflection,
    type JourneyEntry,
    type JourneyRecord,
} from "@/lib/pr-journey";
import { resolveGithub } from "@/lib/member-github";

export const runtime = "nodejs";

type Params = { params: Promise<{ n: string }> };

/**
 * Submits one milestone: a GitHub link plus the five-field reflection.
 *
 * Everything checkable is checked here rather than trusted — the link resolves,
 * you opened it (or, for milestone 8, you did not), and it sits in the right
 * kind of repository for where you are on the ladder. What a human still has to
 * judge is the reflection, which is why submission lands in `submitted` and a
 * reviewer moves it to `signed-off`.
 */
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const n = Number((await params).n);
        if (!milestoneExists(n)) {
            return NextResponse.json({ ok: false, message: "No such milestone." }, { status: 404 });
        }

        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        const github = await resolveGithub(session.usn, member.github);
        if (!github) {
            return NextResponse.json(
                {
                    ok: false,
                    message:
                        "We could not find your GitHub username on your profile, so the link cannot be checked against you. Add it and try again.",
                },
                { status: 409 },
            );
        }

        const body = (await request.json()) as { url?: string; reflection?: unknown };
        const rule = EVIDENCE_RULES[n];

        const reflection = validateReflection(body.reflection);
        const evidence = await verifyEvidence(String(body.url ?? ""));

        checkKind(evidence.kind, rule);
        checkAuthor(evidence.author, rule, github);
        checkArena(evidence.repo.split("/")[0], rule.arena, github);
        if (n === 9) checkHardReview(evidence);
        if (n === 10) checkMilestone10(evidence);

        const ref = club<JourneyRecord>(COLLECTIONS.prJourney).doc(session.usn);
        const snap = await ref.get();
        const record = snap.exists
            ? (snap.data() as JourneyRecord)
            : emptyJourney(session.usn, member.name, github);

        const previous = record.entries[String(n)];
        if (previous?.state === "signed-off") {
            return NextResponse.json(
                { ok: false, message: "That milestone is already signed off. Talk to your reviewer to reopen it." },
                { status: 409 },
            );
        }

        const entry: JourneyEntry = {
            n,
            evidence,
            reflection,
            state: "submitted",
            submittedAt: new Date().toISOString(),
        };

        record.entries[String(n)] = entry;
        record.github = github;
        record.updatedAt = entry.submittedAt;
        await ref.set(record);

        return NextResponse.json({ ok: true, message: "Submitted for sign-off.", entry });
    } catch (error) {
        if (error instanceof EvidenceError) {
            return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
        }
        return authErrorResponse(error);
    }
}

/**
 * Re-checks a submission against GitHub and stores what it finds now.
 *
 * A PR is rarely in its final state when it is submitted — it is open on
 * Tuesday and merged on Friday, and the record should say so without the
 * student refiling anything. Only the observed facts move; the reflection and
 * the sign-off are untouched, so a merge cannot launder a milestone a reviewer
 * already sent back.
 *
 * Members refresh their own. A reviewer can refresh anyone's, which is what
 * makes the queue trustworthy: the state shown at sign-off is the state now,
 * not the state at submission.
 */
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const n = Number((await params).n);
        if (!milestoneExists(n)) {
            return NextResponse.json({ ok: false, message: "No such milestone." }, { status: 404 });
        }

        const body = (await request.json().catch(() => ({}))) as { usn?: string };
        const target = body.usn ?? session.usn;

        if (target !== session.usn) {
            const me = await getMember(session.usn);
            if (!me || !can(me, "journey:review")) {
                return NextResponse.json(
                    { ok: false, message: "You can only re-check your own submissions." },
                    { status: 403 },
                );
            }
        }

        const ref = club<JourneyRecord>(COLLECTIONS.prJourney).doc(target);
        const snap = await ref.get();
        if (!snap.exists) return NextResponse.json({ ok: false, message: "No journey there." }, { status: 404 });

        const record = snap.data() as JourneyRecord;
        const entry = record.entries[String(n)];
        if (!entry) {
            return NextResponse.json({ ok: false, message: "Nothing submitted for that milestone." }, { status: 404 });
        }

        const fresh = await verifyEvidence(entry.evidence.url);
        const changed =
            fresh.state !== entry.evidence.state || fresh.reviewRounds !== entry.evidence.reviewRounds;

        entry.evidence = fresh;
        record.entries[String(n)] = entry;
        record.updatedAt = new Date().toISOString();
        await ref.set(record);

        return NextResponse.json({
            ok: true,
            changed,
            entry,
            message: changed
                ? `Now ${fresh.state}, ${fresh.reviewRounds} review rounds.`
                : `Still ${fresh.state}. Nothing has moved.`,
        });
    } catch (error) {
        if (error instanceof EvidenceError) {
            return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
        }
        return authErrorResponse(error);
    }
}

/** Withdraws a submission that has not been signed off yet. */
export async function DELETE(_request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const n = Number((await params).n);

        const ref = club<JourneyRecord>(COLLECTIONS.prJourney).doc(session.usn);
        const snap = await ref.get();
        if (!snap.exists) return NextResponse.json({ ok: true });

        const record = snap.data() as JourneyRecord;
        if (record.entries[String(n)]?.state === "signed-off") {
            return NextResponse.json(
                { ok: false, message: "Signed-off milestones stay on the record." },
                { status: 409 },
            );
        }

        delete record.entries[String(n)];
        record.updatedAt = new Date().toISOString();
        await ref.set(record);

        return NextResponse.json({ ok: true, message: "Withdrawn." });
    } catch (error) {
        return authErrorResponse(error);
    }
}
