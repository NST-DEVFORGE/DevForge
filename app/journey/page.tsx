"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { journeyChapters } from "@/data/journey";
import { YearChapter } from "@/components/year-chapter";

export default function JourneyPage() {
    const [activeYear, setActiveYear] = useState(journeyChapters[0].year);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const year = entry.target.getAttribute("data-year");
                        if (year) setActiveYear(year);
                    }
                });
            },
            { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
        );

        Object.values(sectionRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Map size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        The <span className="text-cyan-400">Journey</span>
                    </h1>
                    <p className="text-xl text-neutral-400">
                        Every year, in order. Documented years are backed by the data on this site — nothing here is a guess.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-[100px_1fr] gap-8">
                    {/* Sticky year marker — desktop only */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-32 flex flex-col gap-4">
                            {journeyChapters.map((c) => (
                                <a
                                    key={c.year}
                                    href={`#year-${c.year}`}
                                    className={`text-sm font-mono font-bold transition-colors ${
                                        activeYear === c.year ? "text-cyan-400" : "text-neutral-700 hover:text-neutral-500"
                                    }`}
                                >
                                    {c.year}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Mobile year scrubber */}
                    <div className="lg:hidden sticky top-20 z-20 -mx-4 px-4 py-3 bg-black/90 backdrop-blur-md border-b border-white/5 flex gap-2 overflow-x-auto">
                        {journeyChapters.map((c) => (
                            <a
                                key={c.year}
                                href={`#year-${c.year}`}
                                className={`flex-shrink-0 text-sm font-mono font-bold px-3 py-1.5 rounded-full border transition-colors ${
                                    activeYear === c.year
                                        ? "text-cyan-400 border-cyan-400/40 bg-cyan-400/10"
                                        : "text-neutral-500 border-neutral-800"
                                }`}
                            >
                                {c.year}
                            </a>
                        ))}
                    </div>

                    <div>
                        {journeyChapters.map((chapter) => (
                            <div key={chapter.year} id={`year-${chapter.year}`}>
                                <YearChapter
                                    chapter={chapter}
                                    ref={(el) => {
                                        sectionRefs.current[chapter.year] = el;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
