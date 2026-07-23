/**
 * Seeds devforge_members from the club roster, reading identity and contact
 * details out of the student portal's `students` collection (read-only).
 *
 *   npx tsx scripts/seed-members.ts                      # dry run, changes nothing
 *   npx tsx scripts/seed-members.ts --admin=2102508748   # dry run, previews admin roles
 *   npx tsx scripts/seed-members.ts --commit --admin=... # writes Firestore, sends NO email
 *   npx tsx scripts/seed-members.ts --commit --send      # writes AND emails credentials
 *   npx tsx scripts/seed-members.ts --commit --send --only=2102508748   # single test send
 *
 * Passwords are generated fresh here and are unrecoverable afterwards — only
 * the bcrypt hash is stored. Re-running skips members that already exist
 * unless --force is passed.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { members as roster } from "../data/members";
import { club, external, COLLECTIONS } from "../lib/firebase/collections";
import { generatePassword, hashPassword, type MemberRole } from "../lib/auth";
import { sendCredentialsEmail } from "../lib/email";

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const value = (name: string) => args.find((a) => a.startsWith(`${name}=`))?.split("=")[1];

const COMMIT = has("--commit");
const SEND = has("--send");
const FORCE = has("--force");
const admins = new Set((value("--admin") ?? "").split(",").filter(Boolean));
const only = new Set((value("--only") ?? "").split(",").filter(Boolean));

interface Seed {
    usn: string;
    name: string;
    email: string;
    role: MemberRole;
    password: string;
}

async function main() {
    if (SEND && !COMMIT) throw new Error("--send requires --commit (refusing to email credentials that were never saved)");

    const targets = roster.filter((m) => only.size === 0 || only.has(m.usn));
    console.log(`\nDevForge member seed — ${COMMIT ? (SEND ? "COMMIT + EMAIL" : "COMMIT, no email") : "DRY RUN"}`);
    console.log(`roster: ${targets.length} member(s)${only.size ? " (filtered by --only)" : ""}\n`);

    const seeds: Seed[] = [];
    const skipped: string[] = [];

    for (const member of targets) {
        const studentSnap = await external("students").doc(member.usn).get();
        const student = studentSnap.exists ? (studentSnap.data() as Record<string, string>) : null;
        const email = student?.email || student?.institutional_email;

        if (!email) {
            skipped.push(`${member.usn} ${member.name} — no email in students collection`);
            continue;
        }

        const existing = await club(COLLECTIONS.members).doc(member.usn).get();
        if (existing.exists && !FORCE) {
            skipped.push(`${member.usn} ${member.name} — already seeded (use --force to reset)`);
            continue;
        }

        seeds.push({
            usn: member.usn,
            name: student?.name || member.name,
            email,
            role: admins.has(member.usn) ? "admin" : "member",
            password: generatePassword(),
        });
    }

    const mask = (email: string) => email.replace(/^(.{2}).*(@.*)$/, "$1***$2");
    for (const s of seeds) {
        console.log(`  ${s.usn}  ${s.name.padEnd(22)} ${mask(s.email).padEnd(28)} ${s.role}`);
    }
    if (skipped.length) {
        console.log("\nskipped:");
        for (const line of skipped) console.log(`  - ${line}`);
    }

    if (!COMMIT) {
        console.log(`\nDry run — nothing written, nothing sent. ${seeds.length} member(s) would be created.`);
        console.log("Re-run with --commit (and --admin=<usn,...>) to apply.\n");
        return;
    }

    let written = 0;
    for (const s of seeds) {
        await club(COLLECTIONS.members).doc(s.usn).set({
            usn: s.usn,
            name: s.name,
            email: s.email,
            role: s.role,
            status: "approved",
            passwordHash: await hashPassword(s.password),
            mustChangePassword: true,
            points: 0,
            badges: 0,
            joinedAt: new Date().toISOString(),
        });
        written++;
    }
    console.log(`\nwrote ${written} member document(s) to ${COLLECTIONS.members}`);

    if (!SEND) {
        console.log("No emails sent (--send not passed). Passwords are now unrecoverable —");
        console.log("re-run with --force --send to regenerate and deliver them.\n");
        return;
    }

    let sent = 0;
    for (const s of seeds) {
        try {
            await sendCredentialsEmail({ to: s.email, name: s.name, username: s.usn, password: s.password });
            console.log(`  sent -> ${mask(s.email)}`);
            sent++;
        } catch (error) {
            console.error(`  FAILED -> ${mask(s.email)}: ${(error as Error).message}`);
        }
    }
    console.log(`\nemailed ${sent}/${seeds.length} member(s)\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`\n${(error as Error).message}\n`);
        process.exit(1);
    });
