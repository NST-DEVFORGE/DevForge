export function sanitizeFilenameSlug(name: string): string {
    return (
        name
            .trim()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "member"
    );
}
