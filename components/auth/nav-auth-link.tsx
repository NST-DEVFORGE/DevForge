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

    // Icon-only on small screens, labelled from lg up. It was icon-only until
    // 2xl while the header overflowed its row; grouping the nav into dropdowns
    // freed ~270px, so the label fits from the breakpoint the full nav appears.
    return (
        <Link
            href={href}
            aria-label={label}
            title={label}
            className="inline-flex items-center gap-1.5 p-2 lg:px-4 lg:py-2 glass-subtle hover:border-cyan-400/40 text-sm font-medium text-neutral-200 hover:text-white rounded-full transition-colors"
        >
            <Icon size={15} />
            <span className="hidden lg:inline">{label}</span>
        </Link>
    );
}
