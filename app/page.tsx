"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BootAnimation } from "@/components/boot-animation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Events } from "@/components/events";
import { Projects } from "@/components/projects";
import { Team } from "@/components/team";
import { Footer } from "@/components/footer";

export default function Home() {
    const [showBoot, setShowBoot] = useState(true);

    return (
        <>
            <AnimatePresence>
                {showBoot && <BootAnimation onComplete={() => setShowBoot(false)} />}
            </AnimatePresence>

            <div className="bg-black text-white selection:bg-orange-500 selection:text-black">
                <Hero />
                <About />
                <Events />
                <Projects />
                <Team />
                <Footer />
            </div>
        </>
    );
}
