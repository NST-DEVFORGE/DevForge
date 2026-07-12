"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Github, Linkedin, Twitter, ExternalLink, Code2, BookOpen, GitMerge, GitPullRequest, GitPullRequestDraft, Trophy, Quote } from "lucide-react";
import { studentsData } from "../../../data/students";
import prData from "../../../pr-data-report.json";
import { notFound } from "next/navigation";

export default function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    // Next.js 15 requires unwrapping params with React.use()
    const resolvedParams = use(params);
    const { slug } = resolvedParams;

    // Find rich data if available
    const richData = studentsData.find(s => s.slug === slug);
    
    // Find PR data based on github handle or name matching the slug
    const prStats = prData.members.find(m => 
        m.name.toLowerCase().split(' ')[0] === slug || 
        m.github.toLowerCase() === slug ||
        (richData && m.github === richData.githubUrl.split('/').pop())
    );

    if (!richData && !prStats) {
        return notFound();
    }

    const name = richData?.name || prStats?.name || "Unknown";
    const github = prStats?.github || richData?.githubUrl.split('/').pop() || "";
    const role = richData?.role || "Open Source Contributor";
    const photo = richData?.photo || (github ? `https://github.com/${github}.png` : "/placeholder.jpg");
    
    const allPRs = prStats?.allPRs || { merged: 0, open: 0, closed: 0 };
    const totalPRs = allPRs.merged + allPRs.open + allPRs.closed;

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-orange-500 selection:text-black">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/gssoc" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Hall of Fame</span>
                    </Link>
                </div>
            </nav>

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-orange-500/30"
                    >
                        <img src={photo} alt={name} className="w-full h-full object-cover" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        {name}
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 font-medium mb-8"
                    >
                        {role}
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex justify-center gap-4"
                    >
                        {github && (
                            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer" className="p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:border-orange-500 transition-all text-neutral-400 hover:text-orange-500">
                                <Github size={24} />
                            </a>
                        )}
                        {richData?.linkedinUrl && (
                            <a href={richData.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:border-blue-500 transition-all text-neutral-400 hover:text-blue-500">
                                <Linkedin size={24} />
                            </a>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* PR Stats Section */}
            <section className="py-12 border-y border-white/5 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-2xl font-bold mb-8 text-center">Open Source Contributions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 text-center">
                            <div className="text-4xl font-bold text-white mb-2">{totalPRs}</div>
                            <div className="text-neutral-500 text-sm font-medium uppercase tracking-wider">Total PRs</div>
                        </div>
                        <div className="bg-neutral-900 p-6 rounded-3xl border border-purple-500/20 text-center">
                            <GitMerge className="mx-auto text-purple-400 mb-2" size={24} />
                            <div className="text-3xl font-bold text-white mb-1">{allPRs.merged}</div>
                            <div className="text-purple-400/80 text-sm font-medium">Merged</div>
                        </div>
                        <div className="bg-neutral-900 p-6 rounded-3xl border border-green-500/20 text-center">
                            <GitPullRequest className="mx-auto text-green-400 mb-2" size={24} />
                            <div className="text-3xl font-bold text-white mb-1">{allPRs.open}</div>
                            <div className="text-green-400/80 text-sm font-medium">Open</div>
                        </div>
                        <div className="bg-neutral-900 p-6 rounded-3xl border border-red-500/20 text-center">
                            <GitPullRequestDraft className="mx-auto text-red-400 mb-2" size={24} />
                            <div className="text-3xl font-bold text-white mb-1">{allPRs.closed}</div>
                            <div className="text-red-400/80 text-sm font-medium">Closed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rich Content if available */}
            {richData && (
                <section className="py-24">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="grid gap-16">
                            
                            {/* Journey */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl">
                                        <Code2 size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold">The Journey</h2>
                                </div>
                                <div className="prose prose-invert prose-orange max-w-none bg-neutral-900/30 p-8 rounded-3xl border border-neutral-800/50">
                                    <p className="text-neutral-300 text-lg leading-relaxed">{richData.journey}</p>
                                </div>
                            </motion.div>

                            {/* Learnings */}
                            {richData.learnings.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                                            <BookOpen size={28} />
                                        </div>
                                        <h2 className="text-3xl font-bold">Key Learnings</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {richData.learnings.map((learning, i) => (
                                            <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-purple-500/50 transition-colors">
                                                <p className="text-neutral-300">{learning}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Milestones */}
                            {richData.milestones && richData.milestones.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl">
                                            <Trophy size={28} />
                                        </div>
                                        <h2 className="text-3xl font-bold">Proudest Milestones</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {richData.milestones.map((milestone, i) => (
                                            <li key={i} className="flex items-start gap-3 bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl hover:border-yellow-500/40 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0" />
                                                <p className="text-neutral-300">{milestone}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Advice to juniors */}
                            {richData.advice && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                                            <Quote size={28} />
                                        </div>
                                        <h2 className="text-3xl font-bold">Advice to Juniors</h2>
                                    </div>
                                    <blockquote className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-8 rounded-3xl">
                                        <p className="text-neutral-200 text-lg leading-relaxed italic">&ldquo;{richData.advice}&rdquo;</p>
                                        <footer className="mt-4 text-sm text-green-400 font-semibold not-italic">— {richData.name}</footer>
                                    </blockquote>
                                </motion.div>
                            )}

                            {/* Videos */}
                            {richData.videos && richData.videos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-3xl font-bold mb-8">Featured Interviews</h2>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {richData.videos.map((video, i) => (
                                            <div key={i} className="group relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center cursor-pointer hover:border-red-500/50 transition-colors">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                <div className="z-20 text-center px-4">
                                                    <div className="w-16 h-16 bg-red-600/90 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                                        <Play fill="currentColor" size={28} className="ml-1" />
                                                    </div>
                                                    <h3 className="text-white font-bold text-lg">{video.title}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                        </div>
                    </div>
                </section>
            )}
            
        </div>
    );
}
