"use client";

import { Github, Linkedin, Trophy, Award } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { MemberCard } from "@/lib/members";

const ROLE_STYLES: Record<string, string> = {
    admin: "bg-cyan-400/10 text-cyan-300 border-cyan-400/25",
    mentor: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    member: "glass-subtle text-neutral-400 border-white/10",
};

export function ProfileCard({ member }: { member: MemberCard }) {
    return (
        <div className="glass glass-hover rounded-2xl p-5">
            <div className="flex items-start gap-4">
                <Avatar
                    src={member.hasPhoto ? `/api/members/${member.usn}/avatar` : undefined}
                    github={member.github}
                    alt={member.name}
                    size={56}
                    className="ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white truncate">{member.name}</h3>
                        <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                                ROLE_STYLES[member.role] ?? ROLE_STYLES.member
                            }`}
                        >
                            {member.role}
                        </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{member.usn}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                        <span className="inline-flex items-center gap-1.5">
                            <Trophy size={13} className="text-cyan-400" />
                            <span className="font-mono tabular-nums">{member.points}</span> pts
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Award size={13} className="text-cyan-400" />
                            <span className="font-mono tabular-nums">{member.badges}</span> badges
                        </span>
                    </div>
                </div>
            </div>

            {(member.github || member.linkedin) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                    {member.github && (
                        <SocialLink
                            href={`https://github.com/${member.github}`}
                            label={`${member.name} on GitHub`}
                        >
                            <Github size={14} />
                            <span className="truncate">{member.github}</span>
                        </SocialLink>
                    )}
                    {member.linkedin && (
                        <SocialLink href={member.linkedin} label={`${member.name} on LinkedIn`}>
                            <Linkedin size={14} />
                        </SocialLink>
                    )}
                </div>
            )}
        </div>
    );
}

function SocialLink({
    href,
    label,
    children,
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-cyan-300 glass-subtle rounded-full px-2.5 py-1 transition-colors min-w-0"
        >
            {children}
        </a>
    );
}
