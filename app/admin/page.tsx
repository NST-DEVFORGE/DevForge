import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowRight } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession, getMember, type MemberRecord } from "@/lib/session";
import { can, canAccessAdminArea } from "@/lib/permissions";
import type { AdminMemberRow } from "@/app/api/admin/members/route";
import { MemberRow } from "@/components/admin/member-row";
import { NotifyComposer } from "@/components/admin/notify-composer";

export const metadata = { title: "Admin" };

type StoredMember = MemberRecord & {
    note?: string;
    requestedAt?: string;
    joinedAt?: string;
    passwordChangedAt?: string;
};

export default async function AdminPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/admin");

    // Powers come from the council position, read live. Only people who can
    // manage members or send announcements have anything to do here.
    const me = await getMember(session.usn);
    if (!me || me.status !== "approved" || !canAccessAdminArea(me)) {
        redirect("/dashboard");
    }

    const canManageMembers = can(me, "members:manage");
    const canManageRoles = can(me, "roles:manage");
    const canAnnounce = can(me, "announcements:send");

    // Only read the roster if this person actually manages members.
    let pending: AdminMemberRow[] = [];
    let approved: AdminMemberRow[] = [];
    let rejected: AdminMemberRow[] = [];
    if (canManageMembers) {
        const snap = await club<StoredMember>(COLLECTIONS.members).get();
        const rows: AdminMemberRow[] = snap.docs.map((d) => {
            const m = d.data();
            return {
                usn: m.usn,
                name: m.name,
                email: m.email,
                role: m.role,
                status: m.status,
                note: m.note,
                requestedAt: m.requestedAt,
                joinedAt: m.joinedAt,
                hasSignedIn: Boolean(m.passwordChangedAt),
            };
        });
        pending = rows.filter((r) => r.status === "pending");
        approved = rows.filter((r) => r.status === "approved").sort((a, b) => a.name.localeCompare(b.name));
        rejected = rows.filter((r) => r.status === "rejected");
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Club <span className="text-cyan-400">admin</span>
                    </h1>
                    <p className="text-neutral-400">
                        {me.councilPosition ?? "Elevated access"}, you can{" "}
                        {[canManageMembers && "manage members", canAnnounce && "send announcements"]
                            .filter(Boolean)
                            .join(" and ")}
                        .
                    </p>
                </div>

                {canManageMembers && (
                    <Link
                        href="/admin/offer-letters"
                        className="group flex items-center justify-between gap-4 glass glass-hover rounded-2xl p-5 mb-10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center justify-center p-2.5 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
                                <FileText size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-white">Send offer letters</h2>
                                <p className="text-xs text-neutral-400">
                                    Issue an official membership offer PDF to a selected candidate.
                                </p>
                            </div>
                        </div>
                        <ArrowRight
                            size={18}
                            className="text-neutral-600 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all"
                        />
                    </Link>
                )}

                {canAnnounce && (
                    <section className="mb-10">
                        <NotifyComposer />
                    </section>
                )}

                {canManageMembers && (
                <>

                {pending.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                            Waiting for review
                        </h2>
                        <div className="space-y-2">
                            {pending.map((member) => (
                                <MemberRow key={member.usn} member={member} isSelf={member.usn === me.usn} canManageRoles={canManageRoles} />
                            ))}
                        </div>
                        <p className="text-xs text-neutral-600 mt-3">
                            Approving generates a password and emails it. Their name and email come from
                            the student portal, so there is nothing to check by hand.
                        </p>
                    </section>
                )}

                <section>
                    <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                        Members ({approved.length})
                    </h2>
                    <div className="space-y-2">
                        {approved.map((member) => (
                            <MemberRow key={member.usn} member={member} isSelf={member.usn === me.usn} />
                        ))}
                    </div>
                </section>

                {rejected.length > 0 && (
                    <section className="mt-10 opacity-60">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                            Declined ({rejected.length})
                        </h2>
                        <div className="space-y-2">
                            {rejected.map((member) => (
                                <MemberRow key={member.usn} member={member} isSelf={false} canManageRoles={canManageRoles} />
                            ))}
                        </div>
                    </section>
                )}
                </>
                )}
            </div>
        </div>
    );
}
