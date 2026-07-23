"use client";

import { useEffect } from "react";

/**
 * Registers the service worker so the member app is installable. Registration
 * is deferred to the load event — it competes with hydration otherwise, and
 * nothing on first paint depends on it.
 */
export function ServiceWorkerRegistrar() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;
        if (process.env.NODE_ENV !== "production") return;

        const register = () => {
            navigator.serviceWorker.register("/sw.js").catch((error) => {
                console.warn("Service worker registration failed", error);
            });
        };

        if (document.readyState === "complete") register();
        else window.addEventListener("load", register, { once: true });

        return () => window.removeEventListener("load", register);
    }, []);

    return null;
}

/** Tells the worker to drop its caches. Called on sign-out. */
export function clearServiceWorkerCaches() {
    navigator.serviceWorker?.controller?.postMessage("SIGN_OUT");
}
