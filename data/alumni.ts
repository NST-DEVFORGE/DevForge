export interface AlumniEntry {
    name: string;
    photo: string;
    gradYear: string;
    currentCompany: string;
    currentRole: string;
    github?: string;
    linkedin?: string;
    /** Real, verifiable contributions made during their time in the club — not a free-text achievements field, on purpose. */
    contributions: string[];
}

/**
 * Intentionally empty. There is no graduate/alumni data anywhere in this
 * repo — adding placeholder entries here would repeat the exact mistake
 * the audit flagged in the old components/team.tsx (hardcoded "New
 * Leader" members). This ships once the exec team runs a real intake
 * process; see app/alumni/page.tsx for the empty state and intake link.
 */
export const alumniEntries: AlumniEntry[] = [];
