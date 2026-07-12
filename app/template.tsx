"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Soft fade-rise on every route change. */
export default function Template({ children }: { children: ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) return <>{children}</>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
