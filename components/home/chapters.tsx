"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tilt } from "@/components/motion/tilt";
import { journeyChapters } from "@/data/journey";

/** Magazine spread: each year is a numbered editorial entry, not a card grid. */
export function Chapters() {
    return (
        <section className="relative py-28 md:py-40 border-t border-white/5">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12">
                <div className="flex items-end justify-between mb-16 md:mb-24">
                    <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-neutral-500">02 — Chapters</p>
                    <Link href="/journey" className="font-mono text-xs tracking-widest uppercase text-cyan-400 hover:text-white transition-colors">
                        Full journey →
                    </Link>
                </div>

                <div className="space-y-24 md:space-y-32">
                    {journeyChapters.map((chapter, i) => (
                        <motion.article
                            key={chapter.year}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15% 0px" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={`grid md:grid-cols-12 gap-8 items-start ${i % 2 === 1 ? "md:text-right" : ""}`}
                        >
                            <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                                <Tilt max={3}>
                                    <span className="font-display italic text-[clamp(5rem,12vw,11rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(var(--ac-400))] select-none block">
                                        {chapter.year}
                                    </span>
                                </Tilt>
                            </div>
                            <div className={`md:col-span-7 md:pt-8 ${i % 2 === 1 ? "md:order-1 md:justify-self-end" : ""}`}>
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight text-balance">{chapter.headline}</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mb-6 md:inline-block">{chapter.summary}</p>
                                <ul className={`space-y-2 max-w-xl ${i % 2 === 1 ? "md:ml-auto" : ""}`}>
                                    {chapter.highlights.slice(0, 3).map((highlight) => (
                                        <li key={highlight} className="text-sm text-neutral-500 leading-relaxed">
                                            <span className="text-cyan-400 mr-2">—</span>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
