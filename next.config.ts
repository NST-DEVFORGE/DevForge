import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    // A stray lockfile in the home directory otherwise makes Next guess the wrong workspace root.
    outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
