"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { getNextEvent } from "@/lib/events-schedule";

export function ThisMonth() {
    const next = getNextEvent();
    if (!next) return null;

    return (
        <section className="py-16 relative">
            <div className="max-w-3xl mx-auto px-4">
                <Reveal>
                    <Link
                        href="/events"
                        className="flex flex-col sm:flex-row items-center gap-6 bg-neutral-900/50 border border-neutral-800 hover:border-cyan-400/40 rounded-2xl p-6 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-cyan-400" size={26} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold mb-1">
                                {next.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })} · {next.category}
                            </div>
                            <div className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {next.title}
                            </div>
                        </div>
                        <ArrowRight className="text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" size={20} />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
