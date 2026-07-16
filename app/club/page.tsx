"use client";

import { motion } from "framer-motion";
import { Users2, Github, Linkedin } from "lucide-react";
import { clubLeadership } from "../../data/club-info";
import { Join } from "@/components/join";

export default function DeveloperClub() {
    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-cyan-400 selection:text-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 text-purple-500 rounded-full mb-8 border border-purple-500/20">
                        <Users2 size={32} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Club</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Meet the team driving the community forward.
                    </p>
                </motion.div>

                {/* Leadership Team */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-32"
                >
                    <h2 className="text-4xl font-bold mb-12 text-center">Current Leadership</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {clubLeadership.map((leader, i) => (
                            <div key={i} className="w-full md:w-80 group relative glass rounded-3xl p-6 text-center hover:border-purple-500/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                                
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-neutral-800 group-hover:border-purple-500/50 transition-colors">
                                    <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover bg-neutral-800" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop' }} />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-2">{leader.name}</h3>
                                <p className="text-purple-400 font-medium mb-6">{leader.role}</p>
                                
                                <div className="flex justify-center gap-4 relative z-10">
                                    <a href={leader.github} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                                        <Github size={20} />
                                    </a>
                                    <a href={leader.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-blue-500 transition-colors">
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

            </div>

            <Join />
        </div>
    );
}
