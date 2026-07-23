import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderGit2, CalendarCheck, Trophy, ShieldCheck, Users } from "lucide-react";
import { getMember, getSession } from "@/lib/session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PushToggle } from "@/components/pwa/push-toggle";

export const metadata = { title: "Dashboard" };

const ROLE_LABEL: Record<string, string> = {
    admin: "Admin",
    mentor: "Mentor",
    member: "Member",
};

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard");

    const member = await getMember(session.usn);
    if (!member) redirect("/login");

    const firstName = member.name.split(" ")[0];
    const elevated = member.role === "admin" || member.role === "mentor";

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                            {ROLE_LABEL[member.role] ?? "Member"} · {member.usn}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Welcome back, <span className="text-cyan-400">{firstName}</span>
                        </h1>
                    </div>
                    <SignOutButton />
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-10">
                    <Stat value={member.points ?? 0} label="Points" />
                    <Stat value={member.badges ?? 0} label="Badges" />
                    <Stat value={ROLE_LABEL[member.role] ?? "Member"} label="Role" mono={false} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <Tile
                        href="/dashboard/projects"
                        icon={<FolderGit2 size={20} />}
                        title="Your projects"
                        body="Publish what you're building — pick a repo straight from GitHub."
                    />
                    <Tile
                        href="/dashboard/events"
                        icon={<CalendarCheck size={20} />}
                        title="Sessions & RSVPs"
                        body="See what's coming up and reserve your spot."
                    />
                    <Tile
                        href="/dashboard/members"
                        icon={<Users size={20} />}
                        title="Members"
                        body="Everyone in the club, with what they're working on."
                    />
                    <Tile
                        href="/dashboard/leaderboard"
                        icon={<Trophy size={20} />}
                        title="Leaderboard"
                        body="Where you stand across the club this semester."
                    />
                    {elevated && (
                        <Tile
                            href="/admin"
                            icon={<ShieldCheck size={20} />}
                            title="Admin"
                            body="Review membership requests and manage the roster."
                        />
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <PushToggle />
                    <p className="text-xs text-neutral-600 mt-2">
                        Get told about new sessions and club announcements. Install DevForge from your
                        browser menu to use it like an app.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Stat({ value, label, mono = true }: { value: string | number; label: string; mono?: boolean }) {
    return (
        <div className="glass glass-hover rounded-2xl p-5 text-center">
            <div className={`text-3xl font-black text-white mb-1 ${mono ? "font-mono tabular-nums" : ""}`}>
                {value}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function Tile({
    href,
    icon,
    title,
    body,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <Link href={href} className="group glass glass-hover rounded-2xl p-6 block">
            <div className="inline-flex items-center justify-center p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl mb-4 border border-cyan-400/20">
                {icon}
            </div>
            <h2 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {title}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
        </Link>
    );
}
