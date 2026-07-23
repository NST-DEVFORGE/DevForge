"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
    label: string;
    hint?: string;
}

/**
 * A themed focus ring via focus-within so the whole surface responds, not just
 * the bare input.
 *
 * Text here is neutral-400 or lighter throughout: neutral-500/600 measured
 * 3.5:1 and 2.1:1 against this card, well under the 4.5:1 AA needs, which left
 * the labels and hints all but invisible. glass-subtle rather than glass —
 * glass bakes in a 20px radius and a 34px drop shadow meant for whole panels,
 * which on a control read as a second ring floating inside the field.
 */
export function AuthField({ label, hint, type = "text", ...input }: AuthFieldProps) {
    const id = useId();
    const hintId = useId();
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label htmlFor={id} className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                {label}
            </label>
            {/* outline, not ring: Tailwind's ring is a box-shadow and would wipe
                glass-subtle's own shadow on focus. Outline also sidesteps the
                border, which globals.css holds on .glass-subtle even against an
                !important utility. !rounded-xl is the same override the navbar
                uses for the radius .glass* bakes in. */}
            <div className="flex items-center gap-2 glass-subtle !rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-cyan-400/50 px-4 py-3 transition-colors">
                <input
                    {...input}
                    id={id}
                    aria-describedby={hint ? hintId : undefined}
                    type={isPassword && revealed ? "text" : type}
                    className="bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-400"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setRevealed((v) => !v)}
                        className="text-neutral-400 hover:text-cyan-400 transition-colors flex-shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        aria-label={revealed ? "Hide password" : "Show password"}
                    >
                        {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {hint && <p id={hintId} className="text-xs text-neutral-400 mt-2">{hint}</p>}
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
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm rounded-xl py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
            {pending ? "Working…" : children}
        </button>
    );
}
