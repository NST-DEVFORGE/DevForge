"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { getNextEvent, ScheduledEvent } from "@/lib/events-schedule";

/** Closing spread: live next-session line, then the invitation. */
export function Closing() {
    const [next, setNext] = useState<ScheduledEvent | null>(null);

    // date-dependent → client-only to keep SSR deterministic
    useEffect(() => {
        setNext(getNextEvent());
    }, []);

    return (
        <section className="relative py-32 md:py-48 border-t border-white/5">
            <div className="max-w-[90rem] mx-auto px-6 md:px-12">
                {next && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 md:mb-24"
                    >
                        <Link
                            href="/events"
                            className="group flex items-baseline gap-4 font-mono text-xs md:text-sm text-neutral-500 border-b border-white/8 pb-5 hover:text-neutral-300 transition-colors"
                        >
                            <span className="text-cyan-400 tracking-[0.25em] uppercase">Next</span>
                            <span className="flex-1 truncate">
                                {next.title} — {next.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}, {next.time}
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform text-cyan-400">→</span>
                        </Link>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-12 gap-10 items-end">
                    <div className="md:col-span-8">
                        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-6">05 — Your move</p>
                        <SplitText
                            text="Build"
                            as="span"
                            className="block text-[clamp(3.5rem,11vw,10rem)] font-extrabold leading-[0.95] tracking-tight text-white"
                        />
                        <SplitText
                            text="with us."
                            as="span"
                            className="block font-display italic text-[clamp(3.5rem,11vw,10rem)] leading-[0.95] text-cyan-400"
                            delay={0.15}
                        />
                    </div>
                    <div className="md:col-span-4 pb-4">
                        <p className="text-neutral-400 leading-relaxed mb-8 max-w-xs">
                            One batch so far. Weekly sessions, monthly hackathons, and a record that grows one merged PR at a time.
                        </p>
                        <Magnetic>
                            <a
                                href="https://forms.gle/kBYengUpz5D7WHSz9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center whitespace-nowrap px-9 py-4 bg-cyan-400 text-black font-semibold rounded-full hover:bg-white transition-colors duration-300"
                            >
                                Apply to join
                            </a>
                        </Magnetic>
                    </div>
                </div>
            </div>
        </section>
    );
}
