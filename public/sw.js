/*
 * DevForge service worker.
 *
 * Deliberately conservative about what it stores. The member app renders
 * personal data — names, photos, points — and a shared laptop is the normal
 * case for this club. So:
 *
 *   - Only immutable, non-personal static assets are cached.
 *   - /api responses are NEVER cached, including avatars.
 *   - Navigations are network-first and fall back to an offline page, never to
 *     a cached copy of somebody's dashboard.
 *   - Caches are dropped on sign-out (see the SIGN_OUT message below).
 *
 * Bump CACHE_VERSION to retire old caches on deploy.
 */
const CACHE_VERSION = "devforge-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = "/offline";

const PRECACHE = [
    OFFLINE_URL,
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))),
            )
            .then(() => self.clients.claim()),
    );
});

/** Immutable build output and icons only — nothing user-specific. */
function isCacheableAsset(url) {
    if (url.origin !== self.location.origin) return false;
    if (url.pathname.startsWith("/api/")) return false;
    return (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname === "/apple-touch-icon.png" ||
        url.pathname === "/favicon-32x32.png"
    );
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Never touch the API — auth state and personal data must not be replayed.
    if (url.pathname.startsWith("/api/")) return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() =>
                caches.match(OFFLINE_URL).then((r) => r ?? Response.error()),
            ),
        );
        return;
    }

    if (!isCacheableAsset(url)) return;

    event.respondWith(
        caches.match(request).then(
            (cached) =>
                cached ??
                fetch(request).then((response) => {
                    if (response.ok && response.status === 200) {
                        const copy = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
                    }
                    return response;
                }),
        ),
    );
});

/** Sign-out clears everything, so the next person on this device starts clean. */
self.addEventListener("message", (event) => {
    if (event.data === "SIGN_OUT") {
        event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
    }
});

self.addEventListener("push", (event) => {
    // A push with no readable payload still has to show something: Chrome
    // displays its own "site updated in the background" notice otherwise.
    let payload = { title: "DevForge", body: "Something new in the club app.", url: "/dashboard" };
    try {
        if (event.data) payload = { ...payload, ...event.data.json() };
    } catch {
        /* malformed payload — fall through to the default */
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-96.png",
            // Same tag replaces an earlier notification rather than stacking.
            tag: payload.tag || "devforge",
            data: { url: payload.url || "/dashboard" },
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = event.notification.data?.url || "/dashboard";

    // Focus an existing tab if one is open, rather than piling up new windows.
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
            for (const client of clients) {
                if (new URL(client.url).origin === self.location.origin && "focus" in client) {
                    client.navigate(target);
                    return client.focus();
                }
            }
            return self.clients.openWindow(target);
        }),
    );
});
