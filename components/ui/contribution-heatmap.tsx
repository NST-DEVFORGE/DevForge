"use client";

import { buildContributionMatrix } from "@/lib/contribution-matrix";

export function ContributionHeatmap() {
    const { members, orgs, cells, maxCount } = buildContributionMatrix();

    if (members.length === 0 || orgs.length === 0) return null;

    const countFor = (member: string, org: string) =>
        cells.find((c) => c.member === member && c.org === org)?.count ?? 0;

    return (
        <div className="overflow-x-auto">
            <table className="border-separate" style={{ borderSpacing: 4 }}>
                <thead>
                    <tr>
                        <th className="text-left text-xs text-neutral-500 font-medium pr-3 pb-2 sticky left-0 bg-neutral-900/40">
                            Member
                        </th>
                        {orgs.map((org) => (
                            <th key={org} className="text-xs text-neutral-500 font-medium pb-2 px-1 whitespace-nowrap">
                                {org}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member}>
                            <td className="text-sm text-neutral-300 font-medium pr-3 whitespace-nowrap sticky left-0 bg-neutral-900/40">
                                {member}
                            </td>
                            {orgs.map((org) => {
                                const count = countFor(member, org);
                                const intensity = count / maxCount;
                                return (
                                    <td key={org} className="p-0">
                                        <div
                                            title={count > 0 ? `${member} → ${org}: ${count} PR${count === 1 ? "" : "s"}` : `${member} → ${org}: no recorded PRs`}
                                            className="w-10 h-10 rounded-md flex items-center justify-center text-xs font-mono tabular-nums"
                                            style={{
                                                background: count === 0 ? "rgba(255,255,255,0.03)" : `rgba(34, 211, 238,${0.15 + intensity * 0.65})`,
                                                color: intensity > 0.5 ? "#0a0407" : "#d4d4d4",
                                            }}
                                        >
                                            {count > 0 ? count : ""}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
