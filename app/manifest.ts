import type { MetadataRoute } from "next";

/**
 * Served at /manifest.webmanifest by Next's metadata route.
 *
 * start_url points at /dashboard because installing is a member action — the
 * marketing site is what you get in a normal browser tab. Anyone not signed in
 * is redirected to /login by proxy.ts, so this is safe for a fresh install.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "DevForge — Newton School of Technology",
        short_name: "DevForge",
        description:
            "The DevForge member app: publish projects, RSVP to sessions, and track your contributions.",
        start_url: "/dashboard",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#010107",
        theme_color: "#010107",
        categories: ["education", "productivity", "social"],
        icons: [
            { src: "/icons/icon-64.png", sizes: "64x64", type: "image/png", purpose: "any" },
            { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
            { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png", purpose: "any" },
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-256.png", sizes: "256x256", type: "image/png", purpose: "any" },
            { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            // Separate entries: a transparent icon marked maskable renders as a
            // dark blob once Android applies its shape mask.
            { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
            { name: "Your projects", url: "/dashboard/projects" },
            { name: "Members", url: "/dashboard/members" },
        ],
    };
}
