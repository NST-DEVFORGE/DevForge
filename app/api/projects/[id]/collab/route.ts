import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, getMember, requireUser } from "@/lib/session";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { notifyMember } from "@/lib/push";
import { collabId, collaboratorsFull, type CollabRequest, type Project } from "@/lib/projects";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const requestSchema = z.object({ message: z.string().trim().max(400).default("") });

/** Owner (or admin) sees who wants to join. */
export async function GET(_request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id } = await params;

        const projectSnap = await club<Project>(COLLECTIONS.projects).doc(id).get();
        if (!projectSnap.exists) return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

        const project = projectSnap.data() as Project;
        if (project.ownerUsn !== session.usn && session.role !== "admin") {
            return NextResponse.json({ ok: false, message: "Not your project" }, { status: 403 });
        }

        const snap = await club<CollabRequest>(COLLECTIONS.collabRequests).where("projectId", "==", id).get();
        const requests = snap.docs.map((d) => d.data()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return NextResponse.json({ ok: true, requests });
    } catch (error) {
        return authErrorResponse(error);
    }
}

/** A member asks to collaborate. */
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id } = await params;

        const limit = await checkRateLimit("collab-request", session.usn, RATE_LIMITS.write);
        if (!limit.ok) {
            return NextResponse.json({ ok: false, message: "Slow down a moment." }, { status: 429 });
        }

        const parsed = requestSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });

        const member = await getMember(session.usn);
        if (!member) throw new Error(`Session references a missing member: ${session.usn}`);

        const projectSnap = await club<Project>(COLLECTIONS.projects).doc(id).get();
        if (!projectSnap.exists || (projectSnap.data() as Project).status !== "published") {
            return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
        }
        const project = projectSnap.data() as Project;

        if (project.ownerUsn === session.usn) {
            return NextResponse.json({ ok: false, message: "It's already your project." }, { status: 400 });
        }
        if (project.collaborators.includes(session.usn)) {
            return NextResponse.json({ ok: false, message: "You're already a collaborator." }, { status: 409 });
        }
        if (project.collaboratorLimit === 0) {
            return NextResponse.json({ ok: false, message: "This project isn't taking collaborators." }, { status: 409 });
        }
        if (collaboratorsFull(project)) {
            return NextResponse.json({ ok: false, message: "This project's collaborator slots are full." }, { status: 409 });
        }

        const ref = club<CollabRequest>(COLLECTIONS.collabRequests).doc(collabId(id, session.usn));
        const existing = await ref.get();
        if (existing.exists && (existing.data() as CollabRequest).status === "pending") {
            return NextResponse.json({ ok: true, message: "Your request is already pending." });
        }

        const now = new Date().toISOString();
        await ref.set({
            id: ref.id,
            projectId: id,
            projectTitle: project.title,
            ownerUsn: project.ownerUsn,
            usn: member.usn,
            name: member.name,
            message: parsed.data.message,
            status: "pending",
            createdAt: now,
            updatedAt: now,
        });

        await notifyMember(project.ownerUsn, {
            title: "New collaboration request",
            body: `${member.name} wants to join ${project.title}`,
            url: `/dashboard/projects/${id}/manage`,
            tag: `collab-${id}`,
        });

        return NextResponse.json({ ok: true, message: "Request sent to the owner." }, { status: 201 });
    } catch (error) {
        return authErrorResponse(error);
    }
}

/** Withdraw your own pending request. */
export async function DELETE(_request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id } = await params;
        await club(COLLECTIONS.collabRequests).doc(collabId(id, session.usn)).delete();
        return NextResponse.json({ ok: true });
    } catch (error) {
        return authErrorResponse(error);
    }
}
