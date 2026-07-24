/**
 * Sets a member's profile photo without touching anything else — no password
 * reset, no email. For off-roster members (mentors) whose photo lives on their
 * own member doc rather than in the student portal.
 *
 *   npx tsx scripts/set-photo.ts --username=shubham.sagar --photo=/path/to.jpg
 *   npx tsx scripts/set-photo.ts --username=shubham.sagar --photo-url=https://…
 *
 * Add --commit to write; dry run otherwise.
 */
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

import { club, COLLECTIONS } from "../lib/firebase/collections";

const args = process.argv.slice(2);
const value = (name: string) => args.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);
const COMMIT = args.includes("--commit");

const MIME: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
};

async function fromFile(path: string): Promise<string> {
    const mime = MIME[extname(path).toLowerCase()];
    if (!mime) throw new Error(`Unsupported image type: ${extname(path)}`);
    return `data:${mime};base64,${(await readFile(path)).toString("base64")}`;
}

async function fromUrl(url: string): Promise<string> {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) throw new Error(`Fetch failed: HTTP ${response.status}`);
    const mime = response.headers.get("content-type") ?? "image/jpeg";
    if (!mime.startsWith("image/")) throw new Error(`Not an image: ${mime}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function main() {
    const username = value("--username")?.trim().toLowerCase();
    const path = value("--photo");
    const url = value("--photo-url");

    if (!username) throw new Error("Missing --username");
    if (!path && !url) throw new Error("Pass --photo=<file> or --photo-url=<url>");

    const ref = club(COLLECTIONS.members).doc(username);
    const snap = await ref.get();
    if (!snap.exists) throw new Error(`No member "${username}"`);

    const photo = path ? await fromFile(path) : await fromUrl(url!);
    console.log(`\n${(snap.data() as { name?: string }).name ?? username}: ${(photo.length / 1024).toFixed(0)}KB photo from ${path ? "file" : "URL"}`);

    if (!COMMIT) {
        console.log("Dry run — add --commit to save.\n");
        return;
    }

    // update(), so only `photo` changes — passwordHash and everything else stay.
    await ref.update({ photo });
    console.log("saved (password and all other fields untouched)\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`\n${(error as Error).message}\n`);
        process.exit(1);
    });
