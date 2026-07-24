import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession, getMember, type MemberRecord } from "@/lib/session";
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

    // proxy.ts redirects non-admins, but this page reads the live record rather
    // than trusting the token's role claim.
    const me = await getMember(session.usn);
    if (!me || me.status !== "approved" || (me.role !== "admin" && me.role !== "mentor")) {
        redirect("/dashboard");
    }

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

    const pending = rows.filter((r) => r.status === "pending");
    const approved = rows
        .filter((r) => r.status === "approved")
        .sort((a, b) => a.name.localeCompare(b.name));
    const rejected = rows.filter((r) => r.status === "rejected");

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
                        {pending.length > 0
                            ? `${pending.length} request${pending.length === 1 ? "" : "s"} waiting.`
                            : "No requests waiting."}
                    </p>
                </div>

                <section className="mb-10">
                    <NotifyComposer />
                </section>

                {pending.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-xs uppercase tracking-wider text-neutral-600 mb-3">
                            Waiting for review
                        </h2>
                        <div className="space-y-2">
                            {pending.map((member) => (
                                <MemberRow key={member.usn} member={member} isSelf={member.usn === me.usn} />
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
                                <MemberRow key={member.usn} member={member} isSelf={false} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
