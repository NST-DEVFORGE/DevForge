"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft rise on every route change.
 *
 * Deliberately transform-only — no opacity. This wrapper sits above every page,
 * and framer's entrance animation is driven by requestAnimationFrame, which the
 * browser pauses whenever the tab is backgrounded. An interrupted opacity tween
 * leaves the whole page stranded at partial opacity — the "washed out, can't
 * read it" state — until something forces a repaint. A stranded transform is at
 * most a few pixels off and invisible to the eye, so the content is always
 * legible even if the animation never finishes.
 */
export default function Template({ children }: { children: ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) return <>{children}</>;

    return (
        <motion.div
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
