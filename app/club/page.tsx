import type { Metadata } from "next";
import { Github, Mail, Users2, Target, Compass, ShieldCheck } from "lucide-react";
import { council } from "@/data/council";
import { Reveal } from "@/components/ui/reveal";
import { Join } from "@/components/join";

export const metadata: Metadata = {
    title: "About & Governance",
    description:
        "DevForge is the official developer community of Newton School of Technology, Bengaluru, its vision, values, Executive Council, and how to join.",
};

const VALUES = [
    "Community First",
    "Learn by Building",
    "Collaboration over Competition",
    "Innovation",
    "Inclusivity",
    "Transparency",
    "Professionalism",
    "Accountability",
];

const MISSION = [
    "Build a collaborative technical community.",
    "Encourage project-based learning.",
    "Promote open-source contributions.",
    "Organize workshops, hackathons, and technical events.",
    "Connect students with industry professionals.",
    "Create leadership opportunities for members.",
];

const STEPS = [
    { n: "01", t: "Attend the orientation", d: "Meet the council and learn how DevForge works." },
    { n: "02", t: "Submit the membership form", d: "Just your USN, we pull the rest from the student portal." },
    { n: "03", t: "A quick chat", d: "An informal conversation about your interests and goals." },
    { n: "04", t: "Selection", d: "Reviewed on genuine interest and willingness to learn." },
    { n: "05", t: "Onboarding", d: "Get your credentials, join the channels, start building." },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero */}
                <Reveal className="text-center mb-24">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Users2 size={32} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        About <span className="text-cyan-400">DevForge</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        The official developer community of Newton School of Technology, Bengaluru -
                        building the next generation of developers, builders, and open-source
                        contributors.
                    </p>
                </Reveal>

                {/* Vision / Mission */}
                <div className="grid md:grid-cols-2 gap-4 mb-24">
                    <Reveal className="glass-strong rounded-3xl p-8">
                        <div className="inline-flex items-center gap-2 text-cyan-300 mb-4">
                            <Compass size={18} />
                            <h2 className="text-sm uppercase tracking-wider font-semibold">Vision</h2>
                        </div>
                        <p className="text-lg text-neutral-200 leading-relaxed">
                            To build one of India&rsquo;s strongest student developer communities by
                            empowering students to become exceptional engineers, open-source
                            contributors, entrepreneurs, and technology leaders.
                        </p>
                    </Reveal>
                    <Reveal className="glass-strong rounded-3xl p-8">
                        <div className="inline-flex items-center gap-2 text-cyan-300 mb-4">
                            <Target size={18} />
                            <h2 className="text-sm uppercase tracking-wider font-semibold">Mission</h2>
                        </div>
                        <ul className="space-y-2">
                            {MISSION.map((m) => (
                                <li key={m} className="flex items-start gap-2 text-sm text-neutral-300">
                                    <span className="text-cyan-400 mt-1">›</span>
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                {/* Values */}
                <Reveal className="mb-24 text-center">
                    <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-6">Core values</h2>
                    <div className="flex flex-wrap justify-center gap-2.5">
                        {VALUES.map((v) => (
                            <span key={v} className="glass-subtle rounded-full px-4 py-2 text-sm text-neutral-200">
                                {v}
                            </span>
                        ))}
                    </div>
                </Reveal>

                {/* Executive Council */}
                <Reveal className="mb-24">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-cyan-300 mb-3">
                            <ShieldCheck size={18} />
                            <h2 className="text-sm uppercase tracking-wider font-semibold">Executive Council</h2>
                        </div>
                        <p className="text-neutral-400">The office bearers steering DevForge.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {council.map((m) => (
                            <div key={m.usn} className="glass glass-hover rounded-2xl p-5 text-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://github.com/${m.github}.png`}
                                    alt={m.name}
                                    loading="lazy"
                                    className="rounded-full mx-auto mb-4 object-cover ring-2 ring-cyan-400/30 bg-white/5"
                                    style={{ width: 72, height: 72 }}
                                />
                                <p className="text-[11px] uppercase tracking-wider font-semibold text-cyan-300 mb-1">
                                    {m.position}
                                </p>
                                <h3 className="font-bold text-white">{m.name}</h3>
                                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{m.remit}</p>
                                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/5">
                                    <a
                                        href={`https://github.com/${m.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${m.name} on GitHub`}
                                        className="text-neutral-500 hover:text-cyan-300 transition-colors"
                                    >
                                        <Github size={16} />
                                    </a>
                                    <a
                                        href={`mailto:${m.email}`}
                                        aria-label={`Email ${m.name}`}
                                        className="text-neutral-500 hover:text-cyan-300 transition-colors"
                                    >
                                        <Mail size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>

                {/* Membership process */}
                <Reveal className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold tracking-tight mb-3">
                            How to <span className="text-cyan-400">join</span>
                        </h2>
                        <p className="text-neutral-400">
                            Open to every NST Bengaluru student, no experience required.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {STEPS.map((s) => (
                            <div key={s.n} className="glass rounded-2xl p-5">
                                <div className="text-2xl font-black font-mono text-cyan-400/70 mb-3">{s.n}</div>
                                <h3 className="font-bold text-white text-sm mb-1">{s.t}</h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">{s.d}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>

                <Join />
            </div>
        </div>
    );
}
