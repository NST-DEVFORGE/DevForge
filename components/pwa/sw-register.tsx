"use client";

import { useEffect } from "react";
import type { BeforeInstallPromptEvent, WindowWithInstall } from "./install-types";

/**
 * Registers the service worker so the member app is installable. Registration
 * is deferred to the load event — it competes with hydration otherwise, and
 * nothing on first paint depends on it.
 */
export function ServiceWorkerRegistrar() {
    useEffect(() => {
        // Capture the install prompt as early as possible — the event fires once
        // and is easily missed if a button mounts later. Stash it globally and
        // announce it so InstallButton can pick it up whenever it renders.
        const onBeforeInstall = (event: Event) => {
            event.preventDefault();
            (window as WindowWithInstall).__deferredInstallPrompt = event as BeforeInstallPromptEvent;
            window.dispatchEvent(new Event("pwa-installable"));
        };
        window.addEventListener("beforeinstallprompt", onBeforeInstall);

        if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
            return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        }

        const register = () => {
            navigator.serviceWorker.register("/sw.js").catch((error) => {
                console.warn("Service worker registration failed", error);
            });
        };

        if (document.readyState === "complete") register();
        else window.addEventListener("load", register, { once: true });

        return () => {
            window.removeEventListener("load", register);
            window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        };
    }, []);

    return null;
}

/** Tells the worker to drop its caches. Called on sign-out. */
export function clearServiceWorkerCaches() {
    navigator.serviceWorker?.controller?.postMessage("SIGN_OUT");
}
