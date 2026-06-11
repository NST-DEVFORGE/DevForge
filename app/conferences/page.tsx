"use client";

import { motion } from "framer-motion";
import { Globe, GraduationCap, Calendar, MapPin, Users2, Award } from "lucide-react";

export default function ConferencesPage() {
    const conferences = [
        {
            id: "conf-germany",
            location: "Germany",
            type: "International Conference",
            title: "Global Tech Summit & Presentation",
            description: "Representing DevForge and Newton School of Technology on the global stage. Presenting research and projects, and engaging with international developers and researchers.",
            year: "2026",
            status: "Presenters",
            attendees: [
                { name: "Geetansh Goyal", role: "Club President", initials: "GG" },
                { name: "Luvya Rana", role: "Tech Lead", initials: "LR" }
            ],
            highlights: [
                "Research Presentation",
                "Global Networking",
                "Advanced Tech Workshops"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16 selection:bg-orange-500 selection:text-black">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 text-orange-500 rounded-full mb-8 border border-orange-500/20 animate-pulse">
                        <Globe size={40} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        International <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Conferences</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Celebrating our community members presenting research and collaborating on the global stage.
                    </p>
                </motion.div>

                {/* Conferences Grid */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {conferences.map((conf, i) => (
                        <motion.div
                            key={conf.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 hover:border-orange-500/50 transition-colors duration-500 relative overflow-hidden group"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute -right-24 -top-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
                            
                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin size={12} /> {conf.location}
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1.5">
                                            <Calendar size={12} /> {conf.year}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-sm text-orange-500 font-bold uppercase tracking-wider mb-1">{conf.type}</div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{conf.title}</h2>
                                    </div>

                                    <p className="text-neutral-400 text-lg leading-relaxed">
                                        {conf.description}
                                    </p>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                            <Award size={16} className="text-orange-500" /> Key Highlights
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {conf.highlights.map(highlight => (
                                                <span key={highlight} className="px-3.5 py-1.5 bg-black border border-neutral-850 rounded-xl text-sm text-neutral-400">
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 md:border-l md:border-neutral-800/80 md:pl-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Users2 size={16} className="text-orange-500" /> Presenters
                                        </h3>
                                        <div className="space-y-3">
                                            {conf.attendees.map(attendee => (
                                                <div key={attendee.name} className="flex items-center gap-3 bg-black/40 border border-neutral-800/60 p-3.5 rounded-2xl">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-sm">
                                                        {attendee.initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-200 text-sm">{attendee.name}</div>
                                                        <div className="text-xs text-neutral-500 mt-0.5">{attendee.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                                            <GraduationCap size={14} /> Academic Impact
                                        </div>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            Representing the high academic standards and innovative research ecosystem of Newton School of Technology.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
