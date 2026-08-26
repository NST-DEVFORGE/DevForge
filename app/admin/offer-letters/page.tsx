import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getSession, getMember } from "@/lib/session";
import { can, canAccessAdminArea } from "@/lib/permissions";
import { council } from "@/data/council";
import { OfferLetterForm } from "@/components/admin/offer-letter-form";

export const metadata = { title: "Offer letters" };

export default async function OfferLettersPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/admin/offer-letters");

    const me = await getMember(session.usn);
    // Issuing offer letters is a membership action — same power that approves joins.
    if (!me || me.status !== "approved" || !canAccessAdminArea(me) || !can(me, "members:manage")) {
        redirect("/dashboard");
    }

    // Default the signatory to the sitting President from the governance record.
    const president = council.find((c) => c.position === "President");
    const defaults = {
        signatoryName: president?.name ?? "",
        signatoryTitle: president ? "President, DevForge Executive Council" : "DevForge Executive Council",
    };

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-cyan-300 transition-colors mb-6"
                >
                    <ArrowLeft size={15} />
                    Back to admin
                </Link>

                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <FileText size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Offer <span className="text-cyan-400">letters</span>
                    </h1>
                    <p className="text-neutral-400">
                        Send a selected candidate their official DevForge membership offer — a branded PDF
                        they can keep and share on LinkedIn. Preview it first, then send.
                    </p>
                </div>

                <OfferLetterForm defaults={defaults} />
            </div>
        </div>
    );
}
