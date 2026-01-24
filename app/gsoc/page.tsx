import { GsocStats } from "@/components/gsoc-stats";

export const metadata = {
    title: "GSoC Ready | DevForge",
    description: "PR bifurcation for Google Summer of Code - tracking merged, open, and closed PRs to GSoC eligible organizations",
};

export default function GsocPage() {
    return (
        <div className="bg-black text-white selection:bg-orange-500 selection:text-black">
            <GsocStats />
        </div>
    );
}
