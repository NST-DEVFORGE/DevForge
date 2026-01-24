"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, GitMerge, GitPullRequest, XCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface PR {
    title: string;
    url: string;
    repo: string;
    number: number;
    date: string;
    state: 'merged' | 'open' | 'closed';
    isGsoc: boolean;
}

interface OrgStats {
    org: string;
    merged: number;
    open: number;
    closed: number;
    total: number;
    prs: PR[];
}

interface MemberData {
    name: string;
    github: string;
    merged: number;
    open: number;
    closed: number;
    gsocMerged: number;
    gsocOpen: number;
    gsocClosed: number;
    gsocPRs: PR[];
    orgBreakdown: OrgStats[];
}

interface BreakdownData {
    summary: {
        merged: number;
        open: number;
        closed: number;
        total: number;
        gsocMerged: number;
        gsocOpen: number;
        gsocClosed: number;
        gsocTotal: number;
    };
    members: MemberData[];
    lastUpdated: string;
}

export function GsocStats() {
    const [data, setData] = useState<BreakdownData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<string>('all');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/pr-breakdown');
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400 text-lg">Loading GSoC data...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">⚠️ {error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const filteredGsocPRs = selectedMember === 'all'
        ? data.members.flatMap(m => m.gsocPRs)
        : data.members.find(m => m.github === selectedMember)?.gsocPRs || [];

    return (
        <section className="py-24 bg-gradient-to-b from-black via-neutral-950 to-black min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        <span className="text-orange-500">GSoC</span> Ready
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        PR bifurcation for Google Summer of Code eligible organizations
                    </p>
                </motion.div>

                {/* Overall Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-6 mb-12"
                >
                    {/* All PRs Summary */}
                    <div className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <GitPullRequest className="w-6 h-6 text-blue-400" />
                            All PRs
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <GitMerge className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-green-500">{data.summary.merged}</div>
                                <p className="text-neutral-400 text-sm">Merged</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                                <GitPullRequest className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-yellow-500">{data.summary.open}</div>
                                <p className="text-neutral-400 text-sm">Open</p>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-red-500">{data.summary.closed}</div>
                                <p className="text-neutral-400 text-sm">Closed</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-4xl font-bold text-white">{data.summary.total}</span>
                            <span className="text-neutral-400 ml-2">Total PRs</span>
                        </div>
                    </div>

                    {/* GSoC PRs Summary */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-orange-500" />
                            GSoC Org PRs
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <GitMerge className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-green-500">{data.summary.gsocMerged}</div>
                                <p className="text-neutral-400 text-sm">Merged</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                                <GitPullRequest className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-yellow-500">{data.summary.gsocOpen}</div>
                                <p className="text-neutral-400 text-sm">Open</p>
                            </div>
                            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                <div className="text-3xl font-bold text-red-500">{data.summary.gsocClosed}</div>
                                <p className="text-neutral-400 text-sm">Closed</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500">{data.summary.gsocTotal}</span>
                            <span className="text-neutral-400 ml-2">GSoC PRs</span>
                        </div>
                    </div>
                </motion.div>

                {/* Per-Member Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Member Breakdown</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-700">
                                    <th className="py-4 px-4 text-neutral-400 font-medium">Member</th>
                                    <th className="py-4 px-2 text-center text-green-500">Merged</th>
                                    <th className="py-4 px-2 text-center text-yellow-500">Open</th>
                                    <th className="py-4 px-2 text-center text-red-500">Closed</th>
                                    <th className="py-4 px-2 text-center text-orange-500">GSoC M</th>
                                    <th className="py-4 px-2 text-center text-orange-400">GSoC O</th>
                                    <th className="py-4 px-2 text-center text-orange-300">GSoC C</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.members.filter(m => m.merged + m.open + m.closed > 0).map((member, i) => (
                                    <motion.tr
                                        key={member.github}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="border-b border-neutral-800 hover:bg-neutral-900/50"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <a href={`https://github.com/${member.github}`} target="_blank" className="text-white hover:text-orange-500 font-medium">
                                                    {member.name}
                                                </a>
                                                <span className="text-neutral-500 text-sm">@{member.github}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-center text-green-500 font-semibold">{member.merged}</td>
                                        <td className="py-4 px-2 text-center text-yellow-500 font-semibold">{member.open}</td>
                                        <td className="py-4 px-2 text-center text-red-500 font-semibold">{member.closed}</td>
                                        <td className="py-4 px-2 text-center text-orange-500 font-bold">{member.gsocMerged}</td>
                                        <td className="py-4 px-2 text-center text-orange-400 font-bold">{member.gsocOpen}</td>
                                        <td className="py-4 px-2 text-center text-orange-300 font-bold">{member.gsocClosed}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* GSoC PR List */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-white">GSoC PRs Detail</h2>
                        <select
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-lg"
                        >
                            <option value="all">All Members</option>
                            {data.members.filter(m => m.gsocPRs.length > 0).map(m => (
                                <option key={m.github} value={m.github}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {filteredGsocPRs.map((pr, i) => (
                            <motion.a
                                key={pr.url}
                                href={pr.url}
                                target="_blank"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.03 }}
                                className="block bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/50 rounded-xl p-4 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {pr.state === 'merged' && <GitMerge className="w-5 h-5 text-green-500" />}
                                            {pr.state === 'open' && <GitPullRequest className="w-5 h-5 text-yellow-500" />}
                                            {pr.state === 'closed' && <XCircle className="w-5 h-5 text-red-500" />}
                                            <span className={`text-xs px-2 py-1 rounded ${pr.state === 'merged' ? 'bg-green-500/20 text-green-400' :
                                                pr.state === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {pr.state.toUpperCase()}
                                            </span>
                                            <span className="text-neutral-500 text-sm">{pr.repo}#{pr.number}</span>
                                        </div>
                                        <h4 className="text-white font-medium">{pr.title}</h4>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-neutral-500" />
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {filteredGsocPRs.length === 0 && (
                        <p className="text-neutral-400 text-center py-8">No GSoC PRs found</p>
                    )}
                </motion.div>

                <div className="text-center text-neutral-500 text-sm mt-12">
                    Last updated: {new Date(data.lastUpdated).toLocaleString()}
                </div>
            </div>
        </section>
    );
}
