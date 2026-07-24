"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, X } from "lucide-react";

const label = "block text-xs uppercase tracking-wider text-neutral-400 mb-2";
const surface =
    "glass-subtle !rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-cyan-400/50 px-4 py-3 transition-colors";
const input = "bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-500";

/**
 * Admin/mentor control to schedule a session. Collapsed by default so it
 * doesn't dominate the members' event list. The API (/api/events POST) is
 * itself admin-gated and pushes a notification to everyone on success.
 */
export function CreateSession() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError(null);

        const form = new FormData(event.currentTarget);
        const date = String(form.get("date"));
        const time = String(form.get("time"));
        // datetime-local gives no timezone; the club runs in IST, so pin it.
        const startsAt = new Date(`${date}T${time}:00+05:30`).toISOString();
        const capacityRaw = String(form.get("capacity")).trim();

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    title: form.get("title"),
                    summary: form.get("summary"),
                    location: form.get("location"),
                    startsAt,
                    capacity: capacityRaw ? Number(capacityRaw) : null,
                }),
            });
            const body = await response.json();
            if (!response.ok) {
                setError(body.message ?? "Couldn't create the session.");
                return;
            }
            setOpen(false);
            router.refresh();
        } catch {
            setError("Couldn't reach the server.");
        } finally {
            setPending(false);
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-sm rounded-full px-5 py-2.5 transition-colors"
            >
                <CalendarPlus size={16} />
                New session
            </button>
        );
    }

    return (
        <form onSubmit={submit} className="glass-strong rounded-2xl p-6 space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-white">Schedule a session</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Cancel" className="text-neutral-500 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            <div>
                <label htmlFor="s-title" className={label}>Title</label>
                <div className={surface}>
                    <input id="s-title" name="title" required minLength={3} maxLength={120} placeholder="Intro to Next.js" className={input} />
                </div>
            </div>

            <div>
                <label htmlFor="s-summary" className={label}>What&rsquo;s it about?</label>
                <div className={surface}>
                    <textarea id="s-summary" name="summary" required minLength={10} maxLength={500} rows={2} placeholder="Hands-on build session — bring a laptop." className={`${input} resize-y`} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="s-date" className={label}>Date</label>
                    <div className={surface}>
                        <input id="s-date" name="date" type="date" required className={`${input} [color-scheme:dark]`} />
                    </div>
                </div>
                <div>
                    <label htmlFor="s-time" className={label}>Time (IST)</label>
                    <div className={surface}>
                        <input id="s-time" name="time" type="time" required className={`${input} [color-scheme:dark]`} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="s-location" className={label}>Location</label>
                    <div className={surface}>
                        <input id="s-location" name="location" required minLength={2} maxLength={160} placeholder="Lab 2 / Discord" className={input} />
                    </div>
                </div>
                <div>
                    <label htmlFor="s-capacity" className={label}>Capacity (optional)</label>
                    <div className={surface}>
                        <input id="s-capacity" name="capacity" type="number" min={1} max={10000} placeholder="No limit" className={input} />
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={pending}
                className="bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-black font-bold text-sm rounded-xl px-6 py-3 transition-colors"
            >
                {pending ? "Creating…" : "Create & notify members"}
            </button>
        </form>
    );
}
