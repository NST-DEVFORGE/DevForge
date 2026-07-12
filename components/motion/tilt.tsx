"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface TiltProps {
    children: ReactNode;
    /** max tilt in degrees */
    max?: number;
    className?: string;
}

/** Slight 3D tilt following the cursor. */
export function Tilt({ children, max = 5, className }: TiltProps) {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const srx = useSpring(rx, { stiffness: 260, damping: 20 });
    const sry = useSpring(ry, { stiffness: 260, damping: 20 });

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const handleMove = (e: React.PointerEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
    };

    const reset = () => {
        rx.set(0);
        ry.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
            onPointerMove={handleMove}
            onPointerLeave={reset}
        >
            {children}
        </motion.div>
    );
}
