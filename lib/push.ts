import webpush from "web-push";
import { club, COLLECTIONS } from "./firebase/collections";

export interface PushSubscriptionRecord {
    /** Hash of the endpoint — endpoints are long and contain URL-unsafe characters. */
    id: string;
    usn: string;
    endpoint: string;
    keys: { p256dh: string; auth: string };
    userAgent?: string;
    createdAt: string;
}

export interface PushPayload {
    title: string;
    body: string;
    url?: string;
    tag?: string;
}

let configured = false;

function configure() {
    if (configured) return;
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (!publicKey || !privateKey) {
        throw new Error("Web push is not configured: set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY");
    }
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:devforge@devforge.club",
        publicKey,
        privateKey,
    );
    configured = true;
}

/** Firestore ids can't contain "/" and cap at 1500 bytes; endpoints do both. */
export function subscriptionId(endpoint: string): string {
    return Buffer.from(endpoint).toString("base64url").slice(0, 200);
}

export interface DeliveryReport {
    sent: number;
    failed: number;
    pruned: number;
}

/**
 * Sends to every subscription belonging to the given members.
 *
 * A 404 or 410 from the push service means the browser threw the subscription
 * away — the row is deleted rather than retried, otherwise dead endpoints
 * accumulate forever and every future send gets slower.
 */
export async function sendToMembers(usns: string[], payload: PushPayload): Promise<DeliveryReport> {
    configure();
    if (usns.length === 0) return { sent: 0, failed: 0, pruned: 0 };

    const collection = club<PushSubscriptionRecord>(COLLECTIONS.pushSubscriptions);

    // Firestore caps `in` filters at 30 values, so query in chunks.
    const chunks: string[][] = [];
    for (let i = 0; i < usns.length; i += 30) chunks.push(usns.slice(i, i + 30));

    const subscriptions = (
        await Promise.all(chunks.map((chunk) => collection.where("usn", "in", chunk).get()))
    ).flatMap((snap) => snap.docs.map((d) => d.data()));

    const body = JSON.stringify(payload);
    let sent = 0;
    let failed = 0;
    let pruned = 0;

    await Promise.all(
        subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(
                    { endpoint: subscription.endpoint, keys: subscription.keys },
                    body,
                );
                sent++;
            } catch (error) {
                const status = (error as { statusCode?: number }).statusCode;
                if (status === 404 || status === 410) {
                    await collection.doc(subscription.id).delete();
                    pruned++;
                } else {
                    failed++;
                }
            }
        }),
    );

    return { sent, failed, pruned };
}
