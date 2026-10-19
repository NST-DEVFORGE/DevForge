import { describe, expect, it, vi } from "vitest";
import { ossRoster } from "./oss-roster";

vi.mock("@/lib/members", () => ({
    loadRoster: async () => [{
        name: "Nishtha Agarwal",
        github: "nishtha-agarwal-211",
        usn: "2102508773",
        hasPhoto: true,
        councilPosition: "Membership Lead",
    }],
    normalizeGithub: (value: string) => value,
}));

describe("public open-source roster", () => {
    it("uses a public avatar for a member with a private photo", async () => {
        const roster = await ossRoster("second-year");
        const nishtha = roster.find(
            (member) => member.github === "nishtha-agarwal-211",
        );

        expect(nishtha?.avatar).toBe(
            "https://github.com/nishtha-agarwal-211.png",
        );
    });
});