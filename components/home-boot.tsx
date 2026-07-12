"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { BootAnimation } from "@/components/boot-animation";
import { useBootGate } from "@/lib/use-boot-gate";

export function HomeBoot({ children }: { children: ReactNode }) {
    const { showBoot, dismiss } = useBootGate();

    return (
        <>
            <AnimatePresence>{showBoot && <BootAnimation onComplete={dismiss} />}</AnimatePresence>
            {children}
        </>
    );
}
