import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderGit2, Plus, Github, ExternalLink, Pencil } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession } from "@/lib/session";
import type { Project } from "@/lib/projects";

export const metadata = { title: "Your projects" };

export default async function ProjectsPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard/projects");

    const snap = await club<Project>(COLLECTIONS.projects).where("ownerUsn", "==", session.usn).get();
    const projects = snap.docs
        .map((d) => d.data())
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                            <FolderGit2 size={24} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                            Your <span className="text-cyan-400">projects</span>
                        </h1>
                        <p className="text-neutral-400">
                            {projects.length === 0
                                ? "Nothing here yet."
                                : `${projects.length} project${projects.length === 1 ? "" : "s"}.`}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-sm rounded-full px-5 py-2.5 transition-colors"
                    >
                        <Plus size={16} />
                        New project
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center">
                        <p className="text-neutral-400 mb-1">Publish something you&rsquo;re building.</p>
                        <p className="text-sm text-neutral-600">
                            Pick a repo straight from your GitHub — no copying links.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <div key={project.id} className="glass glass-hover rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="font-bold text-white truncate">{project.title}</h2>
                                            <span
                                                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                                                    project.status === "published"
                                                        ? "bg-cyan-400/10 text-cyan-300 border-cyan-400/25"
                                                        : "glass-subtle text-neutral-400 border-white/10"
                                                }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-400 mt-1">{project.tagline}</p>

                                        {project.tech.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {project.tech.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="text-[11px] text-neutral-400 glass-subtle rounded-full px-2 py-0.5"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={`/dashboard/projects/${project.id}/edit`}
                                        aria-label={`Edit ${project.title}`}
                                        className="glass-subtle hover:border-cyan-400/40 text-neutral-400 hover:text-cyan-300 rounded-full p-2 transition-colors flex-shrink-0"
                                    >
                                        <Pencil size={14} />
                                    </Link>
                                </div>

                                {(project.repoUrl || project.demoUrl) && (
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                        {project.repoUrl && (
                                            <a
                                                href={project.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-cyan-300 glass-subtle rounded-full px-2.5 py-1 transition-colors"
                                            >
                                                <Github size={13} />
                                                Repo
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-cyan-300 glass-subtle rounded-full px-2.5 py-1 transition-colors"
                                            >
                                                <ExternalLink size={13} />
                                                Demo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
