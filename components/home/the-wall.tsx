"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import prData from "@/pr-data-report.json";

const top = [...prData.members]
    .sort((a, b) => b.allPRs.merged - a.allPRs.merged)
    .slice(0, 5);

/**
 * Masthead-style contributor index: oversized name rows, and the
 * contributor's GitHub avatar floats after the cursor over the hovered row.
 */
export function TheWall() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const x = useSpring(mx, { stiffness: 280, damping: 28 });
    const y = useSpring(my, { stiffness: 280, damping: 28 });

    const onMove = (e: React.PointerEvent) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left + 24);
        my.set(e.clientY - rect.top - 60);
    };

    return (
        <section className="relative py-28 md:py-40 border-t border-white/5">
            <div ref={sectionRef} onPointerMove={onMove} className="relative max-w-[90rem] mx-auto px-6 md:px-12">
                <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-16">03 — The wall</p>

                <div>
                    {top.map((member, i) => (
                        <motion.div
                            key={member.github}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10% 0px" }}
                            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <a
                                href={`https://github.com/${member.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onPointerEnter={() => setHovered(member.github)}
                                onPointerLeave={() => setHovered(null)}
                                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-10 py-6 md:py-8 border-b border-white/8 transition-colors hover:border-cyan-400/40"
                            >
                                <span className="font-mono text-xs md:text-sm text-neutral-600 tabular-nums w-8">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="text-[clamp(1.6rem,4.5vw,4rem)] font-bold tracking-tight text-neutral-300 group-hover:text-white group-hover:translate-x-2 md:group-hover:translate-x-4 transition-all duration-300 truncate">
                                    {member.name}
                                </span>
                                <span className="font-mono text-sm md:text-lg text-neutral-500 group-hover:text-cyan-400 transition-colors tabular-nums whitespace-nowrap">
                                    {member.allPRs.merged} merged
                                </span>
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* cursor-following avatar */}
                <motion.div
                    style={{ x, y }}
                    className={`pointer-events-none absolute top-0 left-0 z-10 transition-opacity duration-200 hidden md:block ${hovered ? "opacity-100" : "opacity-0"}`}
                    aria-hidden
                >
                    {hovered && (
                        <img
                            src={`https://github.com/${hovered}.png`}
                            alt=""
                            width={120}
                            height={120}
                            className="w-28 h-28 rounded-2xl object-cover rotate-3 shadow-2xl border border-white/10"
                        />
                    )}
                </motion.div>

                <Link
                    href="/opensource"
                    className="inline-block mt-10 font-mono text-xs tracking-widest uppercase text-cyan-400 hover:text-white transition-colors"
                >
                    Every contributor →
                </Link>
            </div>
        </section>
    );
}
