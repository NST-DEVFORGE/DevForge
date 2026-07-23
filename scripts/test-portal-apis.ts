/**
 * End-to-end check of events/RSVP, the admin approval flow, and push
 * authorization against a running dev server.
 *
 *   TEST_BASE_URL=http://localhost:3001 npx tsx scripts/test-portal-apis.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { club, COLLECTIONS } from "../lib/firebase/collections";
import { hashPassword } from "../lib/auth";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const ADMIN = "TEST-PORTAL-ADMIN";
const MEMBER = "TEST-PORTAL-MEMBER";
const PASSWORD = "portal-Test-Password-1";

let passed = 0;
let failed = 0;
function check(label: string, ok: boolean, detail = "") {
    if (ok) { passed++; console.log(`  PASS  ${label}`); }
    else { failed++; console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }
}

function client() {
    const jar = new Map<string, string>();
    return {
        async call(path: string, init: RequestInit = {}) {
            const r = await fetch(`${BASE}${path}`, {
                ...init,
                headers: {
                    "content-type": "application/json",
                    ...(jar.size ? { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; ") } : {}),
                    ...init.headers,
                },
                redirect: "manual",
            });
            for (const raw of r.headers.getSetCookie?.() ?? []) {
                const [n, ...v] = raw.split(";")[0]!.split("=");
                jar.set(n!.trim(), v.join("="));
            }
            return { status: r.status, body: await r.json().catch(() => ({})) };
        },
        login(usn: string) {
            return this.call("/api/auth/login", { method: "POST", body: JSON.stringify({ username: usn, password: PASSWORD }) });
        },
    };
}

async function seed(usn: string, role: "member" | "admin") {
    await club(COLLECTIONS.members).doc(usn).set({
        usn, name: role === "admin" ? "Portal Admin" : "Portal Member",
        email: "noreply@example.invalid", role, status: "approved",
        passwordHash: await hashPassword(PASSWORD), mustChangePassword: false,
        points: 0, badges: 0, joinedAt: new Date().toISOString(),
    });
}

async function cleanup() {
    for (const usn of [ADMIN, MEMBER]) {
        await club(COLLECTIONS.members).doc(usn).delete();
        await club(COLLECTIONS.rateLimits).doc(`push-send:${usn}`).delete().catch(() => {});
    }
    for (const col of [COLLECTIONS.events, COLLECTIONS.rsvps] as const) {
        const snap = await club(col).get();
        for (const d of snap.docs) {
            const data = d.data() as { createdBy?: string; usn?: string };
            if (data.createdBy === ADMIN || data.usn === MEMBER) await d.ref.delete();
        }
    }
}

async function main() {
    console.log(`\nPortal APIs against ${BASE}\n`);
    await cleanup();
    await seed(ADMIN, "admin");
    await seed(MEMBER, "member");

    const admin = client();
    const member = client();
    await admin.login(ADMIN);
    await member.login(MEMBER);

    console.log("events — authorization");
    const memberCreate = await member.call("/api/events", {
        method: "POST",
        body: JSON.stringify({ title: "Member attempt", summary: "should be refused", startsAt: new Date(Date.now() + 86400000).toISOString(), location: "Lab" }),
    });
    check("member cannot create event -> 403", memberCreate.status === 403, `got ${memberCreate.status}`);

    const created = await admin.call("/api/events", {
        method: "POST",
        body: JSON.stringify({
            title: "Test Session", summary: "Automated test session",
            startsAt: new Date(Date.now() + 86400000).toISOString(), location: "Lab 2", capacity: 1,
        }),
    });
    check("admin creates event -> 201", created.status === 201, `got ${created.status}`);
    const eventId = created.body.event?.id;

    console.log("\nRSVP — capacity of 1");
    const rsvp1 = await member.call(`/api/events/${eventId}/rsvp`, { method: "POST" });
    check("member RSVPs -> 201", rsvp1.status === 201, `got ${rsvp1.status}`);
    const rsvpAgain = await member.call(`/api/events/${eventId}/rsvp`, { method: "POST" });
    check("second RSVP is idempotent (still going)", rsvpAgain.body.going === true);
    const adminRsvp = await admin.call(`/api/events/${eventId}/rsvp`, { method: "POST" });
    check("capacity full -> 409 for second person", adminRsvp.status === 409, `got ${adminRsvp.status}`);
    const attendees = await member.call(`/api/events/${eventId}/rsvp`);
    check("exactly one attendee listed", (attendees.body.attendees ?? []).length === 1);
    const cancel = await member.call(`/api/events/${eventId}/rsvp`, { method: "DELETE" });
    check("cancel -> 200", cancel.status === 200 && cancel.body.going === false);

    console.log("\njoin + admin approval");
    // Reuse MEMBER's USN path indirectly: create a fresh pending member by USN
    // that isn't in students, so join() no-ops safely — instead test the admin
    // guard and self-protection directly.
    const memberSeesAdmin = await member.call("/api/admin/members");
    check("member cannot list admin roster -> 403", memberSeesAdmin.status === 403, `got ${memberSeesAdmin.status}`);
    const adminSeesRoster = await admin.call("/api/admin/members");
    check("admin lists roster -> 200", adminSeesRoster.status === 200);
    const selfDemote = await admin.call(`/api/admin/members/${ADMIN}`, {
        method: "PATCH", body: JSON.stringify({ action: "set-role", role: "member" }),
    });
    check("admin cannot change own access -> 409", selfDemote.status === 409, `got ${selfDemote.status}`);
    const promote = await admin.call(`/api/admin/members/${MEMBER}`, {
        method: "PATCH", body: JSON.stringify({ action: "set-role", role: "mentor" }),
    });
    check("admin promotes member -> 200", promote.status === 200);

    console.log("\npush — authorization");
    // MEMBER was promoted to mentor above, and mentors may send — use a fresh
    // plain member so this tests the role gate, not the earlier promotion.
    const PLAIN = "TEST-PORTAL-PLAIN";
    await seed(PLAIN, "member");
    const plain = client();
    await plain.login(PLAIN);
    const memberPush = await plain.call("/api/push/send", {
        method: "POST", body: JSON.stringify({ title: "x", body: "y" }),
    });
    check("plain member cannot send push -> 403", memberPush.status === 403, `got ${memberPush.status}`);
    await club(COLLECTIONS.members).doc(PLAIN).delete();
    const adminPush = await admin.call("/api/push/send", {
        method: "POST", body: JSON.stringify({ title: "Test", body: "Nobody is subscribed", usns: [MEMBER] }),
    });
    check("admin push accepted -> 200 (0 devices)", adminPush.status === 200 && adminPush.body.sent === 0, `got ${adminPush.status}`);

    await cleanup();
    console.log(`\n${passed} passed, ${failed} failed\n`);
    process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
    console.error(`\n${(e as Error).message}\n`);
    await cleanup().catch(() => {});
    process.exit(1);
});
