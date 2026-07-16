import { Award, Scale } from "lucide-react";
import { rewardLadders, rewardPrinciples } from "@/data/rewards";

export const metadata = {
    title: "Rewards & Recognition | DevForge",
    description: "What achievement earns at DevForge — prizes, badges, and earned leeway. Public, predictable, no favorites.",
};

export default function RewardsPage() {
    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-cyan-400/10 text-cyan-400 rounded-full mb-6 border border-cyan-400/20">
                        <Award size={32} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                        Rewards & <span className="text-cyan-400">Leeway</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                        Achieve visibly, earn more than prizes: flexibility, priority, and trust. Everything below is public and predictable — no favorites.
                    </p>
                </div>

                {/* Principles */}
                <div className="glass rounded-2xl p-6 mb-14">
                    <h2 className="font-bold text-white flex items-center gap-2 mb-4"><Scale size={18} className="text-cyan-400" /> How it works</h2>
                    <ul className="space-y-2">
                        {rewardPrinciples.map((p) => (
                            <li key={p} className="flex items-start gap-3 text-sm text-neutral-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Ladders */}
                <div className="space-y-12">
                    {rewardLadders.map((ladder) => (
                        <section key={ladder.title}>
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold text-white">
                                    <span className="mr-2">{ladder.emoji}</span>
                                    {ladder.title}
                                </h2>
                                <p className="text-sm text-neutral-500 mt-1">{ladder.description}</p>
                            </div>
                            <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                                <table className="w-full text-sm min-w-[640px]">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
                                            <th className="px-4 py-3">Achievement</th>
                                            <th className="px-4 py-3">Bar</th>
                                            <th className="px-4 py-3">Reward</th>
                                            <th className="px-4 py-3">Leeway earned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ladder.tiers.map((tier) => (
                                            <tr key={tier.achievement} className="border-b border-neutral-800/60 last:border-b-0 align-top">
                                                <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{tier.achievement}</td>
                                                <td className="px-4 py-3 text-cyan-300 font-mono text-xs whitespace-nowrap">{tier.threshold}</td>
                                                <td className="px-4 py-3 text-neutral-300">{tier.reward}</td>
                                                <td className="px-4 py-3 text-neutral-400">
                                                    {tier.privilege ? (
                                                        <span className="text-green-400/90">{tier.privilege}</span>
                                                    ) : (
                                                        <span className="text-neutral-600">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ))}
                </div>

                <p className="text-xs text-neutral-600 text-center mt-12 max-w-xl mx-auto">
                    Club-level milestones (chocolate/cake/pizza parties at 50/100/250 quality PRs, and beyond) stay on the PR Stats page — those are team rewards, this page is individual.
                </p>
            </div>
        </div>
    );
}
