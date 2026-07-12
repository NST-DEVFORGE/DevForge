"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Star, ExternalLink, GitMerge, Users, Code2, Zap } from "lucide-react";
import prData from "../pr-data-report.json";
import gssocSnapshot from "../data/gssoc-snapshot.json";
import { TOTAL_MERGED_PRS, TOTAL_PRS, TOTAL_CONTRIBUTORS } from "@/lib/site-stats";

// Build top GSSoC achievers sorted by rank (from real snapshot)
const topGSSoC = [...gssocSnapshot.members]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4);

// Build top contributors from real pr-data-report.json sorted by merged PRs
const topContributors = [...prData.members]
    .sort((a, b) => b.allPRs.merged - a.allPRs.merged)
    .slice(0, 4);

export function OpenSource() {
    return (
        <section className="py-24 relative overflow-hidden" id="opensource">
            {/* Premium blurred blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/8 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/8 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <Zap size={14} /> Open Source Impact
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Our Impact in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                            Open Source
                        </span>
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                        DevForge members actively contribute to global open source programs — GSSoC, GSoC, and beyond.
                    </p>
                </motion.div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-20 max-w-3xl mx-auto">
                    {[
                        { label: "Merged PRs", value: TOTAL_MERGED_PRS, icon: <GitMerge size={20} className="text-purple-400" /> },
                        { label: "Total PRs", value: TOTAL_PRS, icon: <Code2 size={20} className="text-cyan-300" /> },
                        { label: "Contributors", value: TOTAL_CONTRIBUTORS, icon: <Users size={20} className="text-blue-400" /> },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 text-center backdrop-blur-sm hover:border-cyan-400/30 transition-colors"
                        >
                            <div className="flex justify-center mb-2">{stat.icon}</div>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* GSSoC Achievers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <Trophy className="text-yellow-500" size={28} />
                        <h3 className="text-3xl font-bold text-white">GSSoC Achievers</h3>
                        <Link href="/gssoc" className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors ml-2 flex items-center gap-1">
                            View all <ExternalLink size={12} />
                        </Link>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {topGSSoC.map((member, i) => (
                            <motion.div
                                key={member.github}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link
                                    href={`https://gssoc.girlscript.tech/leaderboard`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 px-6 py-4 rounded-2xl hover:border-yellow-500/40 transition-colors group"
                                >
                                    <img
                                        src={`https://github.com/${member.github}.png`}
                                        alt={member.github}
                                        className="w-10 h-10 rounded-full object-cover border border-neutral-700 group-hover:border-yellow-500/50 transition-colors"
                                    />
                                    <div>
                                        <div className="font-bold text-white text-sm capitalize">{member.github.replace(/-/g, ' ')}</div>
                                        <div className="flex items-center gap-1">
                                            <Star className="text-yellow-500" size={12} fill="currentColor" />
                                            <span className="text-yellow-500 text-xs font-bold">Rank #{member.rank.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Hall of Fame */}
                <div>
                    <h3 className="text-3xl font-bold text-white text-center mb-12">
                        Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">Fame</span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topContributors.map((contributor, i) => (
                            <motion.div
                                key={contributor.github}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <a
                                    href={`https://github.com/${contributor.github}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block h-full bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-cyan-400 transition-colors relative z-10">
                                        <img
                                            src={`https://github.com/${contributor.github}.png`}
                                            alt={contributor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center relative z-10">
                                        <h4 className="text-lg font-bold text-white mb-1">{contributor.name}</h4>
                                        <p className="text-neutral-500 text-xs mb-3">@{contributor.github}</p>
                                        <div className="flex items-center justify-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm font-bold px-3 py-1.5 rounded-full">
                                            <GitMerge size={13} />
                                            {contributor.allPRs.merged} merged PRs
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/opensource" className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 rounded-full transition-colors">
                            View Full Open Source Dashboard <ExternalLink size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
