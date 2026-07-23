"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

type Status = "unsupported" | "denied" | "off" | "on" | "working";

/**
 * VAPID keys travel as base64url; PushManager wants raw bytes. Returns an
 * ArrayBuffer rather than a Uint8Array — TypeScript's typed-array generic
 * doesn't satisfy BufferSource, which is what applicationServerKey expects.
 */
function urlBase64ToBuffer(base64: string): ArrayBuffer {
    const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const raw = atob(padded);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes.buffer;
}

export function PushToggle() {
    const [status, setStatus] = useState<Status>("working");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function detect(): Promise<Status> {
            if (typeof window === "undefined") return "working";
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
            if (Notification.permission === "denied") return "denied";
            const registration = await navigator.serviceWorker.ready;
            return (await registration.pushManager.getSubscription()) ? "on" : "off";
        }

        detect().then((next) => {
            if (active) setStatus(next);
        });
        return () => {
            active = false;
        };
    }, []);

    async function enable() {
        setStatus("working");
        setError(null);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                setStatus(permission === "denied" ? "denied" : "off");
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToBuffer(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
                ),
            });

            const response = await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(subscription.toJSON()),
            });
            if (!response.ok) throw new Error("save failed");

            setStatus("on");
        } catch {
            setError("Couldn't turn notifications on.");
            setStatus("off");
        }
    }

    async function disable() {
        setStatus("working");
        setError(null);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await fetch("/api/push/subscribe", {
                    method: "DELETE",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });
                await subscription.unsubscribe();
            }
            setStatus("off");
        } catch {
            setError("Couldn't turn notifications off.");
            setStatus("on");
        }
    }

    if (status === "unsupported") return null;

    if (status === "denied") {
        return (
            <p className="inline-flex items-center gap-2 text-xs text-neutral-500">
                <BellOff size={14} />
                Notifications are blocked in your browser settings.
            </p>
        );
    }

    const on = status === "on";
    return (
        <div>
            <button
                onClick={on ? disable : enable}
                disabled={status === "working"}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors disabled:opacity-50 ${
                    on
                        ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/25"
                        : "glass-subtle hover:border-cyan-400/40 text-neutral-300 hover:text-white"
                }`}
            >
                {on ? <BellRing size={15} /> : <Bell size={15} />}
                {status === "working" ? "…" : on ? "Notifications on" : "Turn on notifications"}
            </button>
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
    );
}
