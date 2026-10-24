import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "QR Code Generator",
    description:
        "Build branded QR codes with control over color, size, and error correction for DevForge events and links.",
    alternates: {
        canonical: "/qr",
    },
};

export default function QrLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return children;
}
