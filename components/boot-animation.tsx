"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function BootAnimation({ onComplete }: { onComplete: () => void }) {
    const [stage, setStage] = useState(0);
    const [displayText, setDisplayText] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const bootSequence = [
        "$ initializing devforge.sys...",
        "$ loading core modules...",
        "$ [████████████████████] 100%",
        "$ compiling creativity.ts...",
        "$ mounting innovation drive...",
        "$ starting developer engine...",
        "$ ✓ System Ready",
        "$ launching DevForge..."
    ];

    // Matrix rain effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "DEVFORGE01アイウエオカキクケコサシスセソタチツテト";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        let animationFrame: number;

        function draw() {
            if (!ctx || !canvas) return;

            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#f97316";
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationFrame = requestAnimationFrame(draw);
        }

        draw();

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    // Boot sequence
    useEffect(() => {
        if (stage < bootSequence.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => [...prev, bootSequence[stage]]);
                setStage(stage + 1);
            }, stage === 2 ? 800 : 400);
            return () => clearTimeout(timer);
        } else {
            const finalTimer = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(finalTimer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
        >
            {/* Matrix Rain Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 opacity-20"
            />

            {/* Glitch overlay */}
            <motion.div
                animate={{
                    opacity: [0, 0.1, 0, 0.15, 0],
                    x: [0, -5, 5, -5, 0],
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                }}
                className="absolute inset-0 bg-orange-500 mix-blend-screen"
            />

            {/* Main content */}
            <div className="relative z-10 max-w-3xl w-full px-6">
                {/* Animated DevForge Logo */}
                <motion.div
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-4">
                        <span className="text-orange-500">Dev</span>
                        <span className="text-white">Forge</span>
                    </h1>
                </motion.div>

                {/* Terminal output */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 font-mono text-sm md:text-base space-y-2"
                >
                    {displayText.map((text, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`${text.includes("✓")
                                ? "text-green-400 font-bold"
                                : text.includes("$")
                                    ? "text-orange-400"
                                    : "text-neutral-400"
                                }`}
                        >
                            {text}
                        </motion.div>
                    ))}
                    {stage < bootSequence.length && (
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-orange-500 text-xl"
                        >
                            ▊
                        </motion.span>
                    )}
                </motion.div>

                {/* Loading bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="mt-6 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full"
                />
            </div>
        </motion.div>
    );
}
