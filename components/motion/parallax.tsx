"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxProps {
    children: ReactNode;
    /** px of vertical drift over the element's full scroll journey */
    distance?: number;
    className?: string;
}

/** Subtle scroll parallax — the child drifts `distance`px slower than the page. */
export function Parallax({ children, distance = 60, className }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}
