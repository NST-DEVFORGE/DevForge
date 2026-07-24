/**
 * Adds a member who is NOT in the student portal — a mentor or staff member.
 * Student members come from data/members.ts via seed-members.ts; this is for
 * everyone else, who carries their own name/email/github/linkedin/photo.
 *
 *   npx tsx scripts/add-member.ts \
 *     --username=shubham.sagar \
 *     --name="Shubham Sagar" \
 *     --email=shubham.sagar@newtonschool.co \
 *     --role=mentor \
 *     --github=ssagar1999 \
 *     --linkedin=https://www.linkedin.com/in/shubham-sagar-a51a99171/ \
 *     [--photo=/path/to/photo.jpg]      # base64-encoded onto the member doc
 *
 * Dry run by default. Add --commit to write, and --send to also email the
 * generated password. --send requires --commit. Re-running for an existing
 * username needs --force (which regenerates the password).
 */
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

import { club, COLLECTIONS } from "../lib/firebase/collections";
import { generatePassword, hashPassword, type MemberRole } from "../lib/auth";
import { sendCredentialsEmail } from "../lib/email";

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const value = (name: string) => args.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);

const COMMIT = has("--commit");
const SEND = has("--send");
const FORCE = has("--force");

const MIME: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
};

async function encodePhoto(path: string): Promise<string> {
    const mime = MIME[extname(path).toLowerCase()];
    if (!mime) throw new Error(`Unsupported image type: ${extname(path)} (use jpg/png/webp/gif)`);
    const bytes = await readFile(path);
    return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function main() {
    if (SEND && !COMMIT) throw new Error("--send requires --commit (won't email credentials that were never saved)");

    const username = value("--username")?.trim().toLowerCase();
    const name = value("--name")?.trim();
    const email = value("--email")?.trim();
    const role = (value("--role") ?? "member") as MemberRole;
    const github = value("--github")?.trim();
    const linkedin = value("--linkedin")?.trim();
    const photoPath = value("--photo");

    const missing = [!username && "--username", !name && "--name", !email && "--email"].filter(Boolean);
    if (missing.length) throw new Error(`Missing required flags: ${missing.join(", ")}`);
    if (!["member", "mentor", "admin"].includes(role)) throw new Error(`Invalid role: ${role}`);

    const ref = club(COLLECTIONS.members).doc(username!);
    const existing = await ref.get();
    if (existing.exists && !FORCE) {
        throw new Error(`"${username}" already exists. Use --force to reset their password.`);
    }

    const photo = photoPath ? await encodePhoto(photoPath) : undefined;

    console.log(`\nAdd member — ${COMMIT ? (SEND ? "COMMIT + EMAIL" : "COMMIT, no email") : "DRY RUN"}\n`);
    console.log(`  username : ${username}`);
    console.log(`  name     : ${name}`);
    console.log(`  email    : ${email}`);
    console.log(`  role     : ${role}`);
    console.log(`  github   : ${github ?? "—"}`);
    console.log(`  linkedin : ${linkedin ?? "—"}`);
    console.log(`  photo    : ${photo ? `${(photo.length / 1024).toFixed(0)}KB embedded` : "GitHub avatar fallback"}`);

    if (!COMMIT) {
        console.log(`\nDry run — nothing written. Add --commit to apply.\n`);
        return;
    }

    const password = generatePassword();
    await ref.set({
        usn: username,
        name,
        email,
        role,
        status: "approved",
        passwordHash: await hashPassword(password),
        mustChangePassword: true,
        points: 0,
        badges: 0,
        joinedAt: new Date().toISOString(),
        ...(github ? { github } : {}),
        ...(linkedin ? { linkedin } : {}),
        ...(photo ? { photo } : {}),
    });
    console.log(`\nwrote member "${username}" to ${COLLECTIONS.members}`);

    if (!SEND) {
        console.log(`No email sent. The password is now unrecoverable — re-run with --force --send to reissue.\n`);
        return;
    }

    await sendCredentialsEmail({ to: email!, name: name!, username: username!, password });
    console.log(`emailed credentials to ${email}\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`\n${(error as Error).message}\n`);
        process.exit(1);
    });
