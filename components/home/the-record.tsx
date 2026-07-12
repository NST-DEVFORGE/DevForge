"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Parallax } from "@/components/motion/parallax";
import { SplitText } from "@/components/motion/split-text";
import { TOTAL_MERGED_PRS, TOTAL_PRS, TOTAL_CONTRIBUTORS } from "@/lib/site-stats";

const sideFacts = [
    { value: String(TOTAL_PRS), label: "pull requests opened, total" },
    { value: String(TOTAL_CONTRIBUTORS), label: "students contributing" },
    { value: "8", label: "open-source organizations" },
    { value: "60+", label: "PRs into repos with 100+ stars" },
];

/** Editorial numbers spread — one oversized figure, annotated like a print layout. No cards. */
export function TheRecord() {
    return (
        <section className="relative py-28 md:py-44 border-t border-white/5">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12">
                <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">01 — The record</p>

                <div className="grid md:grid-cols-12 gap-10 items-start">
                    <div className="md:col-span-8">
                        <Parallax distance={40}>
                            <div className="flex items-baseline gap-4 flex-wrap">
                                <span className="font-display italic text-[clamp(6rem,18vw,17rem)] leading-none text-white tabular-nums select-none">
                                    {TOTAL_MERGED_PRS}
                                </span>
                                <span className="font-mono text-sm md:text-base text-cyan-400 tracking-wide -translate-y-4 md:-translate-y-8">
                                    merged ↗
                                </span>
                            </div>
                        </Parallax>
                        <SplitText
                            text="Pull requests merged into public repositories since the club was founded — GSSoC, ESoC, and independent contributions, counted from the GitHub API, not a slide deck."
                            as="p"
                            className="mt-6 text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed"
                        />
                    </div>

                    <div className="md:col-span-4 md:pt-16">
                        {sideFacts.map((fact, i) => (
                            <motion.div
                                key={fact.label}
                                initial={{ opacity: 0, x: 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-10% 0px" }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="py-5 border-b border-white/8 flex items-baseline justify-between gap-6"
                            >
                                <span className="font-mono text-3xl md:text-4xl text-white tabular-nums">{fact.value}</span>
                                <span className="text-sm text-neutral-500 text-right">{fact.label}</span>
                            </motion.div>
                        ))}
                        <Link
                            href="/pr-stats"
                            className="inline-block mt-6 font-mono text-xs tracking-widest uppercase text-cyan-400 hover:text-white transition-colors"
                        >
                            Full ledger →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
