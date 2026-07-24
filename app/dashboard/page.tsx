import { redirect } from "next/navigation";
import Link from "next/link";
import {
    FolderGit2,
    CalendarCheck,
    Trophy,
    ShieldCheck,
    Users,
    Compass,
    ArrowRight,
    Award,
    Star,
} from "lucide-react";
import { getMember, getSession } from "@/lib/session";
import { Avatar } from "@/components/ui/avatar";
import { PushToggle } from "@/components/pwa/push-toggle";
import { InstallButton } from "@/components/pwa/install-button";

export const metadata = { title: "Dashboard" };

const ROLE_LABEL: Record<string, string> = { admin: "Admin", mentor: "Mentor", member: "Member" };

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard");

    const member = await getMember(session.usn);
    if (!member) redirect("/login");

    const firstName = member.name.split(" ")[0];
    const elevated = member.role === "admin" || member.role === "mentor";
    const title = member.councilPosition ?? ROLE_LABEL[member.role] ?? "Member";
    const joinedYear = member.joinedAt ? new Date(member.joinedAt).getFullYear() : null;

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 sm:pt-28 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                {/* Hero */}
                <div className="glass-strong rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
                    <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
                    <div className="relative flex items-center gap-5">
                        <Avatar
                            src={`/api/members/${member.usn}/avatar`}
                            github={member.github}
                            alt={member.name}
                            size={72}
                            className="ring-2 ring-cyan-400/30 shrink-0"
                        />
                        <div className="min-w-0">
                            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-2.5 py-1 mb-2">
                                {member.councilPosition && <Star size={11} />}
                                {title}
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
                                Welcome back, <span className="text-cyan-400">{firstName}</span>
                            </h1>
                            <p className="text-sm text-neutral-400 mt-1 font-mono">{member.usn}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <Stat icon={<Star size={16} />} value={member.points ?? 0} label="Points" />
                    <Stat icon={<Award size={16} />} value={member.badges ?? 0} label="Badges" />
                    <Stat icon={<CalendarCheck size={16} />} value={joinedYear ?? "—"} label="Member since" />
                </div>

                {/* Quick actions */}
                <h2 className="text-xs uppercase tracking-wider text-neutral-500 mb-3 px-1">Quick actions</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                    <Action
                        href="/dashboard/projects"
                        icon={<FolderGit2 size={20} />}
                        title="Your projects"
                        body="Publish what you're building — pick a repo straight from GitHub."
                    />
                    <Action
                        href="/dashboard/explore"
                        icon={<Compass size={20} />}
                        title="Explore & collaborate"
                        body="Find projects across the club and ask to join a team."
                    />
                    <Action
                        href="/dashboard/events"
                        icon={<CalendarCheck size={20} />}
                        title="Sessions & RSVPs"
                        body="See what's coming up and reserve your spot."
                    />
                    <Action
                        href="/dashboard/members"
                        icon={<Users size={20} />}
                        title="Members"
                        body="Everyone in the club, with what they're working on."
                    />
                    <Action
                        href="/dashboard/leaderboard"
                        icon={<Trophy size={20} />}
                        title="Leaderboard"
                        body="Where you stand across the club this semester."
                    />
                    {elevated && (
                        <Action
                            href="/admin"
                            icon={<ShieldCheck size={20} />}
                            title="Admin"
                            body="Review membership requests, send announcements, manage the roster."
                            accent
                        />
                    )}
                </div>

                {/* App / notifications */}
                <div className="mt-8 glass rounded-2xl p-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <InstallButton />
                        <PushToggle />
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">
                        Install DevForge to use it like an app, and turn on notifications for new
                        sessions and club announcements.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Stat({
    icon,
    value,
    label,
    mono = true,
}: {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    mono?: boolean;
}) {
    return (
        <div className="glass rounded-2xl p-4 sm:p-5 text-center">
            <div className="inline-flex items-center justify-center text-cyan-400 mb-2">{icon}</div>
            <div
                className={`text-xl sm:text-3xl font-black text-white leading-tight truncate ${
                    mono ? "font-mono tabular-nums" : ""
                }`}
            >
                {value}
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider mt-1">{label}</div>
        </div>
    );
}

function Action({
    href,
    icon,
    title,
    body,
    accent = false,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    accent?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group glass glass-hover rounded-2xl p-5 sm:p-6 block relative ${
                accent ? "border-cyan-400/20" : ""
            }`}
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="inline-flex items-center justify-center p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
                    {icon}
                </div>
                <ArrowRight
                    size={18}
                    className="text-neutral-600 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
        </Link>
    );
}
