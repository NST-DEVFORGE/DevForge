import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderGit2, CalendarCheck, Trophy, ShieldCheck } from "lucide-react";
import { getMember, getSession } from "@/lib/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

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
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
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
                        body="Publish what you're building and bring collaborators on board."
                    />
                    <Tile
                        href="/dashboard/events"
                        icon={<CalendarCheck size={20} />}
                        title="Sessions & RSVPs"
                        body="See what's coming up and reserve your spot."
                    />
                    <Tile
                        href="/leaderboard"
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
            <div className="text-xs text-neutral-400 uppercase tracking-wider">{label}</div>
        </div>
    );
}

/**
 * `ready: false` renders the tile as inert rather than a link. All four
 * destinations below are unbuilt — shipping them as links sent every click on
 * the dashboard to a 404, which is a worse first impression than saying so.
 * Flip a tile to `ready` when its route lands.
 */
function Tile({
    href,
    icon,
    title,
    body,
    ready = false,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    body: string;
    ready?: boolean;
}) {
    const inner = (
        <>
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="inline-flex items-center justify-center p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
                    {icon}
                </div>
                {!ready && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 border border-white/10 rounded-full px-2.5 py-1">
                        Coming soon
                    </span>
                )}
            </div>
            <h2 className={`text-lg font-bold mb-1 ${ready ? "text-white group-hover:text-cyan-300 transition-colors" : "text-neutral-300"}`}>
                {title}
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{body}</p>
        </>
    );

    if (!ready) {
        return (
            <div aria-disabled className="glass rounded-2xl p-6 opacity-60">
                {inner}
            </div>
        );
    }

    return (
        <Link href={href} className="group glass glass-hover rounded-2xl p-6 block">
            {inner}
        </Link>
    );
}
