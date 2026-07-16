"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Github, Linkedin, Search } from "lucide-react";
import { members, memberStats } from "@/data/members";
import { Avatar } from "@/components/ui/avatar";

export default function MembersPage() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return members;
        return members.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.usn.includes(q) ||
                (m.github ?? "").toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Users size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        The <span className="text-cyan-400">Batch</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        The 2025 first batch — all {memberStats.total} of us. {memberStats.withGithub} on GitHub, {memberStats.withLinkedin} on LinkedIn.
                    </p>
                </motion.div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-10">
                    <div className="flex items-center gap-2 glass focus-within:border-cyan-400/50 rounded-xl px-4 py-3 transition-colors">
                        <Search size={18} className="text-neutral-500 flex-shrink-0" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, USN, or GitHub username…"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-neutral-600"
                            aria-label="Search members"
                        />
                    </div>
                    <p className="text-center text-xs text-neutral-600 mt-2">
                        Showing {filtered.length} of {memberStats.total}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map((member) => (
                        <div
                            key={member.usn}
                            className="flex items-center gap-3 glass hover:border-cyan-400/30 rounded-xl p-4 transition-colors"
                        >
                            <Avatar
                                github={member.github ?? undefined}
                                src={member.github ? undefined : "/placeholder-avatar.jpg"}
                                alt={member.name}
                                size={40}
                                className="border border-neutral-700"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white text-sm truncate">{member.name}</div>
                                <div className="text-[11px] text-neutral-600 font-mono">{member.usn}</div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                {member.github && (
                                    <a
                                        href={`https://github.com/${member.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${member.name} on GitHub`}
                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-400/20 flex items-center justify-center transition-colors text-neutral-400 hover:text-cyan-300"
                                    >
                                        <Github size={15} />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`${member.name} on LinkedIn`}
                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-sky-500/20 flex items-center justify-center transition-colors text-neutral-400 hover:text-sky-400"
                                    >
                                        <Linkedin size={15} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-neutral-500 py-12">No members match &ldquo;{query}&rdquo;.</p>
                )}
            </div>
        </div>
    );
}
