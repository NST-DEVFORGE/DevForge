"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderGit2, Compass, CalendarCheck, Users, Trophy, ShieldCheck } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface NavLink {
    name: string;
    href: string;
    icon: React.ReactNode;
    /** Elevated-only links are hidden until the session role is known. */
    elevated?: boolean;
}

const LINKS: NavLink[] = [
    { name: "Overview", href: "/dashboard", icon: <LayoutGrid size={16} /> },
    { name: "Projects", href: "/dashboard/projects", icon: <FolderGit2 size={16} /> },
    { name: "Explore", href: "/dashboard/explore", icon: <Compass size={16} /> },
    { name: "Sessions", href: "/dashboard/events", icon: <CalendarCheck size={16} /> },
    { name: "Members", href: "/dashboard/members", icon: <Users size={16} /> },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: <Trophy size={16} /> },
    { name: "Admin", href: "/admin", icon: <ShieldCheck size={16} />, elevated: true },
];

/**
 * The member app's own top bar. Replaces the public marketing navbar once
 * signed in (that one hides itself on /dashboard and /admin), so members get
 * app navigation — Projects, Sessions, Members… — instead of Programs and a
 * "Join Us" button that makes no sense when you're already in.
 *
 * Role comes from /api/auth/me so this can drop into any member-app page
 * without threading props through server components; the Admin link simply
 * doesn't appear until the role is confirmed elevated.
 */
export function DashboardNav() {
    const pathname = usePathname();
    const [elevated, setElevated] = useState(false);

    useEffect(() => {
        let active = true;
        fetch("/api/auth/me")
            .then((r) => (r.ok ? r.json() : null))
            .then((body) => {
                if (active && body?.user) setElevated(["admin", "mentor"].includes(body.user.role));
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const links = LINKS.filter((link) => !link.elevated || elevated);

    function isActive(href: string) {
        // Exact match for Overview so every sub-route doesn't also light it up.
        return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 py-4">
            <div className="max-w-6xl mx-auto px-4">
                <div className="glass !rounded-2xl border border-white/10 px-3 py-2 flex items-center gap-2">
                    <Link href="/dashboard" className="flex items-center gap-2 group shrink-0 pl-1 pr-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/logo.png"
                            alt=""
                            className="w-8 h-8 object-contain [filter:hue-rotate(160deg)_saturate(1.2)]"
                        />
                        <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
                            Dev<span className="text-cyan-400">Forge</span>
                        </span>
                    </Link>

                    {/* Scrolls sideways on narrow screens rather than wrapping or hiding links. */}
                    <nav
                        aria-label="Member app"
                        className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 min-w-0"
                    >
                        {links.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        active
                                            ? "bg-cyan-400/15 text-cyan-300"
                                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 shrink-0 pl-1">
                        <ThemeSwitcher />
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
