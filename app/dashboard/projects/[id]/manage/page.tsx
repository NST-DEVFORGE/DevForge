import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { club, external, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession } from "@/lib/session";
import { canEditProject, collaboratorsFull, type CollabRequest, type Project } from "@/lib/projects";
import { normalizeGithub } from "@/lib/members";
import { Avatar } from "@/components/ui/avatar";
import { CollabRequests } from "@/components/projects/collab-requests";

export const metadata = { title: "Manage project" };

export default async function ManageProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) redirect(`/login?next=/dashboard/projects/${id}/manage`);

    const snap = await club<Project>(COLLECTIONS.projects).doc(id).get();
    if (!snap.exists) notFound();
    const project = snap.data() as Project;
    if (!canEditProject(project, session)) notFound();

    const requestsSnap = await club<CollabRequest>(COLLECTIONS.collabRequests).where("projectId", "==", id).get();
    const requests = requestsSnap.docs.map((d) => d.data());

    // Resolve collaborator display names/avatars from members + portal.
    const collaborators = await Promise.all(
        project.collaborators.map(async (usn) => {
            const m = await club(COLLECTIONS.members).doc(usn).get();
            const name = m.exists ? (m.data() as { name?: string }).name ?? usn : usn;
            const memberGithub = m.exists ? (m.data() as { github?: string }).github : undefined;
            const student = await external("students").doc(usn).get();
            const github = normalizeGithub(memberGithub ?? (student.exists ? (student.data() as { github?: string }).github : undefined));
            return { usn, name, github, hasPhoto: m.exists || student.exists };
        }),
    );

    const full = collaboratorsFull(project);
    const pendingCount = requests.filter((r) => r.status === "pending").length;

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                <Link
                    href="/dashboard/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-cyan-300 transition-colors mb-6"
                >
                    <ArrowLeft size={15} />
                    Your projects
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    Manage <span className="text-cyan-400">{project.title}</span>
                </h1>
                <p className="text-neutral-400 mb-8">
                    {project.collaboratorLimit === null
                        ? "Open to collaborators."
                        : `${project.collaborators.length} of ${project.collaboratorLimit} collaborator slots filled.`}
                </p>

                <section className="mb-10">
                    <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                        Requests{pendingCount > 0 ? ` (${pendingCount})` : ""}
                    </h2>
                    {full && pendingCount > 0 && (
                        <p className="text-xs text-yellow-400/80 mb-3">
                            Slots are full — free one up or raise the limit to accept more.
                        </p>
                    )}
                    <CollabRequests projectId={id} requests={requests} full={full} />
                </section>

                <section>
                    <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                        Team ({project.collaborators.length + 1})
                    </h2>
                    <div className="space-y-2">
                        <TeamRow name={project.ownerName} usn={project.ownerUsn} badge="Owner" />
                        {collaborators.map((c) => (
                            <TeamRow key={c.usn} name={c.name} usn={c.usn} github={c.github} hasPhoto={c.hasPhoto} />
                        ))}
                        {collaborators.length === 0 && (
                            <p className="text-sm text-neutral-500 flex items-center gap-2">
                                <Users size={14} /> Just you so far.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function TeamRow({
    name,
    usn,
    github,
    hasPhoto,
    badge,
}: {
    name: string;
    usn: string;
    github?: string;
    hasPhoto?: boolean;
    badge?: string;
}) {
    return (
        <div className="flex items-center gap-3 glass rounded-xl p-3">
            <Avatar
                src={hasPhoto ? `/api/members/${usn}/avatar` : undefined}
                github={github}
                alt={name}
                size={36}
                className="ring-1 ring-white/10"
            />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{name}</p>
                <p className="text-xs text-neutral-500 font-mono">{usn}</p>
            </div>
            {badge && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-2 py-0.5">
                    {badge}
                </span>
            )}
        </div>
    );
}
