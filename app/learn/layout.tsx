import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learning Tracks",
    description:
        "Explore hands-on learning tracks, club workshops, and curated resources to build your skills and contribute to open source.",
    alternates: {
        canonical: "/learn",
    },
};

export default function LearnLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return children;
}
