import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession } from "@/lib/session";
import { canEditProject, type Project } from "@/lib/projects";
import { ProjectForm } from "@/components/projects/project-form";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) redirect(`/login?next=/dashboard/projects/${id}/edit`);

    const snap = await club<Project>(COLLECTIONS.projects).doc(id).get();
    if (!snap.exists) notFound();

    const project = snap.data() as Project;
    // Same rule as the API: someone who can't edit it shouldn't learn it exists.
    if (!canEditProject(project, session)) notFound();

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

                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    Edit <span className="text-cyan-400">{project.title}</span>
                </h1>
                <p className="text-neutral-400 mb-8">
                    {project.status === "published"
                        ? "This is live on the club's project list."
                        : "This is a draft — only you can see it."}
                </p>

                <ProjectForm project={project} />
            </div>
        </div>
    );
}
