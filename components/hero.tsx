"use client";

import { motion } from "framer-motion";
import { GitMerge } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { TOTAL_MERGED_PRS, TOTAL_CONTRIBUTORS } from "@/lib/site-stats";

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f973161a_1px,transparent_1px),linear-gradient(to_bottom,#f973161a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                {/* Thesis line */}
                <motion.h1
                    className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500 text-balance"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    We don&apos;t just <span className="text-orange-500">learn</span> to code.
                    <br />
                    We <span className="text-orange-500">ship</span>.
                </motion.h1>

                {/* Live proof, not marketing copy */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex items-center justify-center gap-3 text-2xl md:text-3xl text-neutral-300"
                >
                    <GitMerge className="text-orange-500" size={28} />
                    <CountUp value={TOTAL_MERGED_PRS} delay={1.1} className="text-white font-bold" />
                    <span>PRs merged by</span>
                    <CountUp value={TOTAL_CONTRIBUTORS} delay={1.3} className="text-white font-bold" />
                    <span>contributors — DevForge, NST x SVYASA.</span>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                >
                    <a
                        href="https://forms.gle/M8rDS4wG1jyuGiSC6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-transform hover:scale-105"
                    >
                        <span className="relative z-10">Apply to Join DevForge</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a
                        href="/opensource"
                        className="px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 font-medium text-lg rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-colors backdrop-blur-sm"
                    >
                        See the record
                    </a>
                    <a
                        href="/events"
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
