import { external } from "./firebase/collections";
import { normalizeGithub } from "./members";

/**
 * Members mostly do not set `github` on their club record — the student portal
 * already has it, keyed by USN. Reading through to it means nobody types their
 * own username in twice, and evidence checks work from day one.
 */
export async function resolveGithub(usn: string, own?: string): Promise<string | undefined> {
    if (own) return normalizeGithub(own);
    const snap = await external<Record<string, string>>("students").doc(usn).get();
    return snap.exists ? normalizeGithub((snap.data() as Record<string, string>).github) : undefined;
}
