"use client";

import { useEffect, useState } from "react";
import { Download, Share, Check } from "lucide-react";
import type { BeforeInstallPromptEvent, WindowWithInstall } from "./install-types";

type Mode = "hidden" | "installable" | "ios" | "installed";

function isStandalone(): boolean {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari exposes standalone on navigator instead of matchMedia.
        (window.navigator as { standalone?: boolean }).standalone === true
    );
}

function isIos(): boolean {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/**
 * In-app install control. Chromium fires beforeinstallprompt (captured early in
 * ServiceWorkerRegistrar); this reads it and calls prompt() on click. iOS Safari
 * has no such API, so it shows Add-to-Home-Screen instructions instead. Renders
 * nothing when already installed or when the browser can't install.
 */
export function InstallButton() {
    const [mode, setMode] = useState<Mode>("hidden");
    const [iosHintOpen, setIosHintOpen] = useState(false);

    useEffect(() => {
        let active = true;

        // Deferred off the synchronous effect body, and it reads window anyway.
        Promise.resolve().then(() => {
            if (!active) return;
            if (isStandalone()) return setMode("installed");
            const win = window as WindowWithInstall;
            if (win.__deferredInstallPrompt) setMode("installable");
            else if (isIos()) setMode("ios");
        });

        const onInstallable = () => setMode("installable");
        const onInstalled = () => setMode("installed");
        window.addEventListener("pwa-installable", onInstallable);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
            active = false;
            window.removeEventListener("pwa-installable", onInstallable);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    async function install() {
        const win = window as WindowWithInstall;
        const event: BeforeInstallPromptEvent | undefined = win.__deferredInstallPrompt;
        if (!event) return;
        await event.prompt();
        const { outcome } = await event.userChoice;
        if (outcome === "accepted") setMode("installed");
        // The prompt can't be reused once consumed.
        win.__deferredInstallPrompt = undefined;
    }

    if (mode === "hidden") return null;

    if (mode === "installed") {
        return (
            <span className="inline-flex items-center gap-2 text-sm text-cyan-300">
                <Check size={15} /> Installed
            </span>
        );
    }

    if (mode === "ios") {
        return (
            <div>
                <button
                    onClick={() => setIosHintOpen((v) => !v)}
                    className="inline-flex items-center gap-2 glass-subtle hover:border-cyan-400/40 text-neutral-200 hover:text-white text-sm rounded-full px-4 py-2 transition-colors"
                >
                    <Download size={15} /> Install app
                </button>
                {iosHintOpen && (
                    <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1.5 leading-relaxed max-w-xs">
                        <Share size={13} className="flex-shrink-0" />
                        Tap the Share button, then <strong className="text-neutral-300">Add to Home Screen</strong>.
                    </p>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={install}
            className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm rounded-full px-4 py-2 transition-colors"
        >
            <Download size={15} /> Install app
        </button>
    );
}
