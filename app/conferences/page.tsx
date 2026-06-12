"use client";

import { motion } from "framer-motion";
import { Globe, GraduationCap, Calendar, MapPin, Users2, Award, ExternalLink, Mic } from "lucide-react";

export default function ConferencesPage() {
    const conferences = [
        {
            id: "conf-opensuse-2026",
            location: "Nuremberg, Germany",
            type: "International Conference",
            title: "openSUSE Conference 2026",
            description: "Representing Newton School of Technology on the global open-source stage. Members attended and delivered talks at openSUSE Conference 2026 — an open-source event focused on knowledge-sharing, collaboration and fostering innovation in open-source software.",
            dates: "June 25 – 27, 2026",
            organiser: "The Geeko Foundation",
            status: "Speakers",
            attendees: [
                {
                    name: "Geetansh Goyal",
                    role: "Club President · Speaker",
                    initials: "GG",
                    talkUrl: "https://events.opensuse.org/conferences/oSC26/program/proposals",
                },
                {
                    name: "Luvya Padmaj Rana",
                    role: "Tech Lead · Speaker",
                    initials: "LR",
                    talkUrl: "https://events.opensuse.org/conferences/oSC26/program/proposals",
                },
            ],
            highlights: [
                "Speaker Presentations",
                "Travel Grant Awarded",
                "Global Open-Source Community",
                "Geeko Foundation TSP",
            ],
        },
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
                        Celebrating our community members presenting research and collaborating on the global open-source stage.
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
                                {/* Left — main info */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <MapPin size={12} /> {conf.location}
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-neutral-300 flex items-center gap-1.5">
                                            <Calendar size={12} /> {conf.dates}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-sm text-orange-500 font-bold uppercase tracking-wider mb-1">{conf.type}</div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{conf.title}</h2>
                                        <p className="mt-1 text-sm text-neutral-500">Organised by {conf.organiser}</p>
                                    </div>

                                    <p className="text-neutral-400 text-lg leading-relaxed">
                                        {conf.description}
                                    </p>

                                    {/* Key Highlights */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                            <Award size={16} className="text-orange-500" /> Key Highlights
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {conf.highlights.map(highlight => (
                                                <span key={highlight} className="px-3.5 py-1.5 bg-black/60 border border-neutral-800 rounded-xl text-sm text-neutral-400">
                                                    {highlight}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right — presenters + talk links */}
                                <div className="space-y-6 md:border-l md:border-neutral-800/80 md:pl-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Users2 size={16} className="text-orange-500" /> Speakers
                                        </h3>
                                        <div className="space-y-3">
                                            {conf.attendees.map(attendee => (
                                                <div key={attendee.name} className="bg-black/40 border border-neutral-800/60 p-3.5 rounded-2xl space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold text-sm flex-shrink-0">
                                                            {attendee.initials}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-neutral-200 text-sm">{attendee.name}</div>
                                                            <div className="text-xs text-neutral-500 mt-0.5">{attendee.role}</div>
                                                        </div>
                                                    </div>
                                                    {/* Talk link */}
                                                    <a
                                                        href={attendee.talkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium group/link"
                                                    >
                                                        <Mic size={12} className="flex-shrink-0" />
                                                        <span>View Talk</span>
                                                        <ExternalLink size={10} className="opacity-60 group-hover/link:opacity-100 transition-opacity" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Geeko Foundation badge */}
                                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                                            <GraduationCap size={14} /> Travel Support
                                        </div>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            Travel supported by <span className="text-neutral-400 font-semibold">The Geeko Foundation</span> — Travel Support Programme (TSP). Recognising excellence in open-source contribution from Newton School of Technology.
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
