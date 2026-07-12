"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "devforge-boot-seen";

/** Shows the boot animation once per browser session, and never if the visitor prefers reduced motion. */
export function useBootGate() {
    const [showBoot, setShowBoot] = useState(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
        if (!prefersReducedMotion && !alreadySeen) {
            setShowBoot(true);
        }
    }, []);

    const dismiss = () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setShowBoot(false);
    };

    return { showBoot, dismiss };
}
