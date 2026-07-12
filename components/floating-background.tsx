"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Code2, Terminal, Cpu, Braces, GitBranch, Flame } from "lucide-react";

const ICONS = [
    { Icon: Code2, x: "15%", y: "15%", size: 80, delay: 0, duration: 10 },
    { Icon: Braces, x: "80%", y: "20%", size: 120, delay: 1, duration: 14 },
    { Icon: Terminal, x: "10%", y: "55%", size: 90, delay: 2, duration: 12 },
    { Icon: Cpu, x: "75%", y: "65%", size: 110, delay: 3, duration: 16 },
    { Icon: GitBranch, x: "45%", y: "80%", size: 70, delay: 1.5, duration: 11 },
    { Icon: Flame, x: "55%", y: "10%", size: 60, delay: 0.5, duration: 13 },
];

// Routes dense with their own animated cards/charts — keep ambient decoration minimal here
// so it isn't competing with 20-40 already-animating elements on the page.
const DATA_DENSE_ROUTES = ["/pr-stats", "/quality-prs", "/gsoc", "/gssoc", "/opensource", "/esoc", "/events"];

export function FloatingBackground() {
    const [mounted, setMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const pathname = usePathname();
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const isDataDense = DATA_DENSE_ROUTES.some((r) => pathname?.startsWith(r));
    const icons = isDataDense ? ICONS.slice(0, 2) : ICONS;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Rich multi-layer gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.08),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(245,158,11,0.05),transparent)]" />
            {!isDataDense && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_60%,rgba(249,115,22,0.03),transparent)]" />
            )}
            <div className="absolute inset-0 bg-black/90" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(249,115,22,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(249,115,22,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {prefersReducedMotion ? (
                // Static equivalent: same warmth, no perpetual animation
                <>
                    <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-orange-500 rounded-full blur-[120px] opacity-[0.08]" />
                    {!isDataDense && (
                        <div className="absolute top-2/3 right-1/5 w-96 h-96 bg-amber-500 rounded-full blur-[130px] opacity-[0.05]" />
                    )}
                </>
            ) : (
                <>
                    {/* Animated floating orbs */}
                    <motion.div
                        animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/5 w-80 h-80 bg-orange-500 rounded-full blur-[120px]"
                    />
                    {!isDataDense && (
                        <>
                            <motion.div
                                animate={{ y: [0, 70, 0], x: [0, -40, 0], scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                                className="absolute top-2/3 right-1/5 w-96 h-96 bg-amber-500 rounded-full blur-[130px]"
                            />
                            <motion.div
                                animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.03, 0.08, 0.03] }}
                                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[160px]"
                            />
                        </>
                    )}

                    {/* Floating dev icons */}
                    {icons.map(({ Icon, x, y, size, delay, duration }, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, i % 2 === 0 ? -25 : 25, 0], rotate: [0, i % 2 === 0 ? 8 : -8, 0], opacity: [0.04, 0.1, 0.04] }}
                            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
                            className="absolute text-orange-500"
                            style={{ left: x, top: y }}
                        >
                            <Icon size={size} strokeWidth={0.8} />
                        </motion.div>
                    ))}

                    {!isDataDense && (
                        <>
                            {/* Large floating "DevForge" text */}
                            <motion.div
                                animate={{ y: [0, -40, 0], x: [0, 25, 0], opacity: [0.025, 0.055, 0.025] }}
                                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[28%] left-[5%] select-none whitespace-nowrap tracking-tighter pointer-events-none"
                                style={{ fontSize: 'clamp(5rem, 12vw, 14rem)', fontWeight: 900, WebkitTextStroke: '2px rgba(249, 115, 22, 0.25)', color: 'transparent' }}
                            >
                                DevForge
                            </motion.div>

                            {/* Large floating "Dev Club" text */}
                            <motion.div
                                animate={{ y: [0, 50, 0], x: [0, -30, 0], opacity: [0.02, 0.045, 0.02] }}
                                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 7 }}
                                className="absolute bottom-[12%] right-[-2%] select-none whitespace-nowrap tracking-tighter pointer-events-none"
                                style={{ fontSize: 'clamp(4rem, 10vw, 12rem)', fontWeight: 900, WebkitTextStroke: '2px rgba(245, 158, 11, 0.2)', color: 'transparent' }}
                            >
                                Dev Club
                            </motion.div>
                        </>
                    )}
                </>
            )}

            {/* Subtle noise texture vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
}
