"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticProps {
    children: ReactNode;
    /** how far the element leans toward the cursor, 0–1 */
    strength?: number;
    className?: string;
}

/** Element leans toward the cursor while hovered, springs back on leave. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const handleMove = (e: React.PointerEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`inline-block ${className ?? ""}`}
            style={{ x: sx, y: sy }}
            onPointerMove={handleMove}
            onPointerLeave={reset}
        >
            {children}
        </motion.div>
    );
}
