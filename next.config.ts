import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // A stray lockfile in the home directory otherwise makes Next guess the wrong workspace root.
    outputFileTracingRoot: path.join(__dirname),
    experimental: {
        // Keep the client-side router cache for already-visited routes so going
        // back to a page is instant instead of re-rendering on the server (and
        // re-reading Firestore). 60s on dynamic pages balances snappy navigation
        // against staleness on a data-backed app.
        staleTimes: {
            dynamic: 60,
            static: 300,
        },
    },
};

export default nextConfig;
