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
  Keep its merge point so later synchronizations can merge only the latest
  fetched `origin/main` and `base/main` incrementally. Do not merge local
  `main`, a target branch, the working tree, or other unpublished commits into
  it. Create it from `origin/main` when it does not exist; otherwise keep it
  and integrate the latest fetched refs. Never delete and recreate it merely to
  start a new sync, and never push it.
- Recreate the selected local `dev/patch` or `dev/upgrade` branch from
  `origin/main` for each sync only when it has no unpublished user or
  unreviewed commits. If the local target contains such commits, preserve the
  branch and add the sync result on top; never delete or reset it to recreate
  the target. The absence of a remote target ref alone does not prove that the
  local branch is disposable; inspect its graph and distinguish prior sync
  commits from user work.
- This workflow is local-only. Never push `dev/patch`, `dev/upgrade`, or
  `base-main`; publishing a prepared branch is a separate explicitly requested
  operation.
- Do not rewrite `main`, delete the `base` remote, or modify unrelated branches.

## Procedure

1. **Inspect the repository state.** Read the linked root and workflow
   guidance. Record the current branch, `git status --short`, remotes, local
   branches, and existing `origin/main`, `base/main`, `base-main`, and
   `dev/patch` and `dev/upgrade` refs. For the selected target, compare the
   local branch with its remote-tracking branch, when present, and record any
   unpublished or unreviewed commits. If no remote-tracking target exists,
   inspect the target history and prior sync commits instead of assuming it is
   disposable. Stop if the worktree contains changes, unresolved conflicts, or
   untracked files that are not explicitly part of this sync.
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
   examples used below. Before adding, updating, or fetching either remote,
   perform a read-only access check for each resolved remote and branch, such
   as `git ls-remote <url> <branch>`. Check `origin` and `base` separately;
   do not assume that their credentials, accounts, or provider access are
   shared. If either check fails, stop before changing Git state and ask the
   user to resolve access outside the workflow. Do not expose credentials or
   include credential-bearing URLs or command output in the handoff.
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

6. **Inventory project-side changes before merging.** Before creating the
   selected target branch or merging the base ref, record all project-side
   changes since the merge base, including intentional post-fork identity,
   documentation, workflow, cleanup, package, and path changes. Treat the
   current `origin/main` tree as the project's intentional state. For related
   histories, use the merge base and inspect both sides with commands
   equivalent to:

   ```sh
   git diff --name-status --find-renames < merge-base > origin/main
   git diff --name-status --find-renames < merge-base > base/main
   ```

   Treat changes made by the project side (`origin/main`) as intentional
   project updates unless the current request explicitly changes them. This
   includes changes introduced by an earlier fork or cleanup workflow. Treat a
   path deleted by the project side as intentional cleanup unless the current
   request or project contract explicitly reintroduces it. Treat a base-side
   deletion as an incoming change that still requires review against the
   current project contract. Mark any base-side addition or modification that
   overlaps a project-side change, restores a project-deleted path, or replaces
   a project workflow or documentation update for conflict review.

   Maintain a per-file reconciliation table for every overlapping path,
   including workflows, manifests, documentation, and generated metadata:

   | Path | Origin change | Base change | Decision | Reason and final result |
   | ---- | ------------- | ----------- | -------- | ----------------------- |

   Use `base overwrite` for the same-purpose or clearly superseding base
   change, `origin retained` for divergent project behavior, `combined` for
   compatible line-level changes, and `regenerated` for generated metadata.
   Leave a path `unresolved` until its final content and reason are decided.

   For unrelated histories, there is no reliable merge-base change history.
   Treat the current `origin/main` tree as the project baseline. Compare the
   tracked path sets with `git ls-tree -r --name-only origin/main` and
   `git ls-tree -r --name-only base/main`; treat paths present only in the base
   ref as possible upstream additions, not automatic replacements for current
   project files. Review them before accepting them into `base-main`, and do
   not silently restore a path or replace a workflow or documentation update
   that exists on the project side.

