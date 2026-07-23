"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CalendarPlus } from "lucide-react";

interface RsvpButtonProps {
    eventId: string;
    initiallyGoing: boolean;
    full: boolean;
    past: boolean;
}

export function RsvpButton({ eventId, initiallyGoing, full, past }: RsvpButtonProps) {
    const router = useRouter();
    const [going, setGoing] = useState(initiallyGoing);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (past) {
        return <span className="text-xs text-neutral-600">Finished</span>;
    }

    async function toggle() {
        setPending(true);
        setError(null);
        // Optimistic: the common case succeeds, and rolling back is cheap.
        const next = !going;
        setGoing(next);

        try {
            const response = await fetch(`/api/events/${eventId}/rsvp`, {
                method: next ? "POST" : "DELETE",
            });
            const body = await response.json();
            if (!response.ok) {
                setGoing(!next);
                setError(body.message ?? "Couldn't update your RSVP.");
                return;
            }
            router.refresh();
        } catch {
            setGoing(!next);
            setError("Couldn't reach the server.");
        } finally {
            setPending(false);
        }
    }

    if (full && !going) {
        return <span className="text-xs text-neutral-500">Full</span>;
    }

    return (
        <div className="text-right">
            <button
                onClick={toggle}
                disabled={pending}
                className={`inline-flex items-center gap-1.5 text-sm rounded-full px-4 py-2 transition-colors disabled:opacity-50 ${
                    going
                        ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/25"
                        : "bg-cyan-400 hover:bg-cyan-500 text-black font-semibold"
                }`}
            >
                {going ? <Check size={15} /> : <CalendarPlus size={15} />}
                {going ? "Going" : "RSVP"}
            </button>
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
    );
}
