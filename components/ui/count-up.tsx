"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
    value: number;
    duration?: number;
    delay?: number;
    className?: string;
}

export function CountUp({ value, duration = 1.4, delay = 0, className }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const prefersReducedMotion = useReducedMotion();
    const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

    useEffect(() => {
        if (!isInView || prefersReducedMotion) return;

        let raf: number;
        const start = performance.now() + delay * 1000;

        const tick = (now: number) => {
            const elapsed = (now - start) / 1000;
            if (elapsed < 0) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isInView, value, duration, delay, prefersReducedMotion]);

    return (
        <span ref={ref} className={`font-mono tabular-nums ${className ?? ""}`}>
            {display.toLocaleString()}
        </span>
    );
}
