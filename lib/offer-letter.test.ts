import { describe, expect, it } from "vitest";
import { sanitizeFilenameSlug } from "./filename";

describe("sanitizeFilenameSlug", () => {
    it("keeps simple ASCII names readable", () => {
        expect(sanitizeFilenameSlug("Jane Doe")).toBe("Jane-Doe");
    });

    it("strips accents from Latin names", () => {
        expect(sanitizeFilenameSlug("Ádítí Sharma")).toBe("Aditi-Sharma");
    });

    it("falls back to member when the name is blank or symbol-only", () => {
        expect(sanitizeFilenameSlug("   ")).toBe("member");
        expect(sanitizeFilenameSlug("!!!@@@###")).toBe("member");
    });
});
