import { describe, expect, it } from "vitest";
import { normalizeLinkedin, normalizeGithub } from "./members";

describe("normalizeLinkedin", () => {
    it("passes an https:// URL through unchanged", () => {
        expect(normalizeLinkedin("https://linkedin.com/in/x")).toBe("https://linkedin.com/in/x");
    });

    it("passes an http:// URL through unchanged", () => {
        expect(normalizeLinkedin("http://linkedin.com/in/x")).toBe("http://linkedin.com/in/x");
    });

    it("adds https:// to a bare domain", () => {
        expect(normalizeLinkedin("linkedin.com/in/x")).toBe("https://linkedin.com/in/x");
    });

    it("strips a single leading slash before adding the scheme", () => {
        expect(normalizeLinkedin("/linkedin.com/in/x")).toBe("https://linkedin.com/in/x");
    });

    it("strips multiple leading slashes before adding the scheme", () => {
        expect(normalizeLinkedin("///linkedin.com/in/x")).toBe("https://linkedin.com/in/x");
    });

    it("trims surrounding whitespace", () => {
        expect(normalizeLinkedin("  linkedin.com/in/x  ")).toBe("https://linkedin.com/in/x");
    });

    it.each([
        ["null", null],
        ["undefined", undefined],
        ["empty string", ""],
        ["whitespace only", "   "],
    ])("returns undefined for %s", (_, input) => {
        expect(normalizeLinkedin(input)).toBeUndefined();
    });
});

describe('normalizeGithub', () => {
  it('passes bare usernames through', () => {
    expect(normalizeGithub('octocat')).toBe('octocat');
  });

  it('extracts username from GitHub URLs', () => {
    expect(normalizeGithub('https://github.com/user')).toBe('user');
    expect(normalizeGithub('github.com/user/')).toBe('user');
    expect(normalizeGithub('www.github.com/user?tab=repos')).toBe('user');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeGithub('  octocat  ')).toBe('octocat');
  });

  it('returns undefined for invalid usernames', () => {
    expect(normalizeGithub('-invalid')).toBeUndefined();
    expect(normalizeGithub('double--hyphen')).toBeUndefined();
    expect(normalizeGithub('a'.repeat(40))).toBeUndefined();
    expect(normalizeGithub('user_with_underscore')).toBeUndefined();
  });

  it('returns undefined for empty, null, or undefined inputs', () => {
    expect(normalizeGithub('')).toBeUndefined();
    expect(normalizeGithub(null as any)).toBeUndefined();
    expect(normalizeGithub(undefined as any)).toBeUndefined();
  });
});
