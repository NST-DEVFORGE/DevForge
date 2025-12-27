"use client";

import { motion } from "framer-motion";
import { Rocket, Users, Lightbulb, Trophy } from "lucide-react";

export function About() {
    const features = [
        {
            icon: Rocket,
            title: "Build Projects",
            description: "Work on real-world projects that make a difference"
        },
        {
            icon: Users,
            title: "Community",
            description: "Connect with like-minded developers and mentors"
        },
        {
            icon: Lightbulb,
            title: "Learn & Grow",
            description: "Workshops, hackathons, and hands-on experience"
        },
        {
            icon: Trophy,
            title: "Compete",
            description: "Participate in hackathons and coding competitions"
        }
    ];

    return (
        <section className="py-24 bg-black border-y border-white/5 relative overflow-hidden" id="about">
            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

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
                        What We <span className="text-orange-500">Do</span>
                    </h2>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        We're a community of passionate developers building the future, one line of code at a time.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="glass-panel p-6 hover:border-orange-500/30 transition-all group"
                            >
                                <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                    <Icon className="text-orange-500" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-neutral-400">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
