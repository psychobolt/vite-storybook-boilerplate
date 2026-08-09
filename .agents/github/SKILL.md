---
name: github
description: Diagnose and resolve GitHub Actions failures, blocked pull requests, and Renovate dependency-update checks. Use when a change cannot merge because GitHub CI is failing.
---

# GitHub Workflow Guidance

Use this skill for GitHub Actions CI and pull-request failures. Treat the
workflow files in `.github/workflows/` and `.github/actions/` as the source of
truth; do not recreate their behavior from memory or duplicate their full
documentation here.

## Procedure

1. Read the nearest `AGENTS.md`, inspect the current branch and worktree, and
   preserve unrelated changes.
2. Identify the exact failing check, job, operating system, and workflow run.
3. Read the workflow that defines the job and follow any reusable workflow or
   local action it calls.
4. Classify the failure as an environment/setup issue, dependency-resolution
   issue, flaky or external failure, or a genuine code/configuration regression.
5. Reproduce the smallest relevant command locally. Use the repository's
   documented setup and workspace commands when installation or generated
   workspace artifacts are required.
6. Format changed files before running the relevant linters and tests.
7. Make the smallest fix that addresses the identified cause. Keep Renovate
   changes narrowly scoped and do not weaken, skip, or conceal CI checks.
8. Re-run the relevant validation, then report the cause, changes, checks, and
   any remaining CI-only limitation.

## Renovate changes

- Inspect the dependency diff and lockfile changes before editing source code.
- Confirm whether the failure is caused by the update or already exists on the
  target branch.
- Preserve the requested upgrade scope; avoid unrelated upgrades or refactors.
- Update tests or compatibility code only when the failure demonstrates that
  the dependency change requires it.

## Stop conditions

Stop and report the blocker when the failure depends on unavailable secrets,
external services, protected CI settings, or a provider-side problem. Do not
guess credentials, disable checks, or modify release and branch-protection
policy to force a merge.
