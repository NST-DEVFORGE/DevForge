/**
 * End-to-end check of the auth routes against a running dev server.
 *
 *   npm run dev              # in another terminal
 *   npx tsx scripts/test-auth-flow.ts
 *
 * Creates a disposable member in devforge_members, exercises the flow, then
 * deletes it. Never touches real member records.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { club, COLLECTIONS } from "../lib/firebase/collections";
import { hashPassword } from "../lib/auth";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const USN = "TEST-AUTH-FLOW";
const PASSWORD = "initial-Password-123!";
const NEW_PASSWORD = "replacement-Password-456!";

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail = "") {
    if (condition) {
        passed++;
        console.log(`  PASS  ${label}`);
    } else {
        failed++;
        console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
    }
}

const jar = new Map<string, string>();
function storeCookies(response: Response) {
    for (const raw of response.headers.getSetCookie?.() ?? []) {
        const [pair] = raw.split(";");
        const [name, ...rest] = pair!.split("=");
        jar.set(name!.trim(), rest.join("="));
    }
}
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

async function call(path: string, init: RequestInit = {}) {
    const response = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            "content-type": "application/json",
            ...(jar.size ? { cookie: cookieHeader() } : {}),
            ...init.headers,
        },
        redirect: "manual",
    });
    storeCookies(response);
    const body = await response.json().catch(() => ({}));
    return { status: response.status, body, response };
}

async function seedTestMember(password: string) {
    await club(COLLECTIONS.members).doc(USN).set({
        usn: USN,
        name: "Auth Flow Probe",
        email: "noreply@example.invalid",
        role: "member",
        status: "approved",
        passwordHash: await hashPassword(password),
        mustChangePassword: true,
        points: 0,
        badges: 0,
        joinedAt: new Date().toISOString(),
    });
}

async function cleanup() {
    await club(COLLECTIONS.members).doc(USN).delete();
    await club(COLLECTIONS.rateLimits).doc(`login:unknown`).delete().catch(() => {});
    await club(COLLECTIONS.rateLimits).doc(`password-change:${USN}`).delete().catch(() => {});
}

async function main() {
    console.log(`\nAuth flow against ${BASE}\n`);
    await cleanup();
    await seedTestMember(PASSWORD);

    console.log("rejects bad credentials");
    const wrongPass = await call("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: USN, password: "wrong" }),
    });
    check("wrong password -> 401", wrongPass.status === 401, `got ${wrongPass.status}`);

    const noSuchUser = await call("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "NO-SUCH-MEMBER", password: "wrong" }),
    });
    check("unknown user -> 401", noSuchUser.status === 401, `got ${noSuchUser.status}`);
    check(
        "identical message for both (no enumeration)",
        wrongPass.body.message === noSuchUser.body.message,
        `${wrongPass.body.message} vs ${noSuchUser.body.message}`,
    );

    console.log("\nunauthenticated access");
    const anon = await call("/api/auth/me");
    check("/api/auth/me -> 401", anon.status === 401, `got ${anon.status}`);

    const guarded = await fetch(`${BASE}/dashboard`, { redirect: "manual" });
    check(
        "/dashboard redirects to /login",
        guarded.status === 307 && (guarded.headers.get("location") ?? "").includes("/login"),
        `${guarded.status} -> ${guarded.headers.get("location")}`,
    );

    console.log("\nsuccessful sign-in");
    const login = await call("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: USN, password: PASSWORD }),
    });
    check("correct password -> 200", login.status === 200, `got ${login.status}`);
    check("mustChangePassword surfaced", login.body.mustChangePassword === true);
    check("session cookie is httpOnly", (login.response.headers.getSetCookie?.() ?? []).some((c) => /devforge-auth-token/.test(c) && /HttpOnly/i.test(c)));
    check("password hash not in response", !JSON.stringify(login.body).includes("$2b$"));

    const me = await call("/api/auth/me");
    check("/api/auth/me -> 200 when signed in", me.status === 200, `got ${me.status}`);
    check("returns the right member", me.body.user?.usn === USN);

    console.log("\npassword change");
    const wrongCurrent = await call("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: "nope", newPassword: NEW_PASSWORD }),
    });
    check("wrong current password -> 401", wrongCurrent.status === 401, `got ${wrongCurrent.status}`);

    const tooShort = await call("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: PASSWORD, newPassword: "short" }),
    });
    check("short new password -> 400", tooShort.status === 400, `got ${tooShort.status}`);

    const reuse = await call("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: PASSWORD, newPassword: PASSWORD }),
    });
    check("reusing current password -> 400", reuse.status === 400, `got ${reuse.status}`);

    const changed = await call("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: PASSWORD, newPassword: NEW_PASSWORD }),
    });
    check("valid change -> 200", changed.status === 200, `got ${changed.status}`);

    const after = await call("/api/auth/me");
    check("mustChangePassword cleared", after.body.user?.mustChangePassword === false);

    jar.clear();
    const oldPassword = await call("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: USN, password: PASSWORD }),
    });
    check("old password no longer works", oldPassword.status === 401, `got ${oldPassword.status}`);

    const newPassword = await call("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: USN, password: NEW_PASSWORD }),
    });
    check("new password works", newPassword.status === 200, `got ${newPassword.status}`);

    console.log("\nlogout");
    const loggedOut = await call("/api/auth/logout", { method: "POST" });
    check("logout -> 200", loggedOut.status === 200);
    jar.clear();
    check("session gone after logout", (await call("/api/auth/me")).status === 401);

    await cleanup();
    console.log(`\n${passed} passed, ${failed} failed\n`);
    process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
    console.error(`\n${(error as Error).message}\n`);
    await cleanup().catch(() => {});
    process.exit(1);
});
