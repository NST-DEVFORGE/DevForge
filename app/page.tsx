"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BootAnimation } from "@/components/boot-animation";
import { Hero } from "@/components/hero";
import { ThisMonth } from "@/components/this-month";
import { OpenSource } from "@/components/open-source";
import { StudentSpotlight } from "@/components/student-spotlight";
import { Join } from "@/components/join";
import { useBootGate } from "@/lib/use-boot-gate";

export default function Home() {
    const { showBoot, dismiss } = useBootGate();

    return (
        <>
            <AnimatePresence>
                {showBoot && <BootAnimation onComplete={dismiss} />}
            </AnimatePresence>

            <div className="bg-transparent text-white selection:bg-orange-500 selection:text-black">
                <Hero />
                <ThisMonth />
                <OpenSource />
                <StudentSpotlight />
                <Join />
            </div>
        </>
    );
}

