"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BootAnimation } from "@/components/boot-animation";
import { Hero } from "@/components/hero";
import { OpenSource } from "@/components/open-source";

export default function Home() {
    const [showBoot, setShowBoot] = useState(true);

    return (
        <>
            <AnimatePresence>
                {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
            </AnimatePresence>

            <div className="bg-transparent text-white selection:bg-orange-500 selection:text-black">
                <Hero />
                <OpenSource />
            </div>
        </>
    );
}

