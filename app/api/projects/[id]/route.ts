import { NextResponse, type NextRequest } from "next/server";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getSession, requireUser } from "@/lib/session";
import { canEditProject, projectInputSchema, type Project } from "@/lib/projects";
import { notifyAllMembers } from "@/lib/push";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function load(id: string) {
    const snap = await club<Project>(COLLECTIONS.projects).doc(id).get();
    return snap.exists ? (snap.data() as Project) : null;
}

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    const project = await load(id);
    if (!project) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

    // Drafts stay private to people who could edit them; everyone else gets a
    // 404 rather than a 403, so an id can't be probed for existence.
    if (project.status === "draft") {
        const session = await getSession();
        if (!session || !canEditProject(project, session)) {
            return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
        }
    }

    return NextResponse.json({ ok: true, project });
}

export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const session = await requireUser();
        const project = await load(id);

        if (!project) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
        if (!canEditProject(project, session)) {
            return NextResponse.json({ ok: false, message: "This isn't your project" }, { status: 403 });
        }

        const parsed = projectInputSchema.partial().safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid update" },
                { status: 400 },
            );
        }

        // Ownership and identity fields are never taken from the request body.
        const updates = { ...parsed.data, updatedAt: new Date().toISOString() };
        await club<Project>(COLLECTIONS.projects).doc(id).update(updates);

        // Announce only on the draft → published transition, not on every edit.
        if (updates.status === "published" && project.status !== "published") {
            await notifyAllMembers(
                {
                    title: `New project: ${project.title}`,
                    body: `${project.ownerName} — ${project.tagline}`,
                    url: "/dashboard/projects",
                    tag: `project-${project.id}`,
                },
                project.ownerUsn,
            );
        }

        return NextResponse.json({ ok: true, project: { ...project, ...updates } });
    } catch (error) {
        return authErrorResponse(error);
    }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const session = await requireUser();
        const project = await load(id);

        if (!project) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
        if (!canEditProject(project, session)) {
            return NextResponse.json({ ok: false, message: "This isn't your project" }, { status: 403 });
        }

        await club(COLLECTIONS.projects).doc(id).delete();
        return NextResponse.json({ ok: true });
    } catch (error) {
        return authErrorResponse(error);
    }
}
