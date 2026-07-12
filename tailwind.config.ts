import type { Config } from "tailwindcss";

/*
 * cyan/violet/purple are remapped onto the theme engine's CSS variables
 * (see globals.css). Every text-cyan-400 / border-violet-500/20 etc.
 * across the app therefore follows the active data-theme automatically.
 * Semantic hues (green/yellow/red/amber gold) stay stock Tailwind.
 */
const accent = (n: number) => `rgb(var(--ac-${n}) / <alpha-value>)`;
const accent2 = (n: number) => `rgb(var(--ac2-${n}) / <alpha-value>)`;

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
                cyan: {
                    100: accent(100),
                    200: accent(200),
                    300: accent(300),
                    400: accent(400),
                    500: accent(500),
                    600: accent(600),
                    700: accent(700),
                    800: accent(800),
                },
                violet: {
                    300: accent2(300),
                    400: accent2(400),
                    500: accent2(500),
                    600: accent2(600),
                    700: accent2(700),
                },
                purple: {
                    300: accent2(300),
                    400: accent2(400),
                    500: accent2(500),
                    600: accent2(600),
                    700: accent2(700),
                },
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
                display: ["var(--font-display)", "Georgia", "serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;