7. **Synchronize related histories.** When a merge base exists:

   1. Move off any existing selected target branch without losing work, delete
      the confirmed local target branch, and create it from `origin/main` only
      when that target has no unpublished commits. If it has unpublished user
      commits, keep the target branch and integrate the sync on top of it;
      never delete or reset it.
   2. When the target was recreated from `origin/main`, merge `base/main` into
      it with the normal Git merge. When unpublished user commits required the
      target to be preserved, merge the latest `origin/main` first when it is
      not already an ancestor, then merge `base/main`; preserve the complete
      history and do not use `--squash`.
   3. Resolve conflicts using the conflict review rules below. Complete the
      merge and retain a merge commit when Git requires one. Apply the
      commit-subject rule in Step 9. Do not create an artificial commit when the
      merge is already a fast-forward. Before completing the merge, compare the
      result with `origin/main` for the project-side paths inventoried in Step 6
      and apply the conflict-intent rule in Step 9: a compatible or superseding
      base change may replace an origin change, while a divergent origin
      change must remain intact. Complete the reconciliation table and do not
      commit while any overlapping path remains unresolved.

8. **Synchronize unrelated histories.** When no merge base exists:

   1. If `base-main` does not exist, create it from `origin/main`, then merge
      `base/main` into it with `--allow-unrelated-histories`. If it already
      exists, keep the branch and merge the latest `origin/main` and
      `base/main` into it normally, preserving its prior merge point. Merge
      `origin/main` first and then `base/main`; resolve all conflicts and
      commit each integration using the commit-subject rule in Step 9. Preserve
      the current project-side changes inventoried in
      Step 6 while incorporating compatible base-side additions. Use only the
      fetched remote-tracking refs as integration inputs; do not substitute a
      local `main`, target branch, working tree, or unpublished commit. Create
      `base-main` only when it is absent; otherwise preserve and update its
      existing integration history. Never delete and recreate it merely to
      begin a new sync, and never push it. Before creating the target branch,
      review the net integration against the project baseline with
      `git diff --name-status origin/main base-main`. For every project-side
      path inventoried in Step 6, inspect the result against both refs and
      apply the conflict-intent rule in Step 9. A compatible or superseding
      base change may replace the origin version; a divergent origin change
      must remain intact. A conflict-free merge is not sufficient evidence
      that the correct version was selected. Before creating the target branch,
      complete the reconciliation table and audit the net integration from the
      saved pre-sync target baseline to `base-main` with
      `git diff --name-status <target-before-sync> base-main`. This is the
      final `HEAD..base-main` audit before the target moves on. Classify every
      omitted base change as `intentional`, `compatible-but-retained`, or
      `unresolved`; stop before the squash if any item is unresolved.
   2. If the selected target has no unpublished commits, move to a detached
      `origin/main` state, delete the existing local target branch, and create
      the selected target branch from `origin/main`. If it has unpublished
      commits, keep its current branch instead; do not delete or reset it. The
      squash must be added on top of the preserved user commits.
   3. Squash the reviewed net changes from `base-main` into the selected target
      branch, stage the reviewed result, and create exactly one import commit.
      Use the `origin/main` baseline and the Step 6 review; do not replace the
      target tree with an unreviewed base-side tree or copy individual
      `base-main` commits into the target branch. Before committing, inspect
      the commit-subject rule in Step 9.

