import { Users } from "lucide-react";
import { loadRoster } from "@/lib/members";
import { ProfileCard } from "@/components/members/profile-card";

export const metadata = { title: "Members" };

/**
 * Rendered on the server so the roster arrives with the page. The dashboard
 * layout has already established the session, so no extra auth check is needed
 * here — but the data still comes through the guarded accessors.
 */
export default async function MembersPage() {
    const members = await loadRoster();

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <Users size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        The <span className="text-cyan-400">club</span>
                    </h1>
                    <p className="text-neutral-400">
                        {members.length} member{members.length === 1 ? "" : "s"}, ranked by points.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    {members.map((member) => (
                        <ProfileCard key={member.usn} member={member} />
                    ))}
                </div>
            </div>
        </div>
    );
}
