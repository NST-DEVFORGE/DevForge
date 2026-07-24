import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { club, unguardedDb, COLLECTIONS } from "@/lib/firebase/collections";
import { authErrorResponse, requireUser } from "@/lib/session";
import { notifyMember } from "@/lib/push";
import { collabId, collaboratorsFull, type CollabRequest, type Project } from "@/lib/projects";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string; usn: string }> };

const schema = z.object({ action: z.enum(["accept", "reject"]) });

/**
 * The owner accepts or rejects a collaboration request. Accepting adds the
 * member to the project's collaborators inside a transaction, so two accepts
 * can't push the project past its collaborator limit.
 */
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const session = await requireUser();
        const { id, usn } = await params;

        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });

        const projectRef = club<Project>(COLLECTIONS.projects).doc(id);
        const requestRef = club<CollabRequest>(COLLECTIONS.collabRequests).doc(collabId(id, usn));

        const result = await unguardedDb().runTransaction(async (tx) => {
            const [projectSnap, requestSnap] = await Promise.all([tx.get(projectRef), tx.get(requestRef)]);
            if (!projectSnap.exists) return { status: 404 as const, message: "Project not found." };
            if (!requestSnap.exists) return { status: 404 as const, message: "Request not found." };

            const project = projectSnap.data() as Project;
            const req = requestSnap.data() as CollabRequest;

            // Only the owner (or an admin) decides.
            if (project.ownerUsn !== session.usn && session.role !== "admin") {
                return { status: 403 as const, message: "Not your project." };
            }
            if (req.status !== "pending") {
                return { status: 409 as const, message: `Already ${req.status}.` };
            }

            if (parsed.data.action === "reject") {
                tx.update(requestRef, { status: "rejected", updatedAt: new Date().toISOString() });
                return { status: 200 as const, message: "Request declined.", notify: "rejected" as const, name: req.name };
            }

            // accept
            if (project.collaborators.includes(usn)) {
                tx.update(requestRef, { status: "accepted", updatedAt: new Date().toISOString() });
                return { status: 200 as const, message: "Already a collaborator.", notify: null };
            }
            if (collaboratorsFull(project)) {
                return { status: 409 as const, message: "Collaborator slots are full." };
            }

            tx.update(projectRef, {
                collaborators: [...project.collaborators, usn],
                updatedAt: new Date().toISOString(),
            });
            tx.update(requestRef, { status: "accepted", updatedAt: new Date().toISOString() });
            return {
                status: 200 as const,
                message: `${req.name} added to the project.`,
                notify: "accepted" as const,
                name: req.name,
                projectTitle: project.title,
            };
        });

        if (result.status === 200 && "notify" in result && result.notify) {
            await notifyMember(usn, {
                title: result.notify === "accepted" ? "Request accepted 🎉" : "Request update",
                body:
                    result.notify === "accepted"
                        ? `You're now a collaborator on ${result.projectTitle}`
                        : "Your collaboration request wasn't accepted this time.",
                url: "/dashboard/projects",
                tag: `collab-decision-${id}`,
            });
        }

        return NextResponse.json({ ok: result.status < 400, message: result.message }, { status: result.status });
    } catch (error) {
        return authErrorResponse(error);
    }
}
