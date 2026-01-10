"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Award, Github, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface Milestone {
    name: string;
    count: number;
    emoji: string;
}

interface NextMilestone extends Milestone {
    progress: number;
}

interface MemberStats {
    name: string;
    github: string;
    role: string;
    avatar: string;
    prCount: number;
    milestones: Milestone[];
    nextMilestone: NextMilestone | null;
}

interface TeamStats {
    totalPRs: number;
    members: MemberStats[];
    teamMilestones: Milestone[];
    nextTeamMilestone: NextMilestone | null;
    lastUpdated: string;
}

export function PRStats() {
    const [stats, setStats] = useState<TeamStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/pr-stats');
                if (!response.ok) throw new Error('Failed to fetch PR stats');
                const data = await response.json();
                setStats(data);
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        // Initial fetch
        fetchStats();

        // Auto-refresh every 5 minutes (300000ms)
        const refreshInterval = setInterval(() => {
            fetchStats();
        }, 300000);

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400 text-lg">Loading PR statistics...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">⚠️ {error || 'Failed to load stats'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Sort members by PR count for leaderboard
    const sortedMembers = [...stats.members].sort((a, b) => b.prCount - a.prCount);

    return (
        <section className="py-24 bg-gradient-to-b from-black via-neutral-950 to-black">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        PR <span className="text-orange-500">Statistics</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Track our collective contributions and celebrate individual achievements
                    </p>
                </motion.div>

                {/* Combined Team Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="relative bg-gradient-to-br from-orange-500/10 to-purple-500/10 backdrop-blur-md border border-orange-500/30 rounded-3xl p-8 overflow-hidden">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-orange-500/5 animate-pulse"></div>

                        <div className="relative">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Trophy className="w-10 h-10 text-orange-500" />
                                <h2 className="text-4xl font-bold text-white">Club PRs</h2>
                            </div>

                            <div className="text-center mb-8">
                                <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 mb-2">
                                    {stats.totalPRs}
                                </div>
                                <p className="text-2xl text-neutral-300">Total Merged PRs</p>
                            </div>

                            {/* Team Milestones */}
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {stats.teamMilestones.map((milestone, index) => (
                                    <motion.div
                                        key={milestone.name}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="bg-neutral-900/50 border border-orange-500/50 rounded-xl px-6 py-3"
                                    >
                                        <div className="text-3xl mb-1">{milestone.emoji}</div>
                                        <div className="text-sm text-neutral-400">{milestone.name}</div>
                                        <div className="text-xs text-orange-500">{milestone.count} PRs</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Next Milestone Progress */}
                            {stats.nextTeamMilestone && (
                                <div className="max-w-2xl mx-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-neutral-400">Next: {stats.nextTeamMilestone.emoji} {stats.nextTeamMilestone.name}</span>
                                        <span className="text-orange-500 font-semibold">
                                            {stats.totalPRs} / {stats.nextTeamMilestone.count}
                                        </span>
                                    </div>
                                    <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats.nextTeamMilestone.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-orange-500 to-purple-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                        <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8 items-end">
                        {sortedMembers.slice(0, 3).length >= 3 && (() => {
                            // Reorder to show: 2nd, 1st, 3rd (classic podium)
                            const podiumOrder = [sortedMembers[1], sortedMembers[0], sortedMembers[2]];
                            const podiumColors = [
                                'from-gray-400/20 to-gray-500/20 border-gray-400/50',      // 2nd place
                                'from-yellow-500/20 to-orange-500/20 border-yellow-500/50', // 1st place
                                'from-orange-700/20 to-orange-800/20 border-orange-700/50'  // 3rd place
                            ];
                            const podiumEmojis = ['🥈', '🥇', '🥉'];
                            const podiumHeights = ['mt-8', 'mt-0', 'mt-12']; // 1st is tallest (no margin), 2nd medium, 3rd shortest

                            return podiumOrder.map((member, displayIndex) => {
                                if (!member) return null;

                                return (
                                    <motion.div
                                        key={member.github}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + displayIndex * 0.1 }}
                                        className={`relative ${podiumHeights[displayIndex]}`}
                                    >
                                        <div className={`bg-gradient-to-br ${podiumColors[displayIndex]} backdrop-blur-md border rounded-2xl p-6 text-center`}>
                                            <div className="text-5xl mb-2">{podiumEmojis[displayIndex]}</div>
                                            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500/50">
                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                            <p className="text-orange-500 text-sm mb-3">{member.role}</p>
                                            <div className="text-4xl font-bold text-white">{member.prCount}</div>
                                            <p className="text-neutral-400 text-sm">PRs Merged</p>
                                        </div>
                                    </motion.div>
                                );
                            });
                        })()}
                    </div>
                </motion.div>

                {/* Milestone Rewards Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Award className="w-8 h-8 text-orange-500" />
                        <h2 className="text-3xl font-bold text-white">Milestone Rewards</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Individual Rewards */}
                        <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎯</span> Individual Milestones
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50">
                                    <span className="text-white font-semibold">🌱 Beginner</span>
                                    <span className="text-green-400 font-semibold">5 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/50 ring-2 ring-blue-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🪪 Contributor</span>
                                        <span className="text-blue-400 text-sm">🎁 ID Card!</span>
                                    </div>
                                    <span className="text-blue-400 font-bold">15 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg border border-orange-500/50 ring-2 ring-orange-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">👕 Active</span>
                                        <span className="text-orange-400 text-sm">🎁 T-shirt!</span>
                                    </div>
                                    <span className="text-orange-400 font-bold">25 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/50 ring-2 ring-yellow-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🏅 Champion</span>
                                        <span className="text-yellow-400 text-sm">🎁 Swag Kit!</span>
                                    </div>
                                    <span className="text-yellow-400 font-bold">50 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 ring-2 ring-purple-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">👑 Legend</span>
                                        <span className="text-purple-400 text-sm">🎁 Tech Gadget!</span>
                                    </div>
                                    <span className="text-purple-400 font-bold">100 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/50 ring-2 ring-red-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🚀 Master</span>
                                        <span className="text-red-400 text-sm">🎁 Premium Prize!</span>
                                    </div>
                                    <span className="text-red-400 font-bold">200 PRs</span>
                                </div>
                            </div>
                        </div>

                        {/* Club Rewards */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-orange-500/10 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">🏆</span> Club Milestones
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-700/20 to-orange-700/20 rounded-lg border border-amber-700/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🥉 Bronze</span>
                                        <span className="text-amber-400 text-sm">🍫 Chocolate Party!</span>
                                    </div>
                                    <span className="text-purple-500 font-semibold">50 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-lg border border-gray-400/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🥈 Silver</span>
                                        <span className="text-gray-300 text-sm">🎂 Cake Party!</span>
                                    </div>
                                    <span className="text-purple-500 font-semibold">100 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🥇 Gold</span>
                                        <span className="text-yellow-400 text-sm">🍕 Pizza Party!</span>
                                    </div>
                                    <span className="text-purple-500 font-semibold">250 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">💎 Platinum</span>
                                        <span className="text-cyan-400 text-sm">🎉 Team Outing!</span>
                                    </div>
                                    <span className="text-purple-500 font-semibold">500 PRs</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 ring-2 ring-purple-500/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">🏆 Diamond</span>
                                        <span className="text-purple-400 text-sm">🎊 Grand Celebration!</span>
                                    </div>
                                    <span className="text-purple-400 font-bold">1000 PRs</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                <p className="text-sm text-neutral-400 text-center">
                                    Club rewards bring us together! 🎉
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Individual Member Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Users className="w-8 h-8 text-orange-500" />
                        <h2 className="text-3xl font-bold text-white">Individual Stats</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedMembers.map((member, index) => (
                            <motion.div
                                key={member.github}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group"
                            >
                                <div className="relative bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:border-orange-500/50 transition-all duration-300 h-full">
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative">
                                        {/* Profile */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/30">
                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                                <p className="text-sm text-orange-500">{member.role}</p>
                                            </div>
                                        </div>

                                        {/* PR Count */}
                                        <div className="text-center mb-6 py-4 bg-neutral-800/50 rounded-xl">
                                            <div className="text-5xl font-bold text-orange-500 mb-1">{member.prCount}</div>
                                            <p className="text-neutral-400">Merged PRs</p>
                                        </div>

                                        {/* Milestones */}
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Award className="w-4 h-4 text-orange-500" />
                                                <h4 className="text-sm font-semibold text-neutral-300">Achievements</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {member.milestones.map((milestone) => (
                                                    <div
                                                        key={milestone.name}
                                                        className={`${milestone.count === 15
                                                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
                                                            : milestone.count === 25
                                                                ? 'bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/50 ring-2 ring-orange-500/30'
                                                                : 'bg-neutral-800/50 border-orange-500/30'
                                                            } border rounded-lg px-3 py-1 text-xs`}
                                                        title={
                                                            milestone.count === 15
                                                                ? `${milestone.name}: ${milestone.count} PRs - Club ID Card Unlocked! 🪪`
                                                                : milestone.count === 25
                                                                    ? `${milestone.name}: ${milestone.count} PRs - Club T-shirt Unlocked! 👕`
                                                                    : `${milestone.name}: ${milestone.count} PRs`
                                                        }
                                                    >
                                                        <span className="mr-1">{milestone.emoji}</span>
                                                        <span className={
                                                            milestone.count === 15
                                                                ? 'text-blue-400 font-semibold'
                                                                : milestone.count === 25
                                                                    ? 'text-orange-400 font-semibold'
                                                                    : 'text-neutral-400'
                                                        }>
                                                            {milestone.name}
                                                        </span>
                                                        {milestone.count === 15 && <span className="ml-1 text-blue-400">🎁</span>}
                                                        {milestone.count === 25 && <span className="ml-1 text-orange-400">🎁</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Next Milestone */}
                                        {member.nextMilestone && (
                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-neutral-400">
                                                        Next: {member.nextMilestone.emoji} {member.nextMilestone.name}
                                                    </span>
                                                    <span className="text-xs text-orange-500 font-semibold">
                                                        {member.prCount} / {member.nextMilestone.count}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-purple-500 transition-all duration-500"
                                                        style={{ width: `${member.nextMilestone.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* GitHub Link */}
                                        <a
                                            href={`https://github.com/${member.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 hover:border-orange-500/50 rounded-lg transition-all duration-200 text-neutral-400 hover:text-orange-500"
                                        >
                                            <Github className="w-4 h-4" />
                                            <span className="text-sm">View Profile</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12 text-neutral-500 text-sm"
                >
                    Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                </motion.div>
            </div>
        </section>
    );
}
