"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    once?: boolean;
    className?: string;
}

export function Reveal({ children, delay = 0, y = 20, once = true, className }: RevealProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
