import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { studentsData } from "@/data/students";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Avatar } from "@/components/ui/avatar";

export function StudentSpotlight() {
    const featured = studentsData.slice(0, 3);

    return (
        <section className="py-24 relative">
            <div className="max-w-6xl mx-auto px-4">
                <SectionHeading
                    title={<>Student <span className="text-cyan-400">Spotlight</span></>}
                    dek="In their own words — the path from first PR to real recognition."
                />

                <div className="grid md:grid-cols-3 gap-6">
                    {featured.map((student, i) => (
                        <Reveal key={student.slug} delay={i * 0.1}>
                            <Link
                                href={`/students/${student.slug}`}
                                className="block h-full bg-neutral-900/50 border border-neutral-800 hover:border-cyan-400/40 rounded-2xl p-6 transition-colors group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar
                                        github={student.githubUrl.split("/").pop()}
                                        alt={student.name}
                                        size={44}
                                        className="border border-neutral-700"
                                    />
                                    <div>
                                        <div className="font-bold text-white text-sm">{student.name}</div>
                                        <div className="text-xs text-cyan-300">{student.role}</div>
                                    </div>
                                </div>
                                <p className="text-neutral-400 text-sm leading-relaxed line-clamp-4">
                                    &ldquo;{student.journey}&rdquo;
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-300 group-hover:gap-2 transition-all">
                                    Read the full story <ArrowUpRight size={14} />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
