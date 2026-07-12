"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Rocket } from "lucide-react";
import { projects, allTechTags } from "@/data/projects";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

export default function ProjectsPage() {
    const [filter, setFilter] = useState<string>("all");

    const filtered = filter === "all" ? projects : projects.filter((p) => p.tech.includes(filter));

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Rocket size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        Our <span className="text-cyan-400">Projects</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Tools the club has actually built and shipped.
                    </p>
                </motion.div>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            filter === "all"
                                ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/40"
                                : "text-neutral-400 border-neutral-800 hover:border-neutral-700"
                        }`}
                    >
                        All
                    </button>
                    {allTechTags.map((tech) => (
                        <button
                            key={tech}
                            onClick={() => setFilter(tech)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                filter === tech
                                    ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/40"
                                    : "text-neutral-400 border-neutral-800 hover:border-neutral-700"
                            }`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((project, i) => (
                        <Reveal key={project.slug} delay={i * 0.1}>
                            <Card className="p-6 flex flex-col h-full">
                                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                                <p className="text-neutral-400 mb-4 flex-1">{project.tagline}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-cyan-400/10 text-cyan-300 text-xs font-medium rounded border border-cyan-400/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <ExternalLink size={16} /> Demo
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Github size={16} /> Code
                                        </a>
                                    )}
                                </div>
                            </Card>
                        </Reveal>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-neutral-500 py-12">No projects match that filter.</p>
                )}
            </div>
        </div>
    );
}
