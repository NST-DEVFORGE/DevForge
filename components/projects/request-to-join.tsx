"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Clock, Check } from "lucide-react";
import type { CollabStatus } from "@/lib/projects";

type State = "none" | CollabStatus | "collaborator";

export function RequestToJoin({
    projectId,
    initialState,
    disabled,
    disabledReason,
}: {
    projectId: string;
    initialState: State;
    disabled: boolean;
    disabledReason?: string;
}) {
    const router = useRouter();
    const [state, setState] = useState<State>(initialState);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (state === "collaborator" || state === "accepted") {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300">
                <Check size={14} /> You&rsquo;re on the team
            </span>
        );
    }

    async function request() {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch(`/api/projects/${projectId}/collab`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message: "" }),
            });
            const body = await response.json();
            if (!response.ok) {
                setError(body.message ?? "Couldn't send the request.");
                return;
            }
            setState("pending");
            router.refresh();
        } catch {
            setError("Couldn't reach the server.");
        } finally {
            setBusy(false);
        }
    }

    async function withdraw() {
        setBusy(true);
        setError(null);
        try {
            await fetch(`/api/projects/${projectId}/collab`, { method: "DELETE" });
            setState("none");
            router.refresh();
        } finally {
            setBusy(false);
        }
    }

    if (state === "pending") {
        return (
            <button
                onClick={withdraw}
                disabled={busy}
                className="inline-flex items-center gap-1.5 glass-subtle hover:border-red-500/40 text-neutral-400 hover:text-red-400 text-xs rounded-full px-3.5 py-2 transition-colors disabled:opacity-50"
            >
                <Clock size={13} /> Requested — withdraw
            </button>
        );
    }

    if (disabled) {
        return <span className="text-xs text-neutral-600">{disabledReason ?? "Not taking collaborators"}</span>;
    }

    return (
        <div className="text-right">
            <button
                onClick={request}
                disabled={busy}
                className="inline-flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-xs rounded-full px-3.5 py-2 transition-colors disabled:opacity-50"
            >
                <UserPlus size={13} /> Request to join
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}
