/**
 * Assigns Executive Council titles to member records from data/council.ts, and
 * elevates council members so their governance duties have teeth in the app:
 * the President is admin, everyone else at least mentor (Membership Lead can
 * then approve members, Technical Lead can run sessions, etc.).
 *
 *   npx tsx scripts/set-council.ts            # dry run
 *   npx tsx scripts/set-council.ts --commit   # apply
 *
 * Only councilPosition and role are touched — never a password. A member who
 * is already admin keeps admin; nobody is demoted.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { council } from "../data/council";
import { club, COLLECTIONS } from "../lib/firebase/collections";
import type { MemberRecord } from "../lib/session";
import type { MemberRole } from "../lib/auth";

const COMMIT = process.argv.includes("--commit");

async function main() {
    console.log(`\nSet council — ${COMMIT ? "COMMIT" : "DRY RUN"}\n`);

    for (const member of council) {
        const ref = club<MemberRecord>(COLLECTIONS.members).doc(member.usn);
        const snap = await ref.get();
        if (!snap.exists) {
            console.log(`  SKIP  ${member.usn}  ${member.name} — no member record`);
            continue;
        }

        const current = snap.data() as MemberRecord;
        // President is admin; other council members become mentor unless already
        // higher. Never demote (an existing admin stays admin).
        const target: MemberRole =
            member.position === "President"
                ? "admin"
                : current.role === "admin"
                  ? "admin"
                  : "mentor";

        console.log(
            `  ${member.name.padEnd(20)} → ${member.position.padEnd(18)} role ${current.role} → ${target}`,
        );

        if (COMMIT) {
            await ref.update({ councilPosition: member.position, role: target });
        }
    }

    console.log(COMMIT ? "\nApplied.\n" : "\nDry run — add --commit to apply.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(`\n${(error as Error).message}\n`);
        process.exit(1);
    });
