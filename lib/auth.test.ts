import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    generatePassword,
    hashPassword,
    signSession,
    verifyPassword,
    verifySession,
    type SessionClaims,
} from "./auth";

const TEST_SECRET = "test-only-dummy-secret-not-real-0123456789";

process.env.JWT_SECRET = TEST_SECRET;

beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
});

afterEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    vi.useRealTimers();
});

describe("hashPassword / verifyPassword", () => {
    it("hashes then verifies the correct password as true", async () => {
        const hash = await hashPassword("correct-horse-battery-staple");
        await expect(verifyPassword("correct-horse-battery-staple", hash)).resolves.toBe(true);
    });

    it("verifies the wrong password as false", async () => {
        const hash = await hashPassword("correct-horse-battery-staple");
        await expect(verifyPassword("not-the-password", hash)).resolves.toBe(false);
    });

    it("produces different hashes for the same password (salted)", async () => {
        const [hashA, hashB] = await Promise.all([
            hashPassword("same-password"),
            hashPassword("same-password"),
        ]);
        expect(hashA).not.toBe(hashB);
    });
});

describe("generatePassword", () => {
    it("defaults to length 14", () => {
        expect(generatePassword()).toHaveLength(14);
    });

    it("respects a custom length", () => {
        expect(generatePassword(8)).toHaveLength(8);
        expect(generatePassword(20)).toHaveLength(20);
    });

    it("generates 100 unique passwords", () => {
        const passwords = new Set(Array.from({ length: 100 }, () => generatePassword()));
        expect(passwords.size).toBe(100);
    });
});

describe("signSession / verifySession", () => {
    const claims: SessionClaims = {
        usn: "1MS21CS001",
        name: "Ada Lovelace",
        role: "member",
    };

    it("signs then verifies returning the same claims", () => {
        const token = signSession(claims);
        const verified = verifySession(token);
        expect(verified).toMatchObject(claims);
        expect(verified?.usn).toBe(claims.usn);
        expect(verified?.name).toBe(claims.name);
        expect(verified?.role).toBe(claims.role);
    });

    it.each([
        ["undefined", undefined],
        ["empty string", ""],
        ["garbage string", "not-a-valid-token"],
        ["malformed jwt", "header.payload.signature"],
    ])("returns null for %s", (_, token) => {
        expect(verifySession(token)).toBeNull();
    });

    it("returns null for a tampered token", () => {
        const token = signSession(claims);
        const lastChar = token.slice(-1);
        const replacement = lastChar === "a" ? "b" : "a";
        const tampered = token.slice(0, -1) + replacement;
        expect(verifySession(tampered)).toBeNull();
    });

    it("returns null when token was signed with a different secret", () => {
        const token = signSession(claims);
        const originalSecret = process.env.JWT_SECRET;
        try {
            process.env.JWT_SECRET = "different-dummy-secret-at-least-32-characters";
            expect(verifySession(token)).toBeNull();
        } finally {
            process.env.JWT_SECRET = originalSecret;
        }
    });

    it("returns null for an expired token using fake timers", () => {
        vi.useFakeTimers();
        try {
            const token = signSession(claims);
            // Advance fake time past 7-day TTL (e.g. 8 days)
            vi.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
            expect(verifySession(token)).toBeNull();
        } finally {
            vi.useRealTimers();
        }
    });
});
