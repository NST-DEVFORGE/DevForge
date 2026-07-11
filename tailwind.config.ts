import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                paper: "var(--bg-primary)",
                "paper-raised": "var(--bg-card)",
                ink: "var(--text-primary)",
                "ink-soft": "var(--text-muted)",
                ember: "var(--accent)",
                "ember-strong": "var(--accent-strong)",
                steel: "var(--steel)",
                good: "var(--good)",
                warn: "var(--warn)",
                bad: "var(--bad)",
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
        },
    },
    plugins: [],
} satisfies Config;
