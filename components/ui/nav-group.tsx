"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavGroupItem {
    name: string;
    href: string;
}

interface NavGroupProps {
    label: string;
    items: NavGroupItem[];
}

export function NavGroup({ label, items }: NavGroupProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isActive = items.some((item) => item.href === pathname);

    const openNow = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
    };
    const closeSoon = () => {
        closeTimer.current = setTimeout(() => setOpen(false), 120);
    };

    return (
        <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
            <button
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? "bg-cyan-400/10 text-cyan-400" : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen((v) => !v)}
            >
                {label}
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute top-full left-0 mt-1 min-w-[180px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden py-1 shadow-xl"
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                                pathname === item.href
                                    ? "bg-cyan-400/10 text-cyan-400"
                                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                            }`}
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
