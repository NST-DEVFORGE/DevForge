"use client";

import { forwardRef } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { JourneyChapter } from "@/data/journey";

interface YearChapterProps {
    chapter: JourneyChapter;
}

export const YearChapter = forwardRef<HTMLElement, YearChapterProps>(({ chapter }, ref) => {
    const isTBD = chapter.status === "tbd";

    return (
        <section
            ref={ref}
            data-year={chapter.year}
            className="min-h-[70vh] flex items-center py-20 border-b border-white/5 last:border-b-0"
        >
            <div className="max-w-3xl">
                <Reveal>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-6xl md:text-7xl font-black text-white/90 font-mono tabular-nums">
                            {chapter.year}
                        </span>
                        {isTBD ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1">
                                <Clock size={12} /> Details TBD
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1">
                                <CheckCircle2 size={12} /> Documented
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{chapter.headline}</h2>
                    <p className="text-neutral-400 text-lg mb-6 max-w-2xl">{chapter.summary}</p>

                    {chapter.highlights.length > 0 && (
                        <ul className="space-y-2.5 mb-6">
                            {chapter.highlights.map((h) => (
                                <li key={h} className="flex items-start gap-3 text-neutral-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 flex-shrink-0" />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    )}

                    {chapter.stats && (
                        <div className="flex flex-wrap gap-4 mt-4">
                            {chapter.stats.map((s) => (
                                <div key={s.label} className="bg-neutral-900/50 border border-neutral-800 rounded-xl px-5 py-3">
                                    <div className="text-2xl font-bold text-white font-mono tabular-nums">{s.value}</div>
                                    <div className="text-xs text-neutral-500 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </Reveal>
            </div>
        </section>
    );
});

YearChapter.displayName = "YearChapter";
