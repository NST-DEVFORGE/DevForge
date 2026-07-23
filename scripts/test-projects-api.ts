/**
 * End-to-end check of the projects API against a running dev server.
 *
 *   npx tsx scripts/test-projects-api.ts            # assumes localhost:3000
 *   TEST_BASE_URL=http://localhost:3001 npx tsx scripts/test-projects-api.ts
 *
 * Creates two disposable members (an owner and an unrelated member) plus the
 * projects they make, then removes all of it.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { club, COLLECTIONS } from "../lib/firebase/collections";
import { hashPassword } from "../lib/auth";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const OWNER = "TEST-PROJ-OWNER";
const OTHER = "TEST-PROJ-OTHER";
const PASSWORD = "projects-Test-Password-1";

let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail = "") {
    if (ok) { passed++; console.log(`  PASS  ${label}`); }
    else { failed++; console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }
}

function session() {
    const jar = new Map<string, string>();
    return {
        async call(path: string, init: RequestInit = {}) {
            const response = await fetch(`${BASE}${path}`, {
                ...init,
                headers: {
                    "content-type": "application/json",
                    ...(jar.size ? { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; ") } : {}),
                    ...init.headers,
                },
                redirect: "manual",
            });
            for (const raw of response.headers.getSetCookie?.() ?? []) {
                const [name, ...rest] = raw.split(";")[0]!.split("=");
                jar.set(name!.trim(), rest.join("="));
            }
            return { status: response.status, body: await response.json().catch(() => ({})) };
        },
        async login(usn: string) {
            return this.call("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username: usn, password: PASSWORD }),
            });
        },
    };
}

async function seed(usn: string, name: string) {
    await club(COLLECTIONS.members).doc(usn).set({
        usn, name, email: "noreply@example.invalid", role: "member", status: "approved",
        passwordHash: await hashPassword(PASSWORD), mustChangePassword: false,
        points: 0, badges: 0, joinedAt: new Date().toISOString(),
    });
}

async function cleanup() {
    for (const usn of [OWNER, OTHER]) {
        await club(COLLECTIONS.members).doc(usn).delete();
        await club(COLLECTIONS.rateLimits).doc(`project-write:${usn}`).delete().catch(() => {});
    }
    const projects = await club(COLLECTIONS.projects).get();
    for (const doc of projects.docs) {
        const owner = (doc.data() as { ownerUsn?: string }).ownerUsn;
        if (owner === OWNER || owner === OTHER) await doc.ref.delete();
    }
}

async function main() {
    console.log(`\nProjects API against ${BASE}\n`);
    await cleanup();
    await seed(OWNER, "Project Owner");
    await seed(OTHER, "Unrelated Member");

    const anon = session();
    const owner = session();
    const other = session();

    console.log("anonymous");
    check("public list -> 200", (await anon.call("/api/projects")).status === 200);
    check("?mine=1 -> 401", (await anon.call("/api/projects?mine=1")).status === 401);
    check("create -> 401", (await anon.call("/api/projects", { method: "POST", body: "{}" })).status === 401);

    await owner.login(OWNER);
    await other.login(OTHER);

    console.log("\nvalidation");
    const short = await owner.call("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: "x", tagline: "too short" }),
    });
    check("short title -> 400", short.status === 400, `got ${short.status}`);

    const badUrl = await owner.call("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title: "Valid title", tagline: "A perfectly fine tagline", repoUrl: "javascript:alert(1)" }),
    });
    check("javascript: URL rejected -> 400", badUrl.status === 400, `got ${badUrl.status}`);

    console.log("\ncreate");
    const created = await owner.call("/api/projects", {
        method: "POST",
        body: JSON.stringify({
            title: "Test Harness Project", tagline: "Created by the automated test suite",
            tech: ["Next.js", "Firestore"], repoUrl: "https://github.com/example/repo", status: "draft",
        }),
    });
    check("create -> 201", created.status === 201, `got ${created.status}`);
    const id = created.body.project?.id;
    check("slug generated", /^test-harness-project-/.test(created.body.project?.slug ?? ""), created.body.project?.slug);
    check("owner recorded from session", created.body.project?.ownerUsn === OWNER);

    console.log("\ndraft visibility");
    check("owner can read own draft", (await owner.call(`/api/projects/${id}`)).status === 200);
    check("anonymous gets 404 for draft", (await anon.call(`/api/projects/${id}`)).status === 404);
    check("other member gets 404 for draft", (await other.call(`/api/projects/${id}`)).status === 404);
    const publicList = await anon.call("/api/projects");
    check("draft absent from public list", !JSON.stringify(publicList.body).includes(id));

    console.log("\nownership");
    const hijack = await other.call(`/api/projects/${id}`, {
        method: "PATCH", body: JSON.stringify({ title: "Hijacked by another member" }),
    });
    check("other member cannot PATCH -> 403", hijack.status === 403, `got ${hijack.status}`);
    check("other member cannot DELETE -> 403", (await other.call(`/api/projects/${id}`, { method: "DELETE" })).status === 403);

    const escalate = await owner.call(`/api/projects/${id}`, {
        method: "PATCH", body: JSON.stringify({ ownerUsn: OTHER, title: "Ownership transfer attempt" }),
    });
    check("ownerUsn not writable from body", escalate.status === 200 && escalate.body.project?.ownerUsn === OWNER);

    console.log("\npublish");
    check("publish -> 200", (await owner.call(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify({ status: "published" }) })).status === 200);
    check("now visible anonymously", (await anon.call(`/api/projects/${id}`)).status === 200);
    check("now in public list", JSON.stringify((await anon.call("/api/projects")).body).includes(id));

    console.log("\ndelete");
    check("owner can delete -> 200", (await owner.call(`/api/projects/${id}`, { method: "DELETE" })).status === 200);
    check("gone afterwards -> 404", (await anon.call(`/api/projects/${id}`)).status === 404);

    await cleanup();
    console.log(`\n${passed} passed, ${failed} failed\n`);
    process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
    console.error(`\n${(error as Error).message}\n`);
    await cleanup().catch(() => {});
    process.exit(1);
});
