import { Metadata } from "next";
import { getSeedGroupismData } from "@/lib/groupism";
import { GroupismArena } from "@/components/groupism/groupism-arena";

export const metadata: Metadata = {
    title: "Groupism: Geetansh vs Sahitya | The Lines of Code Wager",
    description: "Geetansh Goyal (openSUSE & Uyuni) and Sahitya Singh (Checkstyle) compete on merged lines of code. Every line of code merged owes rupees to the opponent. Track the live score, bounties, and PRs.",
    openGraph: {
        title: "Groupism: Geetansh vs Sahitya | Lines of Code Wager",
        description: "The live open-source duel between Geetansh (openSUSE / Uyuni) and Sahitya (Checkstyle). 1 LOC = ₹10. Who owes whom?",
        url: "https://www.devforge.club/groupism",
        siteName: "DevForge",
        type: "website",
    },
};

export default function GroupismPage() {
    const initialData = getSeedGroupismData();

    return <GroupismArena initialData={initialData} />;
}
