"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { AuthError, AuthField, AuthSubmit } from "@/components/auth/auth-field";

/**
 * Deliberately outside /dashboard: the dashboard layout redirects here while
 * mustChangePassword is set, and nesting it would loop.
 */
export default function ChangePasswordPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const form = new FormData(event.currentTarget);
        const newPassword = String(form.get("newPassword"));

        if (newPassword !== String(form.get("confirmPassword"))) {
            setError("The two new passwords don't match.");
            return;
        }

        setPending(true);
        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword }),
            });
            const body = await response.json();

            if (!response.ok) {
                setError(body.message ?? "Something went wrong. Try again.");
                return;
            }
            router.replace("/dashboard");
            router.refresh();
        } catch {
            setError("Couldn't reach the server. Check your connection.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-32 pb-16">
            <div className="max-w-md mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <KeyRound size={28} />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">
                        Pick a <span className="text-cyan-400">new password</span>
                    </h1>
                    <p className="text-neutral-400">
                        The one we emailed you was generated for first sign-in. Replace it with
                        something only you know.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={onSubmit}
                    className="glass-strong rounded-3xl p-8 space-y-5"
                >
                    <AuthField
                        label="Current password"
                        name="currentPassword"
                        type="password"
                        required
                        autoFocus
                        autoComplete="current-password"
                        placeholder="From your welcome email"
                    />
                    <AuthField
                        label="New password"
                        name="newPassword"
                        type="password"
                        required
                        minLength={10}
                        autoComplete="new-password"
                        placeholder="At least 10 characters"
                        hint="Use something you don't reuse elsewhere. A short phrase beats a scrambled word."
                    />
                    <AuthField
                        label="Confirm new password"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={10}
                        autoComplete="new-password"
                        placeholder="Type it again"
                    />
                    <AuthError message={error} />
                    <AuthSubmit pending={pending}>Update password</AuthSubmit>
                </motion.form>
            </div>
        </div>
    );
}
