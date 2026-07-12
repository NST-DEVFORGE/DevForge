"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "devforge-learn-progress";

export function useLearnProgress() {
    const [done, setDone] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setDone(new Set(JSON.parse(raw)));
        } catch {
            // ignore malformed storage
        }
        setHydrated(true);
    }, []);

    const toggle = (nodeId: string) => {
        setDone((prev) => {
            const next = new Set(prev);
            if (next.has(nodeId)) next.delete(nodeId);
            else next.add(nodeId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
            return next;
        });
    };

    return { done, toggle, hydrated };
}
