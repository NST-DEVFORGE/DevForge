"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Star, ExternalLink, GitMerge, Users, GitBranch, Globe2, Activity, Medal } from "lucide-react";
import prData from "../../pr-data-report.json";
import gssocSnapshot from "../../data/gssoc-snapshot.json";

export default function OpenSourceImpact() {
    // Build top GSSoC achievers sorted by rank (from real snapshot)
    const topGSSoC = [...gssocSnapshot.members]
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 4);

    // Build top contributors by merging pr-data-report and gssoc-snapshot
    const allMembersMap = new Map();
    
    prData.members.forEach(m => {
        allMembersMap.set(m.github?.toLowerCase() || m.name?.toLowerCase(), m);
    });

    // Name mapping for GSSoC-only members (snapshot only has github handles)
    const gssocNameMap: Record<string, string> = {
        'zenowinged': 'Dhruv Mehta',
        'mahaveerjain-18': 'Mahaveer Jain',
        'layyzyyy': 'Lay Shah',
        'adhikaryrachana00428-hash': 'Rachana Adhikary',
        'shreyaagrawal29': 'Shreya Agrawal',
        'ravisharma-09': 'Ravi Sharma',
        '2102508725-hash': 'Navya Krushi',
        'anushkag6393': 'Anushka Gupta',
        'abhi-lab645': 'Abhinav',
        'shivansh-ux-ys': 'Shivansh Goel',
    };

    gssocSnapshot.members.forEach(m => {
        const anyM = m as any;
        const key = m.github?.toLowerCase();
        if (key && !allMembersMap.has(key)) {
            allMembersMap.set(key, {
                name: gssocNameMap[key] || anyM.name || m.github,
                github: m.github,
                avatar: `https://github.com/${m.github}.png`,
                allPRs: { merged: anyM.merged_prs || anyM.prs || 0 }
            });
        }
    });

    const topContributors = Array.from(allMembersMap.values())
        .sort((a, b) => (b.allPRs?.merged || 0) - (a.allPRs?.merged || 0));

    // Total PRs including ESoC contributions (pr-data-report only tracks partial data)
    const totalMergedPRs = 280;
    const totalContributors = topContributors.length;

    const findMember = (nameQuery: string, fallback: any) => 
        prData.members.find(m => m.name?.toLowerCase().includes(nameQuery.toLowerCase())) || fallback;

    const geetansh = findMember("Geetansh", { name: "Geetansh Goyal", allPRs: { merged: 47 }, avatar: "https://github.com/geetxnshgoyal.png", github: "geetxnshgoyal" });
    const nishtha = findMember("Nishtha", { name: "Nishtha Agarwal", allPRs: { merged: 69 }, avatar: "https://github.com/nishtha-agarwal-211.png", github: "nishtha-agarwal-211" });
    const dhiraj = findMember("Dhiraj", { name: "Dhiraj Rathod", allPRs: { merged: 28 }, avatar: "https://github.com/dhiraj-143r.png", github: "dhiraj-143r" });

    const podiumData = [
        { 
            name: geetansh.name, 
            place: 2, 
            quality: 15, 
            merged: geetansh.allPRs.merged, 
            avatar: geetansh.avatar || `https://github.com/${geetansh.github}.png`, 
            color: "text-neutral-300", 
            bg: "bg-neutral-800", 
            ring: "ring-neutral-400" 
        },
        { 
            name: nishtha.name, 
            place: 1, 
            quality: 20, 
            merged: nishtha.allPRs.merged, 
            avatar: nishtha.avatar || `https://github.com/${nishtha.github}.png`, 
            color: "text-yellow-400", 
            bg: "bg-yellow-900/20", 
            ring: "ring-yellow-500" 
        },
        { 
            name: dhiraj.name, 
            place: 3, 
            quality: 10, 
            merged: dhiraj.allPRs.merged, 
            avatar: dhiraj.avatar || `https://github.com/${dhiraj.github}.png`, 
            color: "text-orange-600", 
            bg: "bg-orange-900/20", 
            ring: "ring-orange-600" 
        }
    ];

    // Monthly PR activity data (hardcoded from actual contribution timeline)
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const monthCounts = [18, 35, 52, 68, 55, 52];
    const maxCount = Math.max(...monthCounts);

    // Organizations Graph data (hardcoded with correct PR counts including ESoC)
    const topOrgs = [
        { org: 'openSUSE', count: 24 },
        { org: 'OpenFood', count: 22 },
        { org: 'zulip', count: 18 },
        { org: 'Mozilla', count: 15 },
        { org: 'GirlScript', count: 14 },
        { org: 'GitLab', count: 10 },
    ];
    const maxOrgCount = Math.max(...topOrgs.map(o => o.count));




    return (
        <div className="min-h-screen pt-24 pb-16 relative">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 text-orange-500 rounded-full mb-8 border border-orange-500/20">
                        <Globe2 size={32} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">Impact</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                        Real-time analytics and visualizations of our growing open source footprint across the globe.
                    </p>
                </motion.div>

                {/* Top Metrics - As explicitly requested */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { title: "Total Contributors", value: "25+", icon: <Users size={24} className="text-blue-500" /> },
                        { title: "Total PRs", value: "280+", icon: <GitBranch size={24} className="text-purple-500" /> },
                        { title: "Quality PRs", value: "60+", icon: <Activity className="text-green-500" size={24} /> },
                        { title: "Open Source Orgs", value: "15+", icon: <Globe2 className="text-orange-500" size={24} /> }
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-3xl text-center backdrop-blur-sm shadow-xl hover:border-orange-500/30 transition-colors cursor-default"
                        >
                            <div className="flex justify-center mb-4">{metric.icon}</div>
                            <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                            <div className="text-neutral-500 font-medium uppercase tracking-wider text-sm">{metric.title}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Graphs Section */}
                <div className="grid lg:grid-cols-2 gap-6 mb-24">
                    {/* Activity Graph Bar */}
                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl backdrop-blur-md hover:border-orange-500/20 transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Activity className="text-orange-500" /> Monthly Activity
                            </h3>
                            <div className="text-sm text-neutral-400">Total Merged PRs</div>
                        </div>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {monthCounts.map((count, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 h-full group">
                                    <div className="w-full relative flex justify-center h-full items-end">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${(count / maxCount) * 100}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                            className="w-full max-w-[3rem] bg-gradient-to-t from-orange-600/20 to-orange-500/80 rounded-t-xl relative group-hover:from-orange-500/40 group-hover:to-orange-400 transition-colors cursor-pointer"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-neutral-800 shadow-xl z-20">
                                                {count} PRs
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-neutral-400 text-xs font-medium mt-4">{months[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Organizations Graph */}
                    <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl backdrop-blur-md hover:border-blue-500/20 transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Globe2 className="text-blue-500" /> Top Organizations
                            </h3>
                            <div className="text-sm text-neutral-400">PRs per Org</div>
                        </div>
                        <div className="flex items-end justify-between h-48 gap-2">
                            {topOrgs.map(({ org, count }, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 h-full group">
                                    <div className="w-full relative flex justify-center h-full items-end">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${(count / maxOrgCount) * 100}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                            className="w-full max-w-[3rem] bg-gradient-to-t from-blue-600/20 to-blue-500/80 rounded-t-xl relative group-hover:from-blue-500/40 group-hover:to-blue-400 transition-colors cursor-pointer"
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-neutral-800 shadow-xl z-20">
                                                {count} PRs
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-neutral-400 text-xs font-medium mt-4 truncate w-full text-center" title={org}>{org}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Podium */}
                <div className="mb-24 mt-16">
                    <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" /> Top Open Source Contributors
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
                        {podiumData.map((user, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className={`flex flex-col items-center bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md relative ${user.place === 1 ? 'md:-translate-y-8 z-10 shadow-2xl shadow-yellow-500/10 border-yellow-500/20' : ''}`}
                            >
                                <Medal className={`mb-4 ${user.color}`} size={32} />
                                <div className={`text-5xl font-black mb-6 ${user.color}`}>{user.place}</div>
                                
                                <div className={`w-32 h-32 rounded-full p-1 ring-4 ${user.ring} mb-6`}>
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                
                                <h4 className="text-2xl font-bold text-white mb-1 text-center">{user.name}</h4>
                                <div className="text-orange-500 font-medium mb-8">Member</div>
                                
                                <div className="w-full space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white mb-1">{user.quality}</div>
                                        <div className="text-neutral-500 text-sm uppercase tracking-wider">Quality PRs</div>
                                    </div>
                                    <div className="w-full h-px bg-neutral-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">{user.merged}</div>
                                        <div className="text-neutral-500 text-sm uppercase tracking-wider">Total Merged</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>



                {/* Hall of Fame List */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-white text-center mb-12">
                        Open Source <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">Hall of Fame</span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topContributors.map((contributor, i) => (
                            <motion.div
                                key={contributor.github}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -5 }}
                            >
                                <a
                                    href={`https://github.com/${contributor.github}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block h-full bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all duration-300"
                                >
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-orange-500 transition-colors">
                                        <img
                                            src={contributor.avatar || `https://github.com/${contributor.github}.png`}
                                            alt={contributor.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-lg font-bold text-white mb-1 truncate">{contributor.name}</h4>
                                        <p className="text-neutral-500 text-xs mb-3">@{contributor.github}</p>
                                        <div className="inline-flex items-center justify-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-3 py-1.5 rounded-full">
                                            <GitMerge size={13} />
                                            {contributor.allPRs.merged} PRs
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
