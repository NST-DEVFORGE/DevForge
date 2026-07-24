"use client";

import { useState } from "react";
import { Send, Bell } from "lucide-react";

/**
 * Admin control for pushing a notification to every member who has enabled
 * them. Posts to /api/push/send, which is itself admin-gated — this is just
 * the compose surface.
 */
export function NotifyComposer() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

    async function send(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setResult(null);
        try {
            const response = await fetch("/api/push/send", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ title, body, url: url.trim() || undefined }),
            });
            const data = await response.json();
            setResult({ ok: response.ok, message: data.message ?? (response.ok ? "Sent." : "Failed.") });
            if (response.ok) {
                setTitle("");
                setBody("");
                setUrl("");
            }
        } catch {
            setResult({ ok: false, message: "Couldn't reach the server." });
        } finally {
            setPending(false);
        }
    }

    const label = "block text-xs uppercase tracking-wider text-neutral-400 mb-2";
    const surface =
        "glass-subtle !rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-cyan-400/50 px-4 py-3 transition-colors";
    const input = "bg-transparent outline-none w-full text-sm text-white placeholder:text-neutral-500";

    return (
        <form onSubmit={send} className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-300">
                <Bell size={16} />
                <h3 className="text-sm font-semibold">Send a notification</h3>
            </div>

            <div>
                <label htmlFor="notify-title" className={label}>Title</label>
                <div className={surface}>
                    <input
                        id="notify-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={80}
                        placeholder="New session this Friday"
                        className={input}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notify-body" className={label}>Message</label>
                <div className={surface}>
                    <textarea
                        id="notify-body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        maxLength={300}
                        rows={2}
                        placeholder="RSVP is open — 30 seats. Doors 5pm in Lab 2."
                        className={`${input} resize-y`}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notify-url" className={label}>Link (optional)</label>
                <div className={surface}>
                    <input
                        id="notify-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="/dashboard/events"
                        className={input}
                    />
                </div>
                <p className="text-xs text-neutral-600 mt-1.5">
                    A path on this site, e.g. <code className="text-neutral-500">/dashboard/events</code>. Opens when the notification is tapped.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-black font-semibold text-sm rounded-full px-5 py-2.5 transition-colors"
                >
                    <Send size={15} />
                    {pending ? "Sending…" : "Send to all members"}
                </button>
                {result && (
                    <p className={`text-sm ${result.ok ? "text-cyan-300" : "text-red-400"}`}>{result.message}</p>
                )}
            </div>
        </form>
    );
}
