import type {
    CollectionReference,
    DocumentData,
    Firestore,
} from "firebase-admin/firestore";
import { getDb } from "./admin";

/**
 * This Firestore project (studentportal-123) is shared with the college's
 * student portal, which owns `students`, `carpool_*`, `audit_logs`,
 * `ccm_feedback` and `birthday_runs` — all live data the club app must never
 * modify.
 *
 * Every club collection is therefore namespaced `devforge_`, and the helpers
 * below are the only sanctioned way to reach Firestore. Writes are refused
 * outside the namespace, so touching the portal's data is impossible rather
 * than merely discouraged.
 */
const CLUB_PREFIX = "devforge_";

export const COLLECTIONS = {
    members: "devforge_members",
    projects: "devforge_projects",
    events: "devforge_events",
    rsvps: "devforge_rsvps",
    notifications: "devforge_notifications",
    pushSubscriptions: "devforge_push_subscriptions",
    rateLimits: "devforge_rate_limits",
} as const;

export type ClubCollection = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/** Collections owned by the student portal. Readable, never writable. */
export const EXTERNAL_READONLY = ["students"] as const;
export type ExternalCollection = (typeof EXTERNAL_READONLY)[number];

/**
 * Query surface we allow on someone else's collection. Snapshot accessors
 * (data/exists/size/...) belong here too: aggregate results from count() carry
 * no `ref` or `docs`, so they reach this proxy directly rather than
 * sealSnapshot, and refusing data() there would block a legitimate read.
 */
const READ_METHODS = new Set([
    // queries
    "doc",
    "get",
    "where",
    "orderBy",
    "limit",
    "limitToLast",
    "offset",
    "select",
    "count",
    "aggregate",
    "startAt",
    "startAfter",
    "endAt",
    "endBefore",
    "listDocuments",
    "id",
    "path",
    // snapshot reads
    "data",
    "exists",
    "size",
    "empty",
    "isEqual",
    "readTime",
    "createTime",
    "updateTime",
]);

function refuse(collection: string, method: string): never {
    throw new Error(
        `Refusing ${method}() on "${collection}": it belongs to the student portal. ` +
            `Club data must live in a ${CLUB_PREFIX}* collection — see lib/firebase/collections.ts.`,
    );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Wraps a reference so only read operations survive. Applied recursively, so
 * `readOnly(students).doc(usn).delete()` throws just as the direct call would.
 */
function readOnly<T extends object>(ref: T, collection: string): T {
    return new Proxy(ref, {
        get(target, prop, receiver) {
            const key = String(prop);
            const value = Reflect.get(target, prop, receiver);

            if (typeof value !== "function") return value;
            if (!READ_METHODS.has(key)) return () => refuse(collection, key);

            return (...args: unknown[]) =>
                seal((value as (...a: unknown[]) => unknown).apply(target, args), collection);
        },
    });
}

/**
 * Keeps the seal on whatever a read hands back. Three shapes matter:
 * promises (awaiting must not trip the proxy), snapshots (their `.ref` is a
 * fully writable reference), and further query refs.
 */
function seal(result: unknown, collection: string): unknown {
    if (!result || typeof result !== "object") return result;

    if (typeof (result as any).then === "function") {
        return (result as Promise<unknown>).then((value) => seal(value, collection));
    }
    if ("ref" in result || "docs" in result) return sealSnapshot(result, collection);

    return readOnly(result as object, collection);
}

/** Snapshots leak a writable `.ref`; re-seal it and anything reachable through `.docs`. */
function sealSnapshot(snapshot: object, collection: string): object {
    return new Proxy(snapshot, {
        get(target, prop, receiver) {
            const key = String(prop);
            const value = Reflect.get(target, prop, receiver);

            if (key === "ref") return readOnly(value as object, collection);
            if (key === "docs") return (value as object[]).map((d) => sealSnapshot(d, collection));
            if (key === "forEach") {
                return (cb: (doc: unknown) => void) =>
                    (target as any).forEach((d: object) => cb(sealSnapshot(d, collection)));
            }
            return typeof value === "function" ? (value as any).bind(target) : value;
        },
    });
}

/** A club collection, writable. Rejects anything outside the namespace. */
export function club<T = DocumentData>(
    name: ClubCollection,
): CollectionReference<T> {
    if (!name.startsWith(CLUB_PREFIX)) {
        throw new Error(`"${name}" is not a club collection (expected ${CLUB_PREFIX}* prefix)`);
    }
    return getDb().collection(name) as CollectionReference<T>;
}

/** A student-portal collection, reads only. */
export function external<T = DocumentData>(
    name: ExternalCollection,
): CollectionReference<T> {
    const ref = getDb().collection(name) as CollectionReference<T>;
    return readOnly(ref, name);
}

/**
 * Escape hatch for batches and transactions, which can address any collection
 * and so cannot be guarded by the proxy. Call sites must stay within
 * `devforge_*`; this exists to make that choice explicit and greppable.
 */
export function unguardedDb(): Firestore {
    return getDb();
}
