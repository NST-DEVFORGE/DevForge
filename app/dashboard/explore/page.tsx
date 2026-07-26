import { redirect } from "next/navigation";
import { Compass, Github, ExternalLink, Users } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession } from "@/lib/session";
import { collaboratorsFull, type CollabRequest, type Project } from "@/lib/projects";
import { RequestToJoin } from "@/components/projects/request-to-join";

export const metadata = { title: "Explore projects" };

export default async function ExplorePage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard/explore");

    const [projectsSnap, myRequestsSnap] = await Promise.all([
        club<Project>(COLLECTIONS.projects).where("status", "==", "published").get(),
        club<CollabRequest>(COLLECTIONS.collabRequests).where("usn", "==", session.usn).get(),
    ]);

    const myRequests = new Map(myRequestsSnap.docs.map((d) => [d.data().projectId, d.data().status]));
    const projects = projectsSnap.docs
        .map((d) => d.data())
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <Compass size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Explore <span className="text-cyan-400">projects</span>
                    </h1>
                    <p className="text-neutral-400">
                        {projects.length === 0
                            ? "No published projects yet."
                            : "What the club is building. Ask to join one."}
                    </p>
                </div>

                <div className="space-y-3">
                    {projects.map((project) => {
                        const mine = project.ownerUsn === session.usn;
                        const isCollaborator = project.collaborators.includes(session.usn);
                        const requestState = isCollaborator
                            ? ("collaborator" as const)
                            : (myRequests.get(project.id) ?? "none");
                        const closed = project.collaboratorLimit === 0;
                        const full = collaboratorsFull(project);

                        return (
                            <div key={project.id} className="glass glass-hover rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-white">{project.title}</h2>
                                        <p className="text-xs text-neutral-500 mb-1">by {project.ownerName}</p>
                                        <p className="text-sm text-neutral-400">{project.tagline}</p>

                                        {project.tech.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {project.tech.map((t) => (
                                                    <span key={t} className="text-[11px] text-neutral-400 glass-subtle rounded-full px-2 py-0.5">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Users size={12} />
                                                {project.collaborators.length + 1}
                                                {project.collaboratorLimit !== null &&
                                                    ` / ${project.collaboratorLimit + 1}`}{" "}
                                                on the team
                                            </span>
                                            {project.repoUrl && (
                                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-300">
                                                    <Github size={12} /> Repo
                                                </a>
                                            )}
                                            {project.demoUrl && (
                                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-300">
                                                    <ExternalLink size={12} /> Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {mine ? (
                                            <span className="text-xs text-neutral-600">Your project</span>
                                        ) : (
                                            <RequestToJoin
                                                projectId={project.id}
                                                initialState={requestState as "none" | "pending" | "accepted" | "rejected" | "collaborator"}
                                                disabled={closed || full}
                                                disabledReason={closed ? "Not taking collaborators" : full ? "Team is full" : undefined}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
