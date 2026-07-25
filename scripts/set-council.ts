/**
 * Assigns Executive Council titles (councilPosition) to member records from
 * data/council.ts. Title only — this does NOT change anyone's access role, so
 * it can't accidentally hand out admin. Grant roles separately and deliberately
 * with --elevate if council members need admin-area access for their duties.
 *
 *   npx tsx scripts/set-council.ts               # dry run
 *   npx tsx scripts/set-council.ts --commit      # apply titles
 *   npx tsx scripts/set-council.ts --commit --elevate   # also role -> mentor
 *
 * Never touches a password. The President keeps admin; nobody is demoted.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { council } from "../data/council";
import { club, COLLECTIONS } from "../lib/firebase/collections";
import type { MemberRecord } from "../lib/session";

const COMMIT = process.argv.includes("--commit");
const ELEVATE = process.argv.includes("--elevate");

async function main() {
    console.log(`\nSet council — ${COMMIT ? "COMMIT" : "DRY RUN"}${ELEVATE ? " + ELEVATE" : ""}\n`);

    for (const member of council) {
        const ref = club<MemberRecord>(COLLECTIONS.members).doc(member.usn);
        const snap = await ref.get();
        if (!snap.exists) {
            console.log(`  SKIP  ${member.usn}  ${member.name} — no member record`);
            continue;
        }

        const current = snap.data() as MemberRecord;
        const update: Partial<MemberRecord> = { councilPosition: member.position };

        // Roles change only with --elevate, and never downgrade an admin.
        if (ELEVATE && current.role === "member") update.role = "mentor";

        console.log(
            `  ${member.name.padEnd(20)} → ${member.position.padEnd(18)} role ${current.role}${
                update.role ? ` → ${update.role}` : ""
            }`,
        );

        if (COMMIT) await ref.update(update);
    }

    console.log(COMMIT ? "\nApplied.\n" : "\nDry run — add --commit to apply.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`\n${(error as Error).message}\n`);
        process.exit(1);
    });
