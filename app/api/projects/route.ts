import { NextResponse, type NextRequest } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { projectInputSchema, slugify, type Project } from "@/lib/projects";

export const runtime = "nodejs";

/**
 * Published projects are public; drafts are visible only to their owner.
 * `?mine=1` returns everything the caller owns, drafts included.
 */
/**
 * Sorted in memory rather than with orderBy. Combining a where() with an
 * orderBy() on a different field needs a composite index, and this Firestore
 * project belongs to the student portal — adding indexes there is a
 * shared-resource change, not ours to make unilaterally. A club's project
 * list is small enough that this costs nothing.
 */
const newestFirst = (a: Project, b: Project) => b.createdAt.localeCompare(a.createdAt);

export async function GET(request: NextRequest) {
    const mine = request.nextUrl.searchParams.get("mine") === "1";
    const collection = club<Project>(COLLECTIONS.projects);

    if (!mine) {
        const snap = await collection.where("status", "==", "published").get();
        return NextResponse.json({ ok: true, projects: snap.docs.map((d) => d.data()).sort(newestFirst) });
    }

    try {
        const session = await requireUser();
        const snap = await collection.where("ownerUsn", "==", session.usn).get();
        return NextResponse.json({ ok: true, projects: snap.docs.map((d) => d.data()).sort(newestFirst) });
    } catch (error) {
        return authErrorResponse(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireUser();

        const limit = await checkRateLimit("project-write", session.usn, RATE_LIMITS.write);
        if (!limit.ok) {
            return NextResponse.json(
                { ok: false, message: "You're doing that too quickly." },
                { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
            );
        }

        const parsed = projectInputSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid project" },
                { status: 400 },
            );
        }

        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        const collection = club<Project>(COLLECTIONS.projects);
        const ref = collection.doc();
        const now = new Date().toISOString();

        const project: Project = {
            ...parsed.data,
            id: ref.id,
            // Doc ids are unique, so a short suffix settles title collisions
            // without a read-modify-write race between two creators.
            slug: `${slugify(parsed.data.title)}-${ref.id.slice(0, 5).toLowerCase()}`,
            ownerUsn: member.usn,
            ownerName: member.name,
            collaborators: [],
            createdAt: now,
            updatedAt: now,
        };

        // createdAt is an ISO string, which sorts lexicographically — no
        // separate server timestamp is needed for ordering.
        await ref.set(project);
        return NextResponse.json({ ok: true, project }, { status: 201 });
    } catch (error) {
        return authErrorResponse(error);
    }
}
