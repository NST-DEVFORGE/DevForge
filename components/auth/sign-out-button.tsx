"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function signOut() {
        setPending(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.replace("/");
            // Drops any cached server-rendered view of the member app.
            router.refresh();
        } finally {
            setPending(false);
        }
    }

    return (
        <button
            onClick={signOut}
            disabled={pending}
            className="inline-flex items-center gap-2 glass-subtle hover:border-cyan-400/40 rounded-full px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors disabled:opacity-50"
        >
            <LogOut size={15} />
            {pending ? "Signing out…" : "Sign out"}
        </button>
    );
}
