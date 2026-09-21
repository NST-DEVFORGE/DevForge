import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { offerLetterFilename } from "./offer-letter";

describe("offerLetterFilename", () => {
    it("keeps plain ASCII names", () => {
        expect(offerLetterFilename("Aditi Sharma")).toBe(
            "DevForge-Offer-Letter-Aditi-Sharma.pdf",
        );
    });

    it("transliterates accented Latin letters instead of dropping them", () => {
        expect(offerLetterFilename("Ádítí Sharma")).toBe(
            "DevForge-Offer-Letter-Aditi-Sharma.pdf",
        );
    });

    it("falls back to member when the name is empty", () => {
        expect(offerLetterFilename("")).toBe("DevForge-Offer-Letter-member.pdf");
        expect(offerLetterFilename("   ")).toBe("DevForge-Offer-Letter-member.pdf");
    });

    it("falls back to member when the name is only symbols", () => {
        expect(offerLetterFilename("@@@")).toBe("DevForge-Offer-Letter-member.pdf");
        expect(offerLetterFilename("!!!")).toBe("DevForge-Offer-Letter-member.pdf");
    });
});
