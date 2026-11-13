"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Swords,
    TrendingUp,
    ExternalLink,
    Search,
    RefreshCw,
    Sparkles,
    CheckCircle2,
    DollarSign,
    Code2,
    GitMerge,
    ArrowRight,
    QrCode,
    Copy,
    Check,
    Info,
    Flame,
    Share2,
    SlidersHorizontal,
} from "lucide-react";
import type { GroupismResponse, GroupismPR } from "@/lib/groupism";

interface GroupismArenaProps {
    initialData: GroupismResponse;
}

export function GroupismArena({ initialData }: GroupismArenaProps) {
    const [data, setData] = useState<GroupismResponse>(initialData);
    const [rate, setRate] = useState<number>(10); // ₹10 / line default based on user prompt (57 lines = ₹570)
    const [customRate, setCustomRate] = useState<string>("10");
    const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
    const [countMode, setCountMode] = useState<"total" | "net" | "additions">("total");
    const [filterAuthor, setFilterAuthor] = useState<"all" | "geetansh" | "sahitya">("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<"lines" | "date" | "bounty">("lines");
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [showUpiModal, setShowUpiModal] = useState<boolean>(false);
    const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
    const [copiedShare, setCopiedShare] = useState<boolean>(false);

    // Compute lines for a given PR based on countMode
    const getPrLines = (pr: GroupismPR) => {
        if (countMode === "additions") return pr.additions;
        if (countMode === "net") return Math.max(0, pr.additions - pr.deletions);
        return pr.total_lines;
    };

    // Recalculate stats based on rate & countMode
    const geetanshLines = useMemo(() => {
        return data.geetansh.prs.reduce((acc, pr) => acc + getPrLines(pr), 0);
    }, [data.geetansh.prs, countMode]);

    const sahityaLines = useMemo(() => {
        return data.sahitya.prs.reduce((acc, pr) => acc + getPrLines(pr), 0);
    }, [data.sahitya.prs, countMode]);

    const geetanshBounty = geetanshLines * rate;
    const sahityaBounty = sahityaLines * rate;

    const diffLines = Math.abs(sahityaLines - geetanshLines);
    const netDebtAmount = diffLines * rate;
    const leader = sahityaLines > geetanshLines ? "sahitya" : geetanshLines > sahityaLines ? "geetansh" : "tied";
    const debtor = leader === "sahitya" ? "Geetansh" : "Sahitya";
    const creditor = leader === "sahitya" ? "Sahitya" : "Geetansh";

    // Progress bar split percentage
    const totalLinesCombined = geetanshLines + sahityaLines;
    const geetanshPercent = totalLinesCombined > 0 ? (geetanshLines / totalLinesCombined) * 100 : 50;
    const sahityaPercent = totalLinesCombined > 0 ? (sahityaLines / totalLinesCombined) * 100 : 50;

    // Combined and filtered PRs
    const allPRs = useMemo(() => {
        const combined = [...data.geetansh.prs, ...data.sahitya.prs];
        return combined.filter((pr) => {
            if (filterAuthor !== "all" && pr.author !== filterAuthor) return false;
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchTitle = pr.title.toLowerCase().includes(query);
                const matchRepo = pr.repo.toLowerCase().includes(query);
                const matchNumber = String(pr.number).includes(query);
                return matchTitle || matchRepo || matchNumber;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === "lines") {
                return getPrLines(b) - getPrLines(a);
            }
            if (sortBy === "bounty") {
                return (getPrLines(b) * rate) - (getPrLines(a) * rate);
            }
            return new Date(b.merged_at).getTime() - new Date(a.merged_at).getTime();
        });
    }, [data, filterAuthor, searchQuery, sortBy, countMode, rate]);

    // Refresh live stats
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/groupism?refresh=1");
            if (res.ok) {
                const updated = await res.json();
                setData(updated);
            }
        } catch (e) {
            console.error("Refresh error:", e);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        }
    };

    const handleCopyUpi = () => {
        const upiId = leader === "sahitya" ? "sahitya@upi" : "geetansh@upi";
        navigator.clipboard.writeText(upiId);
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#070b12] text-white pt-24 pb-20 selection:bg-cyan-500 selection:text-black relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

            {/* Grid Pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Badge & Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs sm:text-sm font-mono uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    >
                        <Swords className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>The Ultimate Lines of Code Wager</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>1 LOC = ₹{rate}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200">
                            Geetansh
                        </span>{" "}
                        <span className="text-white/40 italic font-serif">vs</span>{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                            Sahitya
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto"
                    >
                        Every merged line of code owes cash to the opponent. Sahitya defends Checkstyle, Geetansh champions openSUSE & Uyuni.
                    </motion.p>

                    {/* Quick Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 transition-colors"
                            title="Fetch live merged PR additions and deletions from GitHub"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
                            {isRefreshing ? "Syncing GitHub..." : "Sync Live PRs"}
                        </button>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 transition-colors"
                        >
                            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                            {copiedShare ? "Link Copied!" : "Share Duel"}
                        </button>

                        <span className="text-xs text-neutral-500 font-mono">
                            Last synced: {new Date(data.lastUpdated).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>
                </div>

                {/* THE MAIN DUEL ARENA SCOREBOARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="relative rounded-2xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-12 overflow-hidden"
                >
                    {/* Corner Arena Accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* FIGHTER 1: GEETANSH */}
                        <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/20 relative group hover:border-emerald-500/40 transition-all">
                            <div className="relative mb-4">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
                                <Image
                                    src={data.geetansh.avatar}
                                    alt={data.geetansh.name}
                                    width={96}
                                    height={96}
                                    className="relative rounded-full border-2 border-emerald-400/80 object-cover"
                                />
                                <span className="absolute bottom-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                    🦎 SUSE
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                {data.geetansh.name}
                            </h3>
                            <a
                                href={data.geetansh.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-mono text-emerald-400/80 hover:text-emerald-300 flex items-center gap-1 mt-1"
                            >
                                @{data.geetansh.username}
                                <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                                {data.geetansh.orgLabels.map((org) => (
                                    <span key={org} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                        {org}
                                    </span>
                                ))}
                            </div>

                            {/* Geetansh Stats */}
                            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5">
                                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">Lines Merged</span>
                                    <span className="text-2xl font-bold font-mono text-emerald-400">{geetanshLines.toLocaleString()}</span>
                                    <span className="text-[10px] text-neutral-500 block">in {data.geetansh.prs.length} PRs</span>
                                </div>
                                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">Bounty Value</span>
                                    <span className="text-2xl font-bold font-mono text-emerald-300">₹{geetanshBounty.toLocaleString()}</span>
                                    <span className="text-[10px] text-neutral-500 block">@ ₹{rate}/LOC</span>
                                </div>
                            </div>
                        </div>

                        {/* CENTER: DUEL METER & DEBT SETTLEMENT CARD */}
                        <div className="lg:col-span-4 flex flex-col items-center text-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <Swords className="w-6 h-6 text-cyan-400" />
                            </div>

                            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2">
                                Live Wager Settlement
                            </span>

                            {/* Big Debt Statement */}
                            <div className="w-full bg-black/50 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden mb-6">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-500" />

                                <div className="text-xs font-mono text-neutral-400 mb-1">Current Standing:</div>
                                <div className="text-xl sm:text-2xl font-extrabold text-white">
                                    <span className={debtor === "Geetansh" ? "text-emerald-400" : "text-amber-400"}>
                                        {debtor}
                                    </span>{" "}
                                    owes{" "}
                                    <span className={creditor === "Sahitya" ? "text-amber-400" : "text-emerald-400"}>
                                        {creditor}
                                    </span>
                                </div>

                                <div className="text-3xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 my-2">
                                    ₹{netDebtAmount.toLocaleString()}
                                </div>

                                <div className="text-xs text-neutral-400 font-mono">
                                    Margin: <strong className="text-white">{diffLines.toLocaleString()} LOC</strong> ({countMode} mode)
                                </div>

                                <button
                                    onClick={() => setShowUpiModal(true)}
                                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <QrCode className="w-4 h-4" />
                                    <span>Settle Wager on UPI</span>
                                </button>
                            </div>

                            {/* Tug of war bar */}
                            <div className="w-full">
                                <div className="flex justify-between text-xs font-mono mb-1.5 text-neutral-400">
                                    <span className="text-emerald-400 font-semibold">{geetanshPercent.toFixed(1)}%</span>
                                    <span className="text-neutral-500">Tug of War</span>
                                    <span className="text-amber-400 font-semibold">{sahityaPercent.toFixed(1)}%</span>
                                </div>
                                <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden flex p-0.5 border border-white/10">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-l-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${geetanshPercent}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-r-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sahityaPercent}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FIGHTER 2: SAHITYA */}
                        <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-xl bg-amber-950/20 border border-amber-500/20 relative group hover:border-amber-500/40 transition-all">
                            <div className="relative mb-4">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
                                <Image
                                    src={data.sahitya.avatar}
                                    alt={data.sahitya.name}
                                    width={96}
                                    height={96}
                                    className="relative rounded-full border-2 border-amber-400/80 object-cover"
                                />
                                <span className="absolute bottom-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                    ☕ CHECKSTYLE
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                {data.sahitya.name}
                            </h3>
                            <a
                                href={data.sahitya.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-mono text-amber-400/80 hover:text-amber-300 flex items-center gap-1 mt-1"
                            >
                                @{data.sahitya.username}
                                <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                                {data.sahitya.orgLabels.map((org) => (
                                    <span key={org} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                        {org}
                                    </span>
                                ))}
                            </div>

                            {/* Sahitya Stats */}
                            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5">
                                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">Lines Merged</span>
                                    <span className="text-2xl font-bold font-mono text-amber-400">{sahityaLines.toLocaleString()}</span>
                                    <span className="text-[10px] text-neutral-500 block">in {data.sahitya.prs.length} PRs</span>
                                </div>
                                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">Bounty Value</span>
                                    <span className="text-2xl font-bold font-mono text-amber-300">₹{sahityaBounty.toLocaleString()}</span>
                                    <span className="text-[10px] text-neutral-500 block">@ ₹{rate}/LOC</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* INTERACTIVE CONTROLS BAR: RATE SELECTOR & COUNT MODE */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-5 mb-10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Stake Rate Selector */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                                Wager Multiplier:
                            </span>

                            <div className="inline-flex rounded-xl p-1 bg-black/40 border border-white/10">
                                {[1, 5, 10, 50].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            setRate(r);
                                            setIsCustomRate(false);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                                            rate === r && !isCustomRate
                                                ? "bg-cyan-500 text-black shadow-md font-bold"
                                                : "text-neutral-400 hover:text-white"
                                        }`}
                                    >
                                        ₹{r}/line {r === 10 && <span className="opacity-75 text-[10px]">(Canon)</span>}
                                    </button>
                                ))}

                                <div className="relative inline-flex items-center ml-1">
                                    <span className="text-xs text-neutral-500 font-mono pl-2">₹</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={customRate}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setCustomRate(val);
                                            const parsed = parseInt(val, 10);
                                            if (!isNaN(parsed) && parsed > 0) {
                                                setRate(parsed);
                                                setIsCustomRate(true);
                                            }
                                        }}
                                        className="w-16 bg-transparent text-xs font-mono text-cyan-300 px-1 py-1 focus:outline-none"
                                        placeholder="Custom"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LOC Calculation Mode */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                                Counting Mode:
                            </span>

                            <div className="inline-flex rounded-xl p-1 bg-black/40 border border-white/10">
                                <button
                                    onClick={() => setCountMode("total")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                        countMode === "total"
                                            ? "bg-white/20 text-white font-bold shadow"
                                            : "text-neutral-400 hover:text-white"
                                    }`}
                                    title="Additions + Deletions"
                                >
                                    Total Changed (±)
                                </button>
                                <button
                                    onClick={() => setCountMode("additions")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                        countMode === "additions"
                                            ? "bg-white/20 text-white font-bold shadow"
                                            : "text-neutral-400 hover:text-white"
                                    }`}
                                    title="Only Additions (+)"
                                >
                                    Additions Only (+)
                                </button>
                                <button
                                    onClick={() => setCountMode("net")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                        countMode === "net"
                                            ? "bg-white/20 text-white font-bold shadow"
                                            : "text-neutral-400 hover:text-white"
                                    }`}
                                    title="Additions - Deletions"
                                >
                                    Net LOC (+ minus -)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE 57 LINES ORIGIN STORY / CALLOUT CARD */}
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900/40 to-amber-950/40 border border-white/10 p-6 mb-12 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                <Sparkles className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1">
                                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                                    The 57-Line Legend & Groupism Genesis
                                </div>
                                <h4 className="text-lg font-bold text-white">
                                    How openSUSE/news-o-o#635 Sparked the Entire Bet
                                </h4>
                                <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
                                    When Geetansh merged his GSoC 2026 recap in{" "}
                                    <code className="text-emerald-300 font-mono">openSUSE/news-o-o</code> with exactly{" "}
                                    <strong className="text-cyan-300">57 lines of code</strong>, it triggered a legendary{" "}
                                    <strong className="text-amber-300">₹570 bounty</strong> from Sahitya. Now, every single merged line in{" "}
                                    <span className="text-emerald-400 font-medium">openSUSE & Uyuni</span> versus{" "}
                                    <span className="text-amber-400 font-medium">Checkstyle</span> contributes to this live running debt!
                                </p>
                            </div>
                        </div>

                        <a
                            href="https://github.com/openSUSE/news-o-o/pull/635"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono whitespace-nowrap transition-colors"
                        >
                            <span>Inspect PR #635</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* DETAILED PR LEDGER & SEARCH */}
                <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold font-display text-white">
                            The PR Ledger ({allPRs.length} Merged Pull Requests)
                        </h2>
                        <p className="text-xs text-neutral-400 font-mono mt-0.5">
                            Real-time additions, deletions, and cash bounties per PR
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="inline-flex rounded-xl p-1 bg-neutral-900/70 border border-white/10">
                        <button
                            onClick={() => setFilterAuthor("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                filterAuthor === "all" ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            All ({data.geetansh.prs.length + data.sahitya.prs.length})
                        </button>
                        <button
                            onClick={() => setFilterAuthor("geetansh")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                filterAuthor === "geetansh" ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30" : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Geetansh ({data.geetansh.prs.length})
                        </button>
                        <button
                            onClick={() => setFilterAuthor("sahitya")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                                filterAuthor === "sahitya" ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30" : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            Sahitya ({data.sahitya.prs.length})
                        </button>
                    </div>
                </div>

                {/* Search & Sort Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
                    <div className="sm:col-span-8 relative">
                        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by PR title, repository, or issue #..."
                            className="w-full bg-neutral-900/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2">
                        <span className="text-xs text-neutral-400 font-mono whitespace-nowrap">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-cyan-500/50"
                        >
                            <option value="lines">Lines Changed (High to Low)</option>
                            <option value="bounty">Bounty Value (₹ High to Low)</option>
                            <option value="date">Merged Date (Recent First)</option>
                        </select>
                    </div>
                </div>

                {/* PR Cards Grid */}
                <div className="space-y-3">
                    {allPRs.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl bg-neutral-900/30 border border-white/5">
                            <Code2 className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                            <p className="text-neutral-400 font-mono text-sm">No pull requests match your filter.</p>
                        </div>
                    ) : (
                        allPRs.map((pr) => {
                            const prLines = getPrLines(pr);
                            const prBounty = prLines * rate;
                            const isLegendary = pr.number === 635 && pr.repo.includes("news-o-o");

                            return (
                                <motion.div
                                    key={`${pr.repo}-${pr.number}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                                        isLegendary
                                            ? "bg-gradient-to-r from-emerald-950/40 to-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                            : pr.author === "geetansh"
                                            ? "bg-neutral-900/40 hover:bg-neutral-900/70 border-emerald-500/20 hover:border-emerald-500/40"
                                            : "bg-neutral-900/40 hover:bg-neutral-900/70 border-amber-500/20 hover:border-amber-500/40"
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {/* Author Badge */}
                                                <span
                                                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                        pr.author === "geetansh"
                                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                    }`}
                                                >
                                                    {pr.author === "geetansh" ? "Geetansh Goyal" : "Sahitya Singh"}
                                                </span>

                                                {/* Repository Badge */}
                                                <span className="text-xs font-mono text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                                    {pr.repo}
                                                </span>

                                                {/* Merged state */}
                                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                    <GitMerge className="w-3 h-3" />
                                                    #{pr.number}
                                                </span>

                                                {isLegendary && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/40 animate-pulse">
                                                        <Sparkles className="w-3 h-3 text-cyan-400" />
                                                        The 57 LOC Prompt Legend
                                                    </span>
                                                )}
                                            </div>

                                            {/* PR Title */}
                                            <a
                                                href={pr.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm sm:text-base font-semibold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5 group"
                                            >
                                                <span className="line-clamp-2">{pr.title}</span>
                                                <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </a>

                                            <div className="text-xs text-neutral-500 font-mono mt-1">
                                                Merged on {new Date(pr.merged_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                            </div>
                                        </div>

                                        {/* Lines & Bounty Badge */}
                                        <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                                            {/* LOC breakdown */}
                                            <div className="text-right font-mono">
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <span className="text-emerald-400">+{pr.additions}</span>
                                                    <span className="text-red-400">-{pr.deletions}</span>
                                                </div>
                                                <div className="text-xs font-bold text-neutral-300">
                                                    {prLines} lines
                                                </div>
                                            </div>

                                            {/* Cash Bounty */}
                                            <div
                                                className={`px-3 py-1.5 rounded-lg border font-mono text-right min-w-[90px] ${
                                                    pr.author === "geetansh"
                                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                                        : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                                }`}
                                            >
                                                <span className="text-[10px] text-neutral-400 block uppercase">Bounty</span>
                                                <span className="text-sm font-extrabold">₹{prBounty.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* FOOTER ACCORD SUMMARY */}
                <div className="mt-16 text-center border-t border-white/10 pt-8 text-neutral-500 text-xs font-mono">
                    <p>
                        DevForge Groupism Tracker • Automatic GitHub PR ingestion for <code className="text-neutral-400">geetxnshgoyal</code> & <code className="text-neutral-400">sahitya0xsingh</code>
                    </p>
                    <p className="mt-1">
                        Checked organizations: <span className="text-emerald-400">openSUSE</span>, <span className="text-cyan-400">uyuni-project</span>, <span className="text-amber-400">checkstyle</span>
                    </p>
                </div>
            </div>

            {/* MOCK UPI SETTLEMENT MODAL */}
            <AnimatePresence>
                {showUpiModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowUpiModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                                    <QrCode className="w-6 h-6" />
                                </div>

                                <h3 className="text-xl font-bold text-white">Settle Wager on UPI</h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Transfer the outstanding debt from {debtor} to {creditor}
                                </p>

                                <div className="my-5 p-4 rounded-xl bg-black/50 border border-white/10">
                                    <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-1">
                                        Settlement Amount
                                    </span>
                                    <span className="text-4xl font-extrabold font-mono text-amber-400">
                                        ₹{netDebtAmount.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-neutral-500 block mt-1 font-mono">
                                        ({diffLines.toLocaleString()} LOC difference @ ₹{rate}/line)
                                    </span>
                                </div>

                                {/* Mock QR Code visual */}
                                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl flex flex-col items-center justify-center shadow-lg mb-4">
                                    <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded flex flex-col items-center justify-center p-2 text-center text-black">
                                        <QrCode className="w-24 h-24 text-neutral-900" />
                                        <span className="text-[10px] font-mono font-bold text-neutral-600 mt-1">
                                            UPI://PAY?PA={creditor.toLowerCase()}@upi
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono mb-5">
                                    <span className="text-neutral-400">Payee UPI:</span>
                                    <span className="text-white font-bold">{creditor.toLowerCase()}@upi</span>
                                    <button
                                        onClick={handleCopyUpi}
                                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                    >
                                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copiedUpi ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowUpiModal(false)}
                                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono transition-colors"
                                >
                                    Close Settle Dialog
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
