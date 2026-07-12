import { QualityPRsList } from "@/components/quality-prs-list";

export const metadata = {
    title: "Quality PRs | DevForge",
    description: "Browse all quality pull requests merged by DevForge club members to popular open source repositories",
};

export default function QualityPRsPage() {
    return (
        <div className="bg-transparent text-white selection:bg-cyan-400 selection:text-black">
            <QualityPRsList />
        </div>
    );
}
