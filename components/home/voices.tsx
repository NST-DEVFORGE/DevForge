"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SplitText } from "@/components/motion/split-text";
import { studentsData } from "@/data/students";

const abhijit = studentsData.find((s) => s.slug === "abhijit");

/** One full-bleed editorial pull quote — a real member's words, not a testimonial grid. */
export function Voices() {
    if (!abhijit) return null;

    return (
        <section className="relative py-32 md:py-48 border-t border-white/5 overflow-hidden">
            <span
                className="absolute -top-10 left-4 md:left-10 font-display italic text-[16rem] md:text-[26rem] leading-none text-white/[0.035] select-none pointer-events-none"
                aria-hidden
            >
                &ldquo;
            </span>

            <div className="relative max-w-5xl mx-auto px-6 md:px-12">
                <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-12">04 — Voices</p>

                <blockquote>
                    <SplitText
                        text="Don't compare your beginning with someone else's years of experience. Every small project, bug fix, and contribution adds up."
                        as="p"
                        className="font-display italic text-[clamp(1.8rem,4.5vw,3.8rem)] leading-[1.15] text-white text-balance"
                        stagger={0.02}
                    />
                    <motion.footer
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-10 flex items-center gap-4"
                    >
                        <img
                            src={abhijit.photo}
                            alt={abhijit.name}
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-full object-cover border border-white/10"
                            loading="lazy"
                        />
                        <div>
                            <Link href={`/students/${abhijit.slug}`} className="text-white font-semibold hover:text-cyan-400 transition-colors">
                                {abhijit.name}
                            </Link>
                            <p className="font-mono text-xs text-neutral-500 mt-0.5">first batch, from his journey form</p>
                        </div>
                    </motion.footer>
                </blockquote>
            </div>
        </section>
    );
}
