"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export function Projects() {
    const projects = [
        {
            title: "DevForge Hackathon",
            description: "Our flagship 12-hour hackathon platform with live judging and real-time updates",
            tech: ["Next.js", "Firebase", "TailwindCSS"],
            link: "#",
            github: "#"
        },
        {
            title: "Club Dashboard",
            description: "Member management and event tracking system for the dev club",
            tech: ["React", "Node.js", "MongoDB"],
            link: "#",
            github: "#"
        },
        {
            title: "Code Collaborate",
            description: "Real-time collaborative coding platform for pair programming sessions",
            tech: ["TypeScript", "WebRTC", "Socket.io"],
            link: "#",
            github: "#"
        }
    ];

    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden" id="projects">
            {/* Matrix grid background */}
            <div className="absolute inset-0 matrix-grid pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Our <span className="text-orange-500">Projects</span>
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Check out what we've been building together.
                    </p>
                </motion.div>

                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-panel p-6 flex flex-col hover:border-orange-500/30 transition-all group"
                        >
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-neutral-400 mb-4 flex-1">
                                {project.description}
                            </p>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.map(tech => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded border border-orange-500/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-3">
                                <a
                                    href={project.link}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <ExternalLink size={16} />
                                    Demo
                                </a>
                                <a
                                    href={project.github}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Github size={16} />
                                    Code
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
