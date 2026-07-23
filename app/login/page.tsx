"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { AuthError, AuthField, AuthSubmit } from "@/components/auth/auth-field";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    // Only same-origin paths, so ?next= can't be used to bounce someone off-site.
    const rawNext = params.get("next") ?? "/dashboard";
    const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    username: form.get("username"),
                    password: form.get("password"),
                }),
            });
            const body = await response.json();

            if (!response.ok) {
                setError(body.message ?? "Something went wrong. Try again.");
                return;
            }
            router.replace(body.mustChangePassword ? "/change-password" : next);
            router.refresh();
        } catch {
            setError("Couldn't reach the server. Check your connection.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-8 space-y-5">
            <AuthField
                label="USN"
                name="username"
                required
                autoFocus
                autoComplete="username"
                placeholder="2102508XXX"
                hint="Your university seat number — the one in your welcome email."
            />
            <AuthField
                label="Password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••"
            />
            <AuthError message={error} />
            <AuthSubmit pending={pending}>Sign in</AuthSubmit>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-32 pb-16">
            <div className="max-w-md mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <LogIn size={28} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                        Member <span className="text-cyan-400">sign in</span>
                    </h1>
                    <p className="text-neutral-400">
                        For DevForge members. Everything else on the site is open to everyone.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Suspense fallback={<div className="glass-strong rounded-3xl h-80 animate-pulse" />}>
                        <LoginForm />
                    </Suspense>
                    <p className="text-center text-xs text-neutral-600 mt-6">
                        Lost your credentials? Ask an admin to reissue them.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
