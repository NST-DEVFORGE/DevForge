import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "DevForge - premier developer community at Newton School of Technology",
        template: "%s | DevForge"
    },
    description: "Join the premier developer community at Newton School of Technology. Learn, build, and forge amazing projects together in a collaborative environment.",
    keywords: ["dev club", "coding", "programming", "technology", "NST", "SVYASA", "hackathon", "development", "student community", "software engineering"],
    authors: [{ name: "DevForge Team" }],
    creator: "DevForge",
    publisher: "DevForge",
    metadataBase: new URL("https://www.devforge.club"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "DevForge - NST x SVYASA",
        description: "Join the premier developer community at Newton School of Technology. Learn, build, and forge amazing projects together.",
        url: "https://www.devforge.club",
        siteName: "DevForge",
        images: [
            {
                url: "/logo.png",
                alt: "DevForge Community",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "DevForge - NST x SVYASA",
        description: "Where ideas are forged into reality. Join the revolution.",
        creator: "@devforge_nst", // Placeholder handle
        images: ["/logo.png"],
    },
    icons: {
        icon: "/logo.png",
        apple: "/logo.png", // Assuming same logo for now
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DevForge",
        "url": "https://www.devforge.club",
        "logo": "https://www.devforge.club/logo.png",
        "sameAs": [
            "https://twitter.com/devforge_nst",
            "https://github.com/devforge-nst",
            "https://linkedin.com/company/devforge-nst"
        ],
        "description": "The premier developer community at Newton School of Technology.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "India",
            "addressRegion": "Rishikesh" // Assuming location based on SVYASA
        }
    };

    return (
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
