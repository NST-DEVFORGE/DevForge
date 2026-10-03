import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import type { SessionClaims } from "./auth";

// hashPassword/verifyPassword/generatePassword don't touch secret(),
// but auth.ts throws at import-time paths that do call secret() elsewhere
// in the module graph, so we set a dummy value before importing —
// never a real secret — using a dynamic import so it runs after this
// executes.
let auth: typeof import("./auth");
let originalJwtSecret: string | undefined;

beforeAll(async () => {
  originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-only-dummy-secret-not-real-0123456789";
  auth = await import("./auth");
});

afterAll(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

describe("hashPassword / verifyPassword", () => {
  it("hashes then verifies the correct password as true", async () => {
    const hash = await auth.hashPassword("correct-horse-battery-staple");
    await expect(
      auth.verifyPassword("correct-horse-battery-staple", hash)
    ).resolves.toBe(true);
  });

  it("verifies the wrong password as false", async () => {
    const hash = await auth.hashPassword("correct-horse-battery-staple");
    await expect(
      auth.verifyPassword("not-the-password", hash)
    ).resolves.toBe(false);
  });

  it("produces different hashes for the same password (salted)", async () => {
    const [hashA, hashB] = await Promise.all([
      auth.hashPassword("same-password"),
      auth.hashPassword("same-password"),
    ]);
    expect(hashA).not.toBe(hashB);
  });
});

describe("generatePassword", () => {
  it("defaults to length 14", () => {
    expect(auth.generatePassword()).toHaveLength(14);
  });

  it("respects a custom length", () => {
    expect(auth.generatePassword(8)).toHaveLength(8);
    expect(auth.generatePassword(20)).toHaveLength(20);
  });

  it("generates 100 unique passwords", () => {
    const passwords = new Set(
      Array.from({ length: 100 }, () => auth.generatePassword())
    );
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
    const token = auth.signSession(claims);
    const verified = auth.verifySession(token);
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
    expect(auth.verifySession(token)).toBeNull();
  });

  it("returns null for a tampered token", () => {
    const token = auth.signSession(claims);
    const lastChar = token.slice(-1);
    const replacement = lastChar === "a" ? "b" : "a";
    const tampered = token.slice(0, -1) + replacement;
    expect(auth.verifySession(tampered)).toBeNull();
  });

  it("returns null when token was signed with a different secret", () => {
    const token = auth.signSession(claims);
    const originalSecret = process.env.JWT_SECRET;
    try {
      process.env.JWT_SECRET = "different-dummy-secret-at-least-32-characters";
      expect(auth.verifySession(token)).toBeNull();
    } finally {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it("returns null for an expired token using fake timers", () => {
    vi.useFakeTimers();
    try {
      const token = auth.signSession(claims);
      // Advance fake time past 7-day TTL (e.g. 8 days)
      vi.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
      expect(auth.verifySession(token)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
