---
name: sync
description: Synchronize a project branch with base/main while preserving shared or unrelated Git histories. Use when updating a fork from the repository's defined base remote.
---

# Sync

Synchronize the project with the documented project and base branch refs and
prepare a selected `dev/patch` or `dev/upgrade` branch from the project ref.
This repository currently uses `origin/main` and `base/main` as examples; treat
those as resolved refs, not universal branch names. Choose the
history-preserving workflow from the actual Git ancestry: use a normal merge
when the histories are related, or use a local `base-main` integration branch
and one squashed commit when the histories are unrelated.

Read the root [agent guidance](../../../AGENTS.md), the repository's
[workflow documentation](../../../WORKFLOWS.md), and the
[original-fork synchronization guidance](../../../WORKFLOWS.md#syncing-with-original-fork)
before changing Git state. Follow the root [base reference
resolution](../../../AGENTS.md#base-reference-resolution) when the documented
base remote or branch cannot be used. Follow the root guidance for preserving
unrelated work and for checking repository state before and after mutating
commands.

## Boundaries

- Treat `origin/main` as the project branch and `base/main` as the upstream
  base branch. Do not assume that a remote named `base` exists.
- `base-main` is a persistent local integration branch for unrelated histories.
  Keep its merge point so later synchronizations can merge the latest
  `origin/main` and `base/main` incrementally. Never push it or recreate it
  merely to start a new sync.
- Recreate the selected local `dev/patch` or `dev/upgrade` branch from
  `origin/main` for each sync. If the local branch exists, delete it only after
  confirming the worktree is clean and the branch is not carrying unreviewed
  work. The requested workflow authorizes replacing this local branch.
- This workflow is local-only. Never push `dev/patch`, `dev/upgrade`, or
  `base-main`; publishing a prepared branch is a separate explicitly requested
  operation.
- Do not rewrite `main`, delete the `base` remote, or modify unrelated branches.

## Procedure

1. **Inspect the repository state.** Read the linked root and workflow
   guidance. Record the current branch, `git status --short`, remotes, local
   branches, and existing `origin/main`, `base/main`, `base-main`, and
   `dev/patch` and `dev/upgrade` refs. Stop if the worktree contains changes,
   unresolved conflicts, or untracked files that are not explicitly part of
   this sync.
2. **Resolve remotes and branch refs.** Check `git remote` first. If `base`
   exists, inspect its fetch URL and preserve it. If it does not exist, use the
   repository documentation and its remote-setup or synchronization guidance
   to find the canonical base URL and branch, then add the `base` remote
   locally. If `origin` does not exist, use repository documentation and package
   metadata to identify the project URL and default branch, then add `origin`
   locally when unambiguous.
   If documentation does not provide a required URL or branch, apply the root
   base-reference resolution before asking the user for a new base reference.
   If it yields no usable source, stop. If a configured URL conflicts with
   documented identity, report the discrepancy and ask before changing it. Use
   the resolved branch names in place of the `origin/main` and `base/main`
   examples used below.
3. **Refresh remote refs.** Fetch the resolved project remote with pruning and
   fetch the resolved base remote. Do not use a pull that can create an
   unreviewed merge on the project branch. Stop if either remote or either
   resolved branch ref is unavailable. If the repository is shallow, resolve
   its history depth before deciding whether the histories are unrelated; do
   not classify a shallow boundary as unrelated history.
4. **Classify the histories.** Test whether `origin/main` and `base/main`
   have a common ancestor. Report the selected mode before creating branches:

   - **Related history:** a merge base exists. Use the normal merge workflow
     in step 7; do not squash.
   - **Unrelated history:** no merge base exists. Use the local integration
     workflow in step 8 and squash only when importing its combined changes
     into the selected target branch.

   If the result is ambiguous because a ref is shallow, missing, or otherwise
   incomplete, stop and resolve that condition instead of guessing.

5. **Choose the sync branch.** Use an explicitly requested sync type when one
   is provided. Otherwise inspect the scope of the incoming changes and choose:

   - `dev/patch` for a focused, backward-compatible maintenance update with a
     narrow set of files or packages and no broad architecture, tooling,
     version, or public-contract change.
   - `dev/upgrade` for a broad infrastructure, tooling, package, dependency,
     version, public API, or other contract change, or whenever the scope is
     unclear.

   For related histories, inspect the diff and commit range between
   `origin/main` and `base/main` and choose the target now. For unrelated
   histories, make the local `base-main` integration first, then inspect its
   diff against `origin/main` and choose the target before creating it.
   Report the selected target branch before recreating it.

6. **Inventory deletions before merging.** Before creating the selected target
   branch or merging the base ref, record path deletions and possible
   reintroductions. For related histories, use the merge base and inspect both
   sides with commands equivalent to:

   ```sh
   git diff --name-status --find-renames < merge-base > origin/main
   git diff --name-status --find-renames < merge-base > base/main
   ```

   Treat a path deleted by the project side (`origin/main`) as intentional
   project cleanup unless the current request or project contract explicitly
   reintroduces it. Treat a base-side deletion as an incoming change that still
   requires review against the current project contract. Mark any base-side
   addition or modification that restores a project-deleted path for conflict
   review.

   For unrelated histories, there is no reliable merge-base deletion history.
   Compare the tracked path sets with `git ls-tree -r --name-only origin/main`
   and `git ls-tree -r --name-only base/main`; treat paths present only in the
   base ref as possible stale additions, not proven deletions, and review them
   before accepting them into `base-main`. Carry this inventory into the merge
   review and do not silently restore a path that the project has removed.

7. **Synchronize related histories.** When a merge base exists:

   1. Move off any existing selected target branch without losing work, delete
      the confirmed local target branch, and create it from `origin/main`.
   2. Merge `base/main` into the target branch with the normal Git merge. Preserve
      the complete history; do not use `--squash`.
   3. Resolve conflicts using the conflict review rules below. Complete the
      merge and retain a merge commit when Git requires one. Use the
      repository's established commit-subject convention; do not invent a
      prefix or format. Do not create an artificial commit when the merge is
      already a fast-forward.

8. **Synchronize unrelated histories.** When no merge base exists:

   1. If `base-main` does not exist, create it from `origin/main`, then merge
      `base/main` into it with `--allow-unrelated-histories`. If it already
      exists, keep the branch and merge the latest `origin/main` and
      `base/main` into it normally, preserving its prior merge point. Merge
      `origin/main` first and then `base/main`; resolve all conflicts and
      commit each integration using the repository's established commit-subject
      convention. Never push or recreate `base-main` merely to begin a new
      sync.
   2. Move to a detached `origin/main` state, delete any existing local
      target branch, and create the selected target branch from `origin/main`.
   3. Squash the changes from `base-main` into the selected target branch, stage the
      reviewed result, and create exactly one import commit. Before committing,
      inspect recent subjects with `git log` and the repository's workflow
      documentation, then use the established repository convention. If no
      clear convention exists, use a concise standard subject that describes
      the synchronization. Do not copy the individual `base-main` commits into
      the target branch.

9. **Review conflicts by intent.** For every conflict, read both sides and
   their surrounding diffs before editing. Do not resolve conflicts by
   blanket `ours` or `theirs` selection. Prefer project-side (`origin/main`)
   documentation content when the two sides conflict without a clear reason;
   preserve an intentional base-side restructure and reapply project-side
   substantive edits on top of it. For non-documentation files, retain the
   behavior that matches the current project contract, combining non-overlapping
   changes where appropriate. Recheck protected infrastructure and local agent
   guidance after conflict resolution.

   When the merge reports a `deleted by us` path, read the deletion inventory
   and confirm that the project-side deletion is intentional. To preserve that
   deletion, remove the path from the merge result with `git rm -- <path>`;
   do not reconstruct a deletion from a parsed status pipeline or accept the
   base-side version automatically. Review `deleted by them` paths against the
   current project contract before deciding whether to retain or remove them.
   For base-only paths identified during unrelated-history review, remove
   stale additions before committing the integration.

   For a forked project, scan conflict-resolved eligible files for original
   repository or author identity that was unintentionally reintroduced. Keep
   the documented synchronization section and other explicitly intentional
   upstream references; do not remove generic tooling references.

10. **Validate the result.** On the checked-out target branch, confirm:

- `git status --short` is clean and there are no unresolved conflicts.
- `git diff --check` passes.
- the target branch is based on `origin/main` and contains the intended
  `base/main` changes.
- In unrelated-history mode, both `origin/main` and `base/main` are
  ancestors of local `base-main`, while the target branch contains only the
  intended single import commit beyond `origin/main`.
- The changed documentation, manifests, workflows, and protected paths do
  not contain accidental stale identity references.
- The relevant log and diff summaries match the selected mode.

Report any check that cannot run rather than treating a partial check as
completion.

## Stop conditions

Stop before changing branches or remotes when:

- the worktree is dirty, has unresolved conflicts, or contains unreviewed
  untracked files;
- the required project or base remote/ref cannot be resolved after
  documentation-based discovery;
- a required project or base URL is absent from both Git metadata and
  repository documentation;
- history depth prevents a reliable related/unrelated classification;
- a conflict involves an unresolved project contract, protected infrastructure,
  or identity decision;
- deleting a local branch would discard work not covered by this workflow;
- an existing `base-main` contains unexpected local work or its integration
  history cannot be understood safely.

## Handoff

Summarize the selected history mode, target branch, base remote, fetched refs,
conflict decisions, merge or squash commit, validation results, and whether the
persistent local-only `base-main` branch was created or updated. Confirm that
no push occurred, no `base-main` push occurred, and the selected target branch
is checked out.
