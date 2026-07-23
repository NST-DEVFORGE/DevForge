/**
 * Proves the club app cannot write to the student portal's collections.
 *
 * This Firestore project is shared with a live system, so the guard in
 * lib/firebase/collections.ts is load-bearing. Run after touching that file:
 *   npx tsx scripts/verify-firestore-guard.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

/* eslint-disable @typescript-eslint/no-explicit-any */
import { club, external, COLLECTIONS } from "../lib/firebase/collections";

let failures = 0;

async function expect(label: string, outcome: "allowed" | "blocked", fn: () => unknown) {
    let actual: "allowed" | "blocked";
    let detail = "";
    try {
        await fn();
        actual = "allowed";
    } catch (error) {
        actual = "blocked";
        detail = (error as Error).message.split("\n")[0].slice(0, 72);
    }
    const ok = actual === outcome;
    if (!ok) failures++;
    console.log(`${ok ? "  PASS" : "  FAIL"}  ${label.padEnd(34)} ${actual}${detail ? ` — ${detail}` : ""}`);
}

(async () => {
    console.log(`\nFirestore guard — project ${process.env.FIREBASE_PROJECT_ID}\n`);

    console.log("student portal (must stay read-only)");
    await expect("read students", "allowed", () => external("students").limit(1).get());
    await expect("read students doc", "allowed", () => external("students").doc("2102508748").get());
    await expect("students.doc().set()", "blocked", () => (external("students").doc("guard-probe") as any).set({ probe: true }));
    await expect("students.doc().update()", "blocked", () => (external("students").doc("guard-probe") as any).update({ probe: true }));
    await expect("students.doc().delete()", "blocked", () => (external("students").doc("guard-probe") as any).delete());
    await expect("students.add()", "blocked", () => (external("students") as any).add({ probe: true }));
    await expect("snapshot.ref.delete()", "blocked", async () => {
        const snap = await external("students").doc("2102508748").get();
        return (snap.ref as any).delete();
    });
    await expect("query docs[0].ref.set()", "blocked", async () => {
        const snap = await external("students").limit(1).get();
        return (snap.docs[0].ref as any).set({ probe: true });
    });

    console.log("\nclub namespace (must be usable)");
    await expect("read devforge_members", "allowed", () => club(COLLECTIONS.members).limit(1).get());
    await expect("club() rejects foreign name", "blocked", () => (club as any)("students"));
    await expect("club() rejects carpool", "blocked", () => (club as any)("carpool_sessions"));

    console.log(failures === 0 ? "\nGuard intact.\n" : `\n${failures} check(s) failed — do not deploy.\n`);
    process.exit(failures === 0 ? 0 : 1);
})();
