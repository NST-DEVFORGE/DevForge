import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description: "Meet the DevForge members and explore the 2025 first batch.",
  alternates: {
    canonical: "/members",
  },
};

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
