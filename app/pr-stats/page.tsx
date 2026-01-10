import { PRStats } from "@/components/pr-stats";

export const metadata = {
    title: "PR Statistics | DevForge",
    description: "Track merged pull requests and achievements of DevForge club members",
};

export default function PRStatsPage() {
    return (
        <div className="bg-black text-white selection:bg-orange-500 selection:text-black">
            <PRStats />
        </div>
    );
}
