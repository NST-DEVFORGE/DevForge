"use client";

import { motion } from "framer-motion";
import { Calendar, Code, Presentation, Users2 } from "lucide-react";

export function Events() {
    const events = [
        {
            icon: Calendar,
            title: "CodeDay Bengaluru x DevForge",
            description: "12-hour hackathon in collaboration with CodeDay! Build, learn, and compete.",
            frequency: "21st Feb 2026",
            isUpcoming: true
        },
        {
            icon: Code,
            title: "Weekly Coding Sessions",
            description: "Collaborative coding sessions every week",
            frequency: "Every Friday"
        },
        {
            icon: Presentation,
            title: "Tech Talks",
            description: "Learn from industry experts and mentors",
            frequency: "Monthly"
        },
        {
            icon: Calendar,
            title: "Hackathons",
            description: "Build amazing projects in 12-48 hours",
            frequency: "Quarterly"
        },
        {
            icon: Users2,
            title: "Workshops",
            description: "Hands-on workshops on latest technologies",
            frequency: "Monthly"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-black via-neutral-950 to-black" id="events">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Events & <span className="text-orange-500">Activities</span>
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Regular events designed to help you learn, network, and build.
                    </p>
                </motion.div>

                {/* Events grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event, index) => {
                        const Icon = event.icon;
                        const isUpcoming = 'isUpcoming' in event && event.isUpcoming;
                        return (
                            <motion.div
                                key={event.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`p-8 transition-all group rounded-2xl ${isUpcoming
                                        ? 'md:col-span-2 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.4)]'
                                        : 'glow-border hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                                    }`}
                            >
                                {isUpcoming && (
                                    <div className="flex justify-center mb-4">
                                        <span className="px-4 py-1 bg-orange-500 text-white text-sm font-bold rounded-full animate-pulse">
                                            🎉 UPCOMING EVENT
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${isUpcoming
                                            ? 'bg-gradient-to-br from-orange-500 to-purple-600'
                                            : 'bg-gradient-to-br from-orange-500 to-red-600'
                                        }`}>
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-white mb-2 ${isUpcoming ? 'text-3xl' : 'text-2xl'}`}>{event.title}</h3>
                                        <p className="text-neutral-400 mb-3">{event.description}</p>
                                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${isUpcoming
                                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                            }`}>
                                            {event.frequency}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
