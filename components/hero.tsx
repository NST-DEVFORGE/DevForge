"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f973161a_1px,transparent_1px),linear-gradient(to_bottom,#f973161a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Floating icons */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-10 md:left-20 text-orange-500/20"
            >
                <Code2 size={64} />
            </motion.div>
            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-10 md:right-32 text-red-500/20"
            >
                <Terminal size={80} />
            </motion.div>
            <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 right-16 md:right-24 text-orange-400/20"
            >
                <Sparkles size={48} />
            </motion.div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                {/* Main heading */}
                <motion.h1
                    className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Dev<span className="text-orange-500">Forge</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    Where ideas are <span className="text-white font-semibold">forged into reality.</span>
                    <br />
                    Join the developer revolution at NST x SVYASA.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <a
                        href="#join"
                        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                    >
                        <span className="relative z-10">Join the Club</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                        href="#events"
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium text-lg rounded-xl border border-white/10 transition-colors backdrop-blur-sm"
                    >
                        View Events
                    </a>
                </motion.div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
