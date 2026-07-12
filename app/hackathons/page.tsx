"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Github, ExternalLink, Calendar, Users2, Code2 } from "lucide-react";
import { hackathonWinners } from "../../data/hackathons";

export default function HackathonsHallOfFame() {
    const [filterYear, setFilterYear] = useState("All");

    const filteredWinners = hackathonWinners.filter(winner => 
        filterYear === "All" || winner.year === filterYear
    );

    const getPositionColor = (position: string) => {
        switch(position) {
            case "1st Place": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
            case "2nd Place": return "text-neutral-300 bg-neutral-300/10 border-neutral-300/20";
            case "3rd Place": return "text-amber-600 bg-amber-600/10 border-amber-600/20";
            case "Finalist": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            default: return "text-purple-400 bg-purple-400/10 border-purple-400/20";
        }
    };

    const getPositionIcon = (position: string) => {
        switch(position) {
            case "1st Place": return <Trophy className="text-cyan-400" size={24} />;
            case "2nd Place": return <Medal className="text-neutral-300" size={24} />;
            case "3rd Place": return <Medal className="text-amber-600" size={24} />;
            case "Finalist": return <Star className="text-blue-400" size={24} />;
            default: return <Star className="text-purple-400" size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-cyan-400 selection:text-black pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-8 border border-cyan-400/20">
                        <Trophy size={40} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">Winners</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Celebrating the brilliant minds who turned caffeine and code into award-winning projects.
                    </p>
                </motion.div>

                {/* Filter */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-neutral-900 border border-neutral-800 rounded-2xl p-2 gap-2">
                        {["All", "2026", "2025"].map(year => (
                            <button
                                key={year}
                                onClick={() => setFilterYear(year)}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                    filterYear === year ? "bg-cyan-400 text-black shadow-[0_0_20px_rgb(var(--ac-400)/0.3)]" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Winners Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {filteredWinners.map((winner, i) => (
                        <motion.div
                            key={winner.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-[2rem] overflow-hidden group hover:border-cyan-400/50 transition-colors duration-500"
                        >
                            {/* Project Image */}
                            <div className="h-64 bg-neutral-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <div className="absolute top-4 left-4 z-20">
                                    <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 border backdrop-blur-md ${getPositionColor(winner.position)}`}>
                                        {getPositionIcon(winner.position)}
                                        {winner.position}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="px-4 py-2 rounded-full font-bold bg-black/50 backdrop-blur-md text-white border border-white/10 flex items-center gap-2">
                                        <Calendar size={16} /> {winner.year}
                                    </div>
                                </div>
                                <img src={winner.photoUrl} alt={winner.projectTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80' }} />
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-cyan-400 font-bold mb-1 tracking-wider uppercase text-sm">{winner.hackathonName}</div>
                                        <h2 className="text-3xl font-bold text-white">{winner.projectTitle}</h2>
                                    </div>
                                    <div className="flex gap-2">
                                        {winner.demoUrl && (
                                            <a href={winner.demoUrl} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors text-white">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                        <a href={winner.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors text-white">
                                            <Github size={20} />
                                        </a>
                                    </div>
                                </div>

                                <p className="text-neutral-400 mb-6 line-clamp-2">
                                    {winner.description}
                                </p>

                                <div className="mb-6 flex flex-wrap gap-2">
                                    {winner.technologies.map(tech => (
                                        <span key={tech} className="px-3 py-1 bg-black border border-neutral-800 rounded-full text-xs font-medium text-neutral-300 flex items-center gap-1">
                                            <Code2 size={12} /> {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-neutral-800/50">
                                    <div className="flex items-center gap-2 mb-3 text-neutral-300 font-medium">
                                        <Users2 size={18} className="text-cyan-400" />
                                        Team {winner.teamName}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {winner.members.map(member => (
                                            <div key={member.name} className="flex items-center bg-black border border-neutral-800 px-3.5 py-1.5 rounded-full">
                                                <span className="text-sm font-medium text-neutral-300">{member.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredWinners.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-neutral-500 text-xl">No hackathon winners found for this year.</p>
                    </div>
                )}


            </div>
        </div>
    );
}
