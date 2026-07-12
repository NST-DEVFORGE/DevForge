export interface ThemeDef {
    /** matches the data-theme attribute; "aurora" is the :root default (no attribute) */
    id: string;
    name: string;
    /** literal swatch colors for the picker UI (must not depend on the active theme) */
    swatch: [string, string];
}

export const THEME_STORAGE_KEY = "devforge-theme";

export const themes: ThemeDef[] = [
    { id: "aurora", name: "Aurora", swatch: ["#22d3ee", "#8b5cf6"] },
    { id: "avengers", name: "Avengers", swatch: ["#ef4444", "#fbbf24"] },
    { id: "spiderverse", name: "Spider-Verse", swatch: ["#ef4444", "#3b82f6"] },
    { id: "hawkins", name: "Hawkins", swatch: ["#ff4646", "#a855f7"] },
    { id: "cyberpunk", name: "Cyberpunk", swatch: ["#facc15", "#e879f9"] },
    { id: "synthwave", name: "Synthwave", swatch: ["#f472b6", "#818cf8"] },
    { id: "ember", name: "Ember", swatch: ["#fb923c", "#f43f5e"] },
    { id: "matrix", name: "Matrix", swatch: ["#4ade80", "#a3e635"] },
    { id: "ocean", name: "Ocean", swatch: ["#60a5fa", "#38bdf8"] },
    { id: "orchid", name: "Orchid", swatch: ["#c084fc", "#e879f9"] },
    { id: "rose", name: "Rose", swatch: ["#fb7185", "#e879f9"] },
    { id: "solar", name: "Solar", swatch: ["#fbbf24", "#fb923c"] },
    { id: "mono", name: "Mono", swatch: ["#fafafa", "#a3a3a3"] },
];

export function applyTheme(id: string) {
    if (id === "aurora") {
        delete document.documentElement.dataset.theme;
        try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* private mode */ }
    } else {
        document.documentElement.dataset.theme = id;
        try { localStorage.setItem(THEME_STORAGE_KEY, id); } catch { /* private mode */ }
    }
}

export function getStoredTheme(): string {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) ?? "aurora";
    } catch {
        return "aurora";
    }
}
