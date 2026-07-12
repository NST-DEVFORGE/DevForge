"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { TOTAL_MERGED_PRS, TOTAL_CONTRIBUTORS } from "@/lib/site-stats";

const ParticleField = dynamic(() => import("@/components/three/particle-field"), { ssr: false });

export function HeroEditorial() {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
            {!prefersReducedMotion && <ParticleField />}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--g1)] pointer-events-none" />

            <div className="relative z-10 max-w-[90rem] mx-auto w-full px-6 md:px-12 pb-16 md:pb-24 pt-40">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-mono text-[11px] md:text-xs tracking-[0.25em] uppercase text-neutral-500 mb-8 md:mb-12"
                >
                    Dev Club — NST <span className="text-cyan-400">×</span> SVYASA, est. 2025
                </motion.p>

                <h1 className="leading-[0.95] tracking-tight">
                    <SplitText
                        text="We don't just learn to code."
                        as="span"
                        className="block text-[clamp(2.6rem,7.5vw,7rem)] font-extrabold text-white"
                        stagger={0.045}
                        delay={0.35}
                    />
                    <SplitText
                        text="We ship."
                        as="span"
                        className="block font-display italic text-[clamp(4rem,13vw,12rem)] text-cyan-400 mt-1"
                        stagger={0.09}
                        delay={0.75}
                    />
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.35 }}
                    className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <p className="font-mono text-sm text-neutral-400 max-w-sm leading-relaxed">
                        {TOTAL_MERGED_PRS} pull requests merged into public repositories by {TOTAL_CONTRIBUTORS} students. Every number on this site links to its source.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Magnetic>
                            <a
                                href="https://forms.gle/M8rDS4wG1jyuGiSC6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center whitespace-nowrap px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-cyan-400 transition-colors duration-300"
                            >
                                Apply to join
                            </a>
                        </Magnetic>
                        <Magnetic strength={0.2}>
                            <Link
                                href="/opensource"
                                className="inline-flex items-center whitespace-nowrap px-8 py-4 border border-white/15 text-white font-medium rounded-full hover:border-cyan-400/60 hover:text-cyan-400 transition-colors duration-300"
                            >
                                See the record
                            </Link>
                        </Magnetic>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
