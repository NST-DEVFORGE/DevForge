import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: App | null = null;

/**
 * Service-account credentials, from the three discrete env vars already present
 * in .env.local. Missing values throw rather than falling back to anything —
 * a half-configured admin app fails in confusing ways much later otherwise.
 */
function credentials() {
    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    // Vercel stores the PEM with literal \n sequences; Firebase needs real newlines.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

    const missing = [
        !projectId && "FIREBASE_PROJECT_ID",
        !clientEmail && "FIREBASE_CLIENT_EMAIL",
        !privateKey && "FIREBASE_PRIVATE_KEY",
    ].filter(Boolean);

    if (missing.length) {
        throw new Error(`Firebase admin is not configured: missing ${missing.join(", ")}`);
    }
    if (!privateKey!.includes("-----BEGIN PRIVATE KEY-----")) {
        throw new Error("FIREBASE_PRIVATE_KEY is not a PEM private key");
    }

    return { projectId, clientEmail, privateKey };
}

export function getAdminApp(): App {
    if (cached) return cached;
    cached = getApps()[0] ?? initializeApp({ credential: cert(credentials()) });
    return cached;
}

/**
 * Raw Firestore handle. Prefer the guarded helpers in ./collections — this is
 * exported for them and for read-only access to the student portal's data.
 */
export function getDb(): Firestore {
    return getFirestore(getAdminApp());
}
