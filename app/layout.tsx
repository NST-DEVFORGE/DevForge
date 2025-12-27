import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "DevForge - NST x SVYASA",
    description: "Join the premier developer community at Newton School of Technology. Learn, build, and forge amazing projects together.",
    keywords: ["dev club", "coding", "programming", "technology", "NST", "SVYASA", "hackathon", "development"],
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
