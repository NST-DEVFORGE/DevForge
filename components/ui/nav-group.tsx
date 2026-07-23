"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface NavGroupItem {
    name: string;
    href: string;
}

/**
 * A labelled run of links inside a dropdown. Omit `heading` for a group whose
 * items need no further sorting — it renders as a plain list.
 */
export interface NavGroupSection {
    heading?: string;
    items: NavGroupItem[];
}

interface NavGroupProps {
    label: string;
    sections: NavGroupSection[];
}

export function NavGroup({ label, sections }: NavGroupProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headingId = useId();
    const isActive = sections.some((section) => section.items.some((item) => item.href === pathname));

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
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
                    aria-label={label}
                    className="absolute top-full left-0 mt-1 min-w-[210px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden py-1 shadow-xl"
                >
                    {sections.map((section, i) => (
                        <div
                            key={section.heading ?? `section-${i}`}
                            role={section.heading ? "group" : undefined}
                            aria-labelledby={section.heading ? `${headingId}-${i}` : undefined}
                            className={i > 0 ? "mt-1 pt-1 border-t border-white/5" : undefined}
                        >
                            {section.heading && (
                                <div
                                    id={`${headingId}-${i}`}
                                    className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                                >
                                    {section.heading}
                                </div>
                            )}
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    role="menuitem"
                                    className={`block px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
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
                    ))}
                </div>
            )}
        </div>
    );
}
