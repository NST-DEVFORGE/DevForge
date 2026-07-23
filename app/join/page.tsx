"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { AuthError, AuthField, AuthSubmit } from "@/components/auth/auth-field";

export default function JoinPage() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/join", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ usn: form.get("usn"), note: form.get("note") }),
            });
            const body = await response.json();
            if (!response.ok) {
                setError(body.message ?? "Something went wrong. Try again.");
                return;
            }
            setSubmitted(true);
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
                        {submitted ? <CheckCircle2 size={28} /> : <UserPlus size={28} />}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                        {submitted ? (
                            <>
                                Request <span className="text-cyan-400">sent</span>
                            </>
                        ) : (
                            <>
                                Join <span className="text-cyan-400">DevForge</span>
                            </>
                        )}
                    </h1>
                    <p className="text-neutral-400">
                        {submitted
                            ? "An admin will review it. You'll get an email with your sign-in details once you're approved."
                            : "For Newton School students. We'll pull your details from the student portal — just your USN is enough."}
                    </p>
                </motion.div>

                {!submitted && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={onSubmit}
                        className="glass-strong rounded-3xl p-8 space-y-5"
                    >
                        <AuthField
                            label="USN"
                            name="usn"
                            required
                            autoFocus
                            placeholder="2102508XXX"
                            hint="Your university seat number."
                        />
                        <div>
                            <label htmlFor="note" className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                                Anything to add?
                            </label>
                            <div className="glass focus-within:border-cyan-400/50 rounded-xl px-4 py-3 transition-colors">
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={3}
                                    placeholder="What are you hoping to build or learn? Optional."
                                    className="bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-600 resize-y"
                                />
                            </div>
                        </div>
                        <AuthError message={error} />
                        <AuthSubmit pending={pending}>Request to join</AuthSubmit>
                    </motion.form>
                )}
            </div>
        </div>
    );
}
