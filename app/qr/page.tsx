"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Download, Link2, QrCode, Shield, Sliders } from "lucide-react";

const PRESETS = {
    website: "https://www.devforge.club",
    rsvp: "https://forms.gle/M8rDS4wG1jyuGiSC6",
    github: "https://github.com/NST-DEVFORGE"
};

const ECC_OPTIONS = ["L", "M", "Q", "H"] as const;
const FORMAT_OPTIONS = ["png", "svg"] as const;

function sanitizeHex(value: string, fallback: string) {
    const match = value.trim().match(/^#?[0-9a-fA-F]{6}$/);
    return match ? match[0].replace("#", "") : fallback;
}

export default function QrPage() {
    const [text, setText] = useState(PRESETS.website);
    const [size, setSize] = useState(320);
    const [ecc, setEcc] = useState<(typeof ECC_OPTIONS)[number]>("M");
    const [margin, setMargin] = useState(2);
    const [fg, setFg] = useState("#f97316");
    const [bg, setBg] = useState("#0b0b0f");
    const [format, setFormat] = useState<(typeof FORMAT_OPTIONS)[number]>("png");

    const qrUrl = useMemo(() => {
        const resolvedSize = Math.min(Math.max(size, 160), 720);
        const resolvedMargin = Math.min(Math.max(margin, 0), 12);
        const params = new URLSearchParams({
            data: text || PRESETS.website,
            size: `${resolvedSize}x${resolvedSize}`,
            ecc,
            margin: String(resolvedMargin),
            color: sanitizeHex(fg, "f97316"),
            bgcolor: sanitizeHex(bg, "0b0b0f"),
            format
        });
        return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    }, [text, size, ecc, margin, fg, bg, format]);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
            <section className="relative overflow-hidden px-4 pt-24 pb-16">
                <div className="absolute inset-0 matrix-grid opacity-60" />
                <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-500/20 blur-[120px]" />
                <div className="relative mx-auto max-w-6xl">
                    <div className="glow-border px-8 py-10 md:px-12 md:py-14">
                        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1 text-sm text-orange-200">
                                    <QrCode size={16} />
                                    DevForge QR Lab
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-transparent md:text-6xl bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text">
                                    Forge sleek QR codes for every DevForge drop.
                                </h1>
                                <p className="max-w-2xl text-lg text-neutral-300">
                                    Build branded QR codes with control over color, size, and error correction. Share
                                    event links, repository drops, or onboarding portals in seconds.
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
                                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                                        <Sliders size={16} className="text-orange-400" />
                                        Advanced tuning
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                                        <Shield size={16} className="text-orange-400" />
                                        Error correction
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
                                        <Link2 size={16} className="text-orange-400" />
                                        Live preview
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel p-6 md:p-8">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Quick presets</h2>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <button
                                            type="button"
                                            onClick={() => setText(PRESETS.website)}
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-orange-500/50 hover:bg-orange-500/10"
                                        >
                                            DevForge site
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setText(PRESETS.rsvp)}
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-orange-500/50 hover:bg-orange-500/10"
                                        >
                                            Join form
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setText(PRESETS.github)}
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-orange-500/50 hover:bg-orange-500/10"
                                        >
                                            GitHub org
                                        </button>
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        Tip: Drop any URL or message below to generate a fresh code instantly.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="glow-border p-8">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-lg font-semibold">
                            <ArrowRight size={20} className="text-orange-400" />
                            Generator controls
                        </div>
                        <label className="space-y-2 text-sm text-neutral-300">
                            QR payload
                            <textarea
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                                rows={4}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-orange-500/60"
                                placeholder="https://devforge.club/events/ignite"
                            />
                        </label>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="space-y-2 text-sm text-neutral-300">
                                Size (px)
                                <input
                                    type="number"
                                    min={160}
                                    max={720}
                                    value={size}
                                    onChange={(event) => setSize(Number(event.target.value || 320))}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base text-white outline-none focus:border-orange-500/60"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-neutral-300">
                                Margin
                                <input
                                    type="number"
                                    min={0}
                                    max={12}
                                    value={margin}
                                    onChange={(event) => setMargin(Number(event.target.value || 2))}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base text-white outline-none focus:border-orange-500/60"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-neutral-300">
                                Error correction
                                <select
                                    value={ecc}
                                    onChange={(event) => setEcc(event.target.value as (typeof ECC_OPTIONS)[number])}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base text-white outline-none focus:border-orange-500/60"
                                >
                                    {ECC_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-neutral-300">
                                Format
                                <select
                                    value={format}
                                    onChange={(event) => setFormat(event.target.value as (typeof FORMAT_OPTIONS)[number])}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-base text-white outline-none focus:border-orange-500/60"
                                >
                                    {FORMAT_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-2 text-sm text-neutral-300">
                                Foreground
                                <input
                                    type="color"
                                    value={fg}
                                    onChange={(event) => setFg(event.target.value)}
                                    className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-black/40"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-neutral-300">
                                Background
                                <input
                                    type="color"
                                    value={bg}
                                    onChange={(event) => setBg(event.target.value)}
                                    className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-black/40"
                                />
                            </label>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-neutral-400">
                            Generated via QRServer API. Avoid sensitive payloads for private data.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glow-border p-8 text-center">
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Live preview</p>
                            <div className="mx-auto flex h-[320px] w-[320px] items-center justify-center rounded-2xl border border-white/10 bg-black/50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrUrl} alt="Generated QR code" className="h-64 w-64" />
                            </div>
                            <a
                                href={qrUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
                            >
                                <Download size={16} />
                                Download QR
                            </a>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold">Best-fit features</h3>
                        <div className="mt-4 space-y-3 text-sm text-neutral-300">
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                                High-contrast themes for stage screens and posters.
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                                Error correction ready for stickers, badges, and merch.
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                                SVG output for sharp scaling across banners and decks.
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                                Built for DevForge branding, tuned to the club palette.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
