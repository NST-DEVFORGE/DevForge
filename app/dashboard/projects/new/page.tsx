import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/projects/project-form";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
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
                    New <span className="text-cyan-400">project</span>
                </h1>
                <p className="text-neutral-400 mb-8">
                    Drafts stay private to you. Publishing puts it on the club&rsquo;s project list.
                </p>

                <ProjectForm />
            </div>
        </div>
    );
}
