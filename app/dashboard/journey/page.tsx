import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getMember, getSession } from "@/lib/session";
import { can } from "@/lib/permissions";
import { JourneyQueue } from "@/components/dashboard/journey-queue";

export const metadata = { title: "Journey sign-offs" };

/**
 * The reviewer's queue. Lives under /dashboard rather than /admin because
 * `journey:review` reaches people the /admin proxy does not — a Technical Lead
 * on the member role, or a mentor — and this is a teaching duty, not an
 * administrative one.
 */
export default async function JourneyReviewPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard/journey");

    const member = await getMember(session.usn);
    if (!member || member.status !== "approved" || !can(member, "journey:review")) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Journey <span className="text-cyan-400">sign-offs</span>
                    </h1>
                    <p className="text-neutral-400 leading-relaxed">
                        The link on each submission was already checked against GitHub — it exists, they opened it, and
                        it sits in the right kind of repository. What is left is the part only a person can judge:
                        whether the reflection is honest and specific. Send back the ones that are not.
                    </p>
                </div>

                <JourneyQueue />
            </div>
        </div>
    );
}
