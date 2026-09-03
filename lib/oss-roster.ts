import { members as staticRoster } from "@/data/members";
import { loadRoster } from "@/lib/members";
import { normalizeGithub } from "@/lib/members";

/**
 * One roster for every open-source statistic on the site.
 *
 * Before this existed, the same list of contributors was hand-maintained in
 * four places — three API routes plus a second copy inside the PR-stats route
 * carrying typed-in PR counts. Adding a member meant four edits, and a missed
 * one silently dropped that person from a public page. The routes now all read
 * from here.
 *
 * The list is the union of two sources, deduped on the GitHub handle:
 *   - contributors below, which is the only hand-edited list left;
 *   - the live club roster in Firestore, so an approved member with a GitHub
 *     handle on their profile appears without anybody editing anything.
 *
 * It is a union rather than a straight switch to Firestore on purpose: several
 * people on the public stats pages are not (or not yet) approved rows in
 * Firestore, and quietly erasing them from the leaderboard would be a worse
 * bug than the one this replaces.
 */
export interface Contributor {
    name: string;
    /** Bare GitHub username, never a URL. */
    github: string;
    role: string;
    avatar: string;
}

/** Hand-maintained additions: people not carried by the Firestore roster. */
const contributors: Contributor[] = [
    { name: "Geetansh Goyal", github: "geetxnshgoyal", role: "Club President", avatar: "/geetansh.jpg" },
    { name: "Ravi Sharma", github: "ravisharma-09", role: "Member", avatar: "/ravi.jpg" },
    { name: "Lay Shah", github: "Layyzyy", role: "Event Coordinator", avatar: "/lay.png" },
    { name: "Luvya Rana", github: "luvyarana", role: "Tech Lead", avatar: "/luvya.jpg" },
    { name: "Vikas Sharma", github: "sharmavikas18", role: "Member", avatar: "/vikas.png" },
    { name: "Aryan Patel", github: "AryanPatel-ui", role: "Member", avatar: "/aryan.png" },
    { name: "Nithyaraj", github: "nithyarajmudhaliyar", role: "Member", avatar: "/nithyaraj.png" },
    { name: "Prateek", github: "prateek6789-ai", role: "Member", avatar: "/prateek.jpg" },
    { name: "Sahitya Singh", github: "sahitya0xsingh", role: "Designer", avatar: "/sahitya.png" },
    { name: "Dushyant Acharya", github: "Dotify71", role: "Member", avatar: "https://github.com/Dotify71.png" },
    { name: "Pranav Choudhary", github: "pranavchoudhary-tech", role: "Member", avatar: "https://github.com/pranavchoudhary-tech.png" },
    { name: "Saurabh", github: "saurabhyuvi14-ai", role: "Member", avatar: "/saurabh.jpg" },
    { name: "Sidharth", github: "SidharthxNST", role: "Member", avatar: "/sidharth.png" },
    { name: "Bhavesh Sharma", github: "bhavesh-210", role: "Member", avatar: "/bhavesh.jpg" },
    { name: "Unnati Jaiswal", github: "unnati-jaiswal24", role: "Member", avatar: "/unnati.png" },
    { name: "Shristi Kumari", github: "Shristibot", role: "Member", avatar: "https://github.com/Shristibot.png" },
    { name: "Dhiraj Rathod", github: "dhiraj-143r", role: "Member", avatar: "https://github.com/dhiraj-143r.png" },
];

function add(into: Map<string, Contributor>, person: Contributor): void {
    const key = person.github.toLowerCase();
    // First writer wins, so a curated name, role and avatar are not overwritten
    // by a thinner record for the same person from another source.
    if (!into.has(key)) into.set(key, person);
}

/**
 * Everyone whose public contributions the site counts.
 *
 * A Firestore outage degrades to the hand-maintained list rather than throwing:
 * a stats page missing its newest joiner is recoverable, a stats page that
 * 500s is not.
 */
export async function ossRoster(): Promise<Contributor[]> {
    const byHandle = new Map<string, Contributor>();

    contributors.forEach((person) => add(byHandle, person));

    try {
        const live = await loadRoster();
        for (const member of live) {
            if (!member.github) continue;
            add(byHandle, {
                name: member.name,
                github: member.github,
                role: member.councilPosition ?? "Member",
                avatar: member.hasPhoto
                    ? `/api/members/${member.usn}/avatar`
                    : `https://github.com/${member.github}.png`,
            });
        }
    } catch (error) {
        console.error("[oss-roster] live roster unavailable, using the static list only:", error);
    }

    for (const member of staticRoster) {
        const handle = normalizeGithub(member.github);
        if (!handle) continue;
        add(byHandle, {
            name: member.name,
            github: handle,
            role: "Member",
            avatar: `https://github.com/${handle}.png`,
        });
    }

    return [...byHandle.values()].sort((a, b) => a.name.localeCompare(b.name));
}
