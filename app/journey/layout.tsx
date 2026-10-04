import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Journey",
    description:
        "Explore DevForge's journey year by year, from community milestones to the projects and achievements that shaped the club.",
    alternates: {
        canonical: "/journey",
    },
};

export default function JourneyLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return children;
}
