"use client";

import { ElementType, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface SplitTextProps {
    text: string;
    as?: ElementType;
    className?: string;
    /** seconds between each word's reveal */
    stagger?: number;
    delay?: number;
    once?: boolean;
}

/**
 * Editorial text reveal: each word rises out of its own overflow-hidden
 * line box, staggered. Visibility is observed on the container — the
 * translated words themselves are clipped, so observing them directly
 * would never fire (IntersectionObserver respects ancestor overflow).
 */
export function SplitText({ text, as: Tag = "span", className, stagger = 0.035, delay = 0, once = true }: SplitTextProps) {
    const prefersReducedMotion = useReducedMotion();
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once, amount: 0.3 });
    const words = useMemo(() => text.split(" "), [text]);

    if (prefersReducedMotion) {
        return <Tag className={className}>{text}</Tag>;
    }

    return (
        <Tag ref={ref} className={className} aria-label={text}>
            {words.map((word, i) => (
                <span key={i} aria-hidden>
                    <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                        <motion.span
                            className="inline-block will-change-transform"
                            initial={{ y: "110%" }}
                            animate={inView ? { y: "0%" } : { y: "110%" }}
                            transition={{ duration: 0.65, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {word}
                        </motion.span>
                    </span>
                    {i < words.length - 1 ? " " : ""}
                </span>
            ))}
        </Tag>
    );
}