9. **Review conflicts by intent.** For every conflict, read both sides and
   their surrounding diffs before editing. Do not resolve conflicts by
   blanket `ours` or `theirs` selection. Compare overlapping changes by
   intent, not by path alone. When the base change has the same purpose or is
   a compatible, clearly superseding implementation, accept the base result
   even when it replaces the earlier origin version. When the changes have
   divergent purposes, preserve the project-side (`origin/main`) behavior,
   including post-fork identity, workflow, documentation, and cleanup updates,
   and manually combine compatible base behavior. If the intent is unclear,
   perform a line-level review rather than choosing a side wholesale. For
   files without an origin-side change, preserve an intentional base-side
   restructure and use the current project contract to resolve remaining
   differences. Recheck protected infrastructure and local agent guidance
   after conflict resolution.

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

   Before each merge, squash, or integration commit, compare the current
   branch identity and `HEAD` with the latest expected checkpoint for that
   operation. Refresh the checkpoint after every intentional branch switch or
   integration commit. If either value changes unexpectedly, stop without
   committing and repeat the affected inspection and reconciliation. Do not
   assume an external commit, reset, or branch switch is part of this sync.

   For any commit this procedure creates, inspect the active provider's
   workflow or pipeline for comparable automated commit subjects and confirm
   the pattern against recent repository subjects. Follow that provider and
   repository convention, including meaningful markers and capitalization; do
   not borrow a format from another provider or invent a project-specific
   prefix. Treat a generic example in human workflow documentation as
   secondary to the provider's actual convention. If no comparable convention
   exists, use a concise standard subject that describes the synchronization.

   Treat generated metadata separately from authored source. Never hand-merge
   `apm.lock.yaml` hashes or deployed skill copies. Resolve authored `.apm/`
   files first, then regenerate with `apm install` and verify with
   `apm audit --ci`. After manifest or workspace changes, run the applicable
   Yarn refresh from the root guidance and review all generated lockfile or
   workspace changes before committing. Do not hide tool-generated changes in
   an automatic stash; preserve unrelated changes and stop if generated churn
   cannot be explained by the reconciled source.

10. **Validate the result.** On the checked-out target branch, confirm:

- `git status --short` is clean and there are no unresolved conflicts.
- `git diff --check` passes.
- the target branch is based on `origin/main` and contains the intended
  `base/main` changes, or preserves its unpublished user commits with those
  synchronization changes added on top.
- In unrelated-history mode, both `origin/main` and `base/main` are
  ancestors of local `base-main`, while the target branch contains only the
  intended single import commit beyond `origin/main` when it had no unpublished
  commits. Otherwise, the target's unpublished commits remain and exactly one
  sync commit is added on top.
- Any new `base-main` integration in this run uses only the resolved fetched
  `origin` and `base` refs; local branches and unpublished work are not direct
  integration inputs.
- The per-file reconciliation table is complete, and every omitted base change
  is classified as intentional or compatible-but-retained; unresolved items
  block completion.
- The changed documentation, manifests, workflows, and protected paths do
  not contain accidental stale identity references.
- The relevant log and diff summaries match the selected mode.

Report any check that cannot run rather than treating a partial check as
completion.

## Stop conditions

Stop before changing branches or remotes when:

- the worktree is dirty, has unresolved conflicts, or contains unreviewed
  untracked files;
- read-only access to either resolved remote or branch fails, including when
  separate credentials or accounts are required for `origin` and `base`;
- the required project or base remote/ref cannot be resolved after
  documentation-based discovery;
- a required project or base URL is absent from both Git metadata and
  repository documentation;
- history depth prevents a reliable related/unrelated classification;
- a conflict involves an unresolved project contract, protected infrastructure,
  or identity decision;
- deleting a local branch would discard work not covered by this workflow;
- an existing `base-main` contains unexpected local work or its integration
  history cannot be understood safely;
- the branch or `HEAD` changes during reconciliation, or generated metadata
  cannot be regenerated and explained after authored conflicts are resolved.

## Handoff

Summarize the selected history mode, target branch, base remote, fetched refs,
conflict decisions, merge or squash commit, validation results, and whether the
persistent local-only `base-main` branch was created or updated. Include the
per-file reconciliation table, omitted-change classifications, and whether
unpublished target commits were preserved. Confirm that no push occurred, no
`base-main` push occurred, and the selected target branch is checked out.
