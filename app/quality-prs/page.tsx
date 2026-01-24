import { QualityPRsList } from "@/components/quality-prs-list";

export const metadata = {
    title: "Quality PRs | DevForge",
    description: "Browse all quality pull requests merged by DevForge club members to popular open source repositories",
};

export default function QualityPRsPage() {
    return (
        <div className="bg-black text-white selection:bg-orange-500 selection:text-black">
            <QualityPRsList />
        </div>
    );
}
