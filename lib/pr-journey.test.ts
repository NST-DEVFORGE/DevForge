// Copy the import style from lib/github-auth.test.ts (vitest / jest / node:test).
import { describe, it, expect } from "vitest";
import { parseGithubRef } from "./pr-journey";

describe("parseGithubRef", () => {
  it("parses a PR URL as kind 'pr'", () => {
    expect(parseGithubRef("https://github.com/octo/hello/pull/12")).toEqual({
      owner: "octo",
      repo: "hello",
      number: 12,
      kind: "pr",
    });
  });

  it("parses an issue URL as kind 'issue'", () => {
    expect(parseGithubRef("https://github.com/octo/hello/issues/34")).toEqual({
      owner: "octo",
      repo: "hello",
      number: 34,
      kind: "issue",
    });
  });

  it("accepts www.github.com", () => {
    expect(parseGithubRef("https://www.github.com/octo/hello/pull/12")).toMatchObject({
      owner: "octo",
      repo: "hello",
      number: 12,
      kind: "pr",
    });
  });

  it("accepts http://", () => {
    expect(parseGithubRef("http://github.com/octo/hello/pull/12")).toMatchObject({
      number: 12,
      kind: "pr",
    });
  });

  it("accepts a trailing /files", () => {
    expect(parseGithubRef("https://github.com/octo/hello/pull/12/files")).toMatchObject({
      number: 12,
      kind: "pr",
    });
  });

  it("accepts a trailing #discussion fragment", () => {
    expect(
      parseGithubRef("https://github.com/octo/hello/pull/12#discussion_r123")
    ).toMatchObject({ number: 12, kind: "pr" });
  });

  it("ignores surrounding whitespace", () => {
    expect(parseGithubRef("  https://github.com/octo/hello/pull/12  \n")).toMatchObject({
      owner: "octo",
      repo: "hello",
      number: 12,
    });
  });

  it("returns null for non-GitHub URLs", () => {
    expect(parseGithubRef("https://example.com/octo/hello/pull/12")).toBeNull();
  });

  it("returns null for a repo URL with no number", () => {
    expect(parseGithubRef("https://github.com/octo/hello")).toBeNull();
  });

  it("returns null for gitlab.com URLs", () => {
    expect(parseGithubRef("https://gitlab.com/octo/hello/-/merge_requests/12")).toBeNull();
  });

  it("handles dots and hyphens in owner and repo names", () => {
    expect(parseGithubRef("https://github.com/my-org/my.repo-name/pull/7")).toEqual({
      owner: "my-org",
      repo: "my.repo-name",
      number: 7,
      kind: "pr",
    });
  });
});
