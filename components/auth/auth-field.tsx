"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    label: string;
    hint?: string;
}

/**
 * Matches the glass input used on the members page — a themed focus ring via
 * focus-within so the whole surface responds, not just the bare input.
 */
export function AuthField({ label, hint, type = "text", ...input }: AuthFieldProps) {
    const id = useId();
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label htmlFor={id} className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
                {label}
            </label>
            <div className="flex items-center gap-2 glass focus-within:border-cyan-400/50 rounded-xl px-4 py-3 transition-colors">
                <input
                    {...input}
                    id={id}
                    type={isPassword && revealed ? "text" : type}
                    className="bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-600"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setRevealed((v) => !v)}
                        className="text-neutral-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                        aria-label={revealed ? "Hide password" : "Show password"}
                    >
                        {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {hint && <p className="text-xs text-neutral-600 mt-2">{hint}</p>}
        </div>
    );
}

export function AuthError({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <p
            role="alert"
            className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
        >
            {message}
        </p>
    );
}

export function AuthSubmit({ pending, children }: { pending: boolean; children: string }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm rounded-xl py-3.5 transition-colors"
        >
            {pending ? "Working…" : children}
        </button>
    );
}
