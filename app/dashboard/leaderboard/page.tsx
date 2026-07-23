import { Trophy, Award, Medal } from "lucide-react";
import { loadRoster } from "@/lib/members";
import { Avatar } from "@/components/ui/avatar";

export const metadata = { title: "Leaderboard" };

/** Bronze/silver/gold are semantic, so they stay fixed across themes. */
const PODIUM = ["text-yellow-400", "text-neutral-300", "text-amber-600"];

export default async function LeaderboardPage() {
    const members = await loadRoster();
    const ranked = members.filter((m) => m.points > 0 || m.badges > 0);
    const unranked = members.length - ranked.length;

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <Trophy size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Leader<span className="text-cyan-400">board</span>
                    </h1>
                    <p className="text-neutral-400">
                        {ranked.length === 0
                            ? "Nobody has points yet — the season is wide open."
                            : `${ranked.length} member${ranked.length === 1 ? "" : "s"} on the board.`}
                    </p>
                </div>

                {ranked.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center">
                        <p className="text-neutral-400">No points awarded yet.</p>
                        <p className="text-sm text-neutral-600 mt-1">
                            Ship projects and show up to sessions to get on the board.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {ranked.map((member, index) => (
                            <div
                                key={member.usn}
                                className={`flex items-center gap-4 rounded-2xl p-4 ${
                                    index < 3 ? "glass-strong" : "glass glass-hover"
                                }`}
                            >
                                <div className="w-8 flex-shrink-0 text-center">
                                    {index < 3 ? (
                                        <Medal size={20} className={`mx-auto ${PODIUM[index]}`} />
                                    ) : (
                                        <span className="text-sm font-mono tabular-nums text-neutral-600">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                <Avatar
                                    src={member.hasPhoto ? `/api/members/${member.usn}/avatar` : undefined}
                                    github={member.github}
                                    alt={member.name}
                                    size={40}
                                    className="ring-1 ring-white/10"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-white truncate">{member.name}</p>
                                    <p className="text-xs text-neutral-500 font-mono">{member.usn}</p>
                                </div>

                                <div className="flex items-center gap-4 flex-shrink-0 text-sm">
                                    <span className="inline-flex items-center gap-1.5 text-neutral-400">
                                        <Award size={14} className="text-cyan-400" />
                                        <span className="font-mono tabular-nums">{member.badges}</span>
                                    </span>
                                    <span className="font-mono tabular-nums font-bold text-white w-12 text-right">
                                        {member.points}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {unranked > 0 && ranked.length > 0 && (
                    <p className="text-xs text-neutral-600 mt-6 text-center">
                        {unranked} member{unranked === 1 ? "" : "s"} not on the board yet.
                    </p>
                )}
            </div>
        </div>
    );
}
