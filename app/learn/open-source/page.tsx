import Link from "next/link";
import { ArrowLeft, GitPullRequest } from "lucide-react";
import { PRWorkbook } from "@/components/pr-workbook";

export const metadata = {
    title: "The 10 PR Journey | DevForge",
    description:
        "A hands-on open source workbook: ten pull requests, from a supervised first PR to a contribution you can defend in an interview — with the reflection that makes it stick.",
};

export default function PRJourneyPage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24">
            <div className="max-w-3xl mx-auto px-4">
                <Link
                    href="/learn"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-cyan-300 transition-colors mb-8"
                >
                    <ArrowLeft size={14} /> Learning Tracks
                </Link>

                <div className="mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <GitPullRequest size={30} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight">
                        The <span className="text-cyan-400">10 PR</span> Journey
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Ten pull requests, in order, from one we review ourselves to one a real project keeps. You are
                        not aiming for ten checkmarks. You are aiming for one contribution you can talk about for
                        fifteen minutes, and nine that made it possible.
                    </p>
                </div>
            </div>

            <PRWorkbook />
        </div>
    );
}
