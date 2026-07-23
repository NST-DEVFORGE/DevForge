"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn } from "lucide-react";

/**
 * The one auth-aware element on the public site. Renders nothing until the
 * session is known, so signed-out visitors never see a "Dashboard" link flash.
 */
export function NavAuthLink() {
    const pathname = usePathname();
    const [signedIn, setSignedIn] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;
        fetch("/api/auth/me")
            .then((r) => active && setSignedIn(r.ok))
            .catch(() => active && setSignedIn(false));
        return () => {
            active = false;
        };
        // Re-checked on navigation so signing in or out updates the header.
    }, [pathname]);

    if (signedIn === null) return null;

    const { href, label, Icon } = signedIn
        ? { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard }
        : { href: "/login", label: "Sign in", Icon: LogIn };

    // Stays a bare icon until 2xl. The overflow that originally forced this is
    // gone — the nav is grouped into four dropdowns now and leaves ~270px spare
    // even at lg — so the label could safely appear earlier if that reads better.
    return (
        <Link
            href={href}
            aria-label={label}
            title={label}
            className="inline-flex items-center gap-1.5 p-2 2xl:px-4 2xl:py-2 glass-subtle hover:border-cyan-400/40 text-sm font-medium text-neutral-200 hover:text-white rounded-full transition-colors"
        >
            <Icon size={15} />
            <span className="hidden 2xl:inline">{label}</span>
        </Link>
    );
}
