"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import type { CollabRequest } from "@/lib/projects";

export function CollabRequests({
    projectId,
    requests,
    full,
}: {
    projectId: string;
    requests: CollabRequest[];
    full: boolean;
}) {
    const pending = requests.filter((r) => r.status === "pending");

    if (pending.length === 0) {
        return <p className="text-sm text-neutral-500">No pending requests.</p>;
    }

    return (
        <div className="space-y-2">
            {pending.map((request) => (
                <RequestRow key={request.usn} projectId={projectId} request={request} full={full} />
            ))}
        </div>
    );
}

function RequestRow({
    projectId,
    request,
    full,
}: {
    projectId: string;
    request: CollabRequest;
    full: boolean;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function decide(action: "accept" | "reject") {
        setPending(true);
        setError(null);
        try {
            const response = await fetch(`/api/projects/${projectId}/collab/${request.usn}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ action }),
            });
            const body = await response.json();
            if (!response.ok) {
                setError(body.message ?? "Couldn't update the request.");
                return;
            }
            router.refresh();
        } catch {
            setError("Couldn't reach the server.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="glass-subtle rounded-xl p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                    <p className="font-semibold text-white">{request.name}</p>
                    <p className="text-xs text-neutral-500 font-mono">{request.usn}</p>
                    {request.message && (
                        <p className="text-sm text-neutral-400 mt-2 italic">&ldquo;{request.message}&rdquo;</p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => decide("accept")}
                        disabled={pending || full}
                        title={full ? "Collaborator slots are full" : undefined}
                        className="inline-flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-black font-semibold text-xs rounded-full px-3.5 py-2 transition-colors"
                    >
                        <Check size={13} />
                        Accept
                    </button>
                    <button
                        onClick={() => decide("reject")}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 glass-subtle hover:border-red-500/40 disabled:opacity-50 text-neutral-400 hover:text-red-400 text-xs rounded-full px-3.5 py-2 transition-colors"
                    >
                        <X size={13} />
                        Decline
                    </button>
                </div>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
    );
}
