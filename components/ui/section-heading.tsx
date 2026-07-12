import { ReactNode } from "react";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
    eyebrow?: ReactNode;
    title: ReactNode;
    dek?: ReactNode;
    align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, dek, align = "center" }: SectionHeadingProps) {
    const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

    return (
        <Reveal className={`mb-16 ${alignClass}`}>
            {eyebrow && (
                <div className={`inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6`}>
                    {eyebrow}
                </div>
            )}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight text-balance">{title}</h2>
            {dek && <p className={`text-xl text-neutral-400 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{dek}</p>}
        </Reveal>
    );
}
