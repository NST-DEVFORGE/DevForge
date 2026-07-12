---
title: "Making Your First Pull Request"
author: devforge-team
date: "2026-07-01"
category: "Tutorials"
tags: ["git", "github", "open-source", "beginner"]
excerpt: "Fork, branch, commit, PR, review — the mechanical steps nobody explains clearly enough, walked through once so you stop guessing."
---

Everyone tells you to "just make a PR." Almost nobody walks through what that actually means step by step. Here's the whole loop, once, so you never have to guess again.

## 1. Fork, don't clone directly

Unless you already have write access to a repo, you can't push to it. Fork it into your own account first:

```bash
# on GitHub: click "Fork" on the repo page, then
git clone https://github.com/<your-username>/<repo>.git
cd <repo>
```

Add the original repo as a second remote, conventionally called `upstream`, so you can pull in new changes later:

```bash
git remote add upstream https://github.com/<original-owner>/<repo>.git
```

## 2. Branch before you touch anything

Never commit directly to `main` on your fork. Create a branch named after what you're actually doing:

```bash
git checkout -b fix/broken-pagination-link
```

If you're fixing issue #482, `fix/482-pagination-link` is even better — it's searchable later.

## 3. Make the smallest change that solves the problem

A 12-line PR gets reviewed in a day. A 600-line PR that "also cleaned up some formatting while I was in there" gets reviewed in three weeks, if at all. Resist the urge to refactor anything you weren't asked to touch.

## 4. Commit with a message that explains *why*

```bash
git add src/components/Pagination.tsx
git commit -m "Fix pagination skipping page 2 on mobile viewports"
```

The diff already shows *what* changed. Your message's job is the *why* — the part a reviewer can't get from the code alone.

## 5. Push and open the PR

```bash
git push origin fix/broken-pagination-link
```

GitHub will offer to open a PR from your pushed branch. In the description, say what the problem was, what you changed, and how you verified it. If the project has a PR template, fill in every section — it exists because maintainers got tired of asking the same follow-up questions.

## 6. Respond to review like it's a conversation, not a test

Maintainers will ask for changes. That's not rejection — it's the normal shape of the process. Push new commits to the same branch; they show up in the same PR automatically. Once everything's addressed, the maintainer merges it and you've got a real, verifiable open-source contribution with your name on it.

## The part people skip: keeping your fork current

Before starting your *next* contribution, sync your fork so you're not branching off stale code:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Do this every time. It's the difference between a PR that merges cleanly and one that turns into a conflict-resolution exercise three weeks later.
