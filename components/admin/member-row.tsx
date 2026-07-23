"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Shield } from "lucide-react";
import type { AdminMemberRow } from "@/app/api/admin/members/route";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
    approved: "bg-cyan-400/10 text-cyan-300 border-cyan-400/25",
    rejected: "bg-red-500/10 text-red-400 border-red-500/25",
};

export function MemberRow({ member, isSelf }: { member: AdminMemberRow; isSelf: boolean }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [failed, setFailed] = useState(false);

    async function act(action: "approve" | "reject" | "set-role", role?: string) {
        if (action === "reject" && !confirm(`Decline ${member.name}'s request?`)) return;

        setPending(true);
        setMessage(null);
        setFailed(false);
        try {
            const response = await fetch(`/api/admin/members/${member.usn}`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ action, role }),
            });
            const body = await response.json();
            setMessage(body.message ?? "Done.");
            setFailed(!response.ok);
            if (response.ok) router.refresh();
        } catch {
            setMessage("Couldn't reach the server.");
            setFailed(true);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{member.name}</span>
                        <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                                STATUS_STYLES[member.status] ?? STATUS_STYLES.rejected
                            }`}
                        >
                            {member.status}
                        </span>
                        {member.role !== "member" && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-violet-300">
                                <Shield size={10} />
                                {member.role}
                            </span>
                        )}
                        {member.status === "approved" && !member.hasSignedIn && (
                            <span className="text-[10px] text-neutral-600">hasn&rsquo;t signed in yet</span>
                        )}
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{member.usn}</p>
                    {member.note && (
                        <p className="text-sm text-neutral-400 mt-2 italic">&ldquo;{member.note}&rdquo;</p>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {member.status === "pending" && (
                        <>
                            <button
                                onClick={() => act("approve")}
                                disabled={pending}
                                className="inline-flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-black font-semibold text-xs rounded-full px-3.5 py-2 transition-colors"
                            >
                                <Check size={13} />
                                Approve
                            </button>
                            <button
                                onClick={() => act("reject")}
                                disabled={pending}
                                className="inline-flex items-center gap-1.5 glass-subtle hover:border-red-500/40 disabled:opacity-50 text-neutral-400 hover:text-red-400 text-xs rounded-full px-3.5 py-2 transition-colors"
                            >
                                <X size={13} />
                                Decline
                            </button>
                        </>
                    )}

                    {member.status === "approved" && !isSelf && (
                        <select
                            value={member.role}
                            onChange={(e) => act("set-role", e.target.value)}
                            disabled={pending}
                            aria-label={`Role for ${member.name}`}
                            className="glass-subtle text-xs text-neutral-300 rounded-full px-3 py-2 outline-none focus:border-cyan-400/40 disabled:opacity-50 [&>option]:bg-neutral-900"
                        >
                            <option value="member">member</option>
                            <option value="mentor">mentor</option>
                            <option value="admin">admin</option>
                        </select>
                    )}

                    {isSelf && <span className="text-xs text-neutral-600">you</span>}
                </div>
            </div>

            {message && (
                <p className={`text-xs mt-3 ${failed ? "text-red-400" : "text-cyan-300"}`}>{message}</p>
            )}
        </div>
    );
}
