"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, Check } from "lucide-react";
import { themes, applyTheme, getStoredTheme } from "@/lib/themes";

export function ThemeSwitcher() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("aurora");
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActive(getStoredTheme());
    }, []);

    useEffect(() => {
        if (!open) return;
        const close = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const esc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("pointerdown", close);
        window.addEventListener("keydown", esc);
        return () => {
            window.removeEventListener("pointerdown", close);
            window.removeEventListener("keydown", esc);
        };
    }, [open]);

    const pick = (id: string) => {
        applyTheme(id);
        setActive(id);
        setOpen(false);
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Change theme"
                aria-expanded={open}
                aria-haspopup="menu"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            >
                <Palette size={16} />
            </button>

            {open && (
                <div
                    role="menu"
                    aria-label="Theme"
                    className="absolute right-0 top-full mt-2 w-48 max-h-[70vh] overflow-y-auto rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl py-1.5 shadow-2xl z-50"
                >
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            role="menuitemradio"
                            aria-checked={active === theme.id}
                            onClick={() => pick(theme.id)}
                            className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <span className="flex -space-x-1" aria-hidden>
                                <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ background: theme.swatch[0] }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ background: theme.swatch[1] }} />
                            </span>
                            <span className="flex-1 text-left">{theme.name}</span>
                            {active === theme.id && <Check size={14} className="text-cyan-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
