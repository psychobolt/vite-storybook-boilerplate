---
name: sync
description: Synchronize a project branch with base/main while preserving shared or unrelated Git histories. Use when updating a fork from the repository's defined base remote.
---

# Sync

Synchronize the project with the documented project and base branch refs on an
existing local branch. Use an explicitly selected local branch when provided;
otherwise use the current local branch. Branch names do not determine whether
the branch can be synchronized.
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
- Any existing local branch is a valid target, including `main`, a feature
  branch, or a development branch. Preserve its current commits and apply the
  sync on top; never delete, reset, or recreate the target. The absence of a
  remote target ref does not prove that a branch is disposable; inspect its
  graph and distinguish prior sync commits from user work.
- This workflow is local-only. Never push the selected target or `base-main`;
  publishing a prepared branch is a separate explicitly requested operation.
- Every sync run is prepare-only for the user-facing target by default. Do not
  create target merge or import commits automatically. Use `--no-commit` for
  target merges and leave the reconciled target result pending for user review.
  The unrelated-history `base-main` integration is an internal exception: once
  it is reconciled and validated, finalize its local integration commit without
  pausing for a separate user review. Approval to sync, continue, resolve
  conflicts, or prepare a target does not authorize a target `git commit`; only
  a separate user instruction that explicitly requests that target commit may
  authorize it.
- Do not delete the `base` remote or modify unrelated branches.

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

5. **Choose the sync branch.** Use an explicitly requested existing local
   branch when one is provided; otherwise use the current local branch. Do not
   create, delete, reset, or recreate a target as part of selection. Do not use
   `base-main` as the target; it is reserved for unrelated-history integration.
   Report the selected target branch before changing it.

6. **Inventory project-side changes before merging.** Before merging the base
   ref into the selected target, record all project-side changes since the merge
   base, including intentional post-fork identity, documentation, workflow,
   cleanup, package, and path changes. Treat the
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

   For workflow and automation files, compare trigger and job enablement as
   separate behavior. Preserve an origin-side disabled trigger or job as
   intentional project behavior; do not re-enable it solely because the base
   ref enables it. Re-enable it only when the current request or established
   project contract requires that change. This includes scheduled, push,
   mirroring, deployment, and other external automation behavior. Record the
   enablement decision in the reconciliation table.

   Maintain a per-file reconciliation table for every overlapping path,
   including workflows, manifests, documentation, and generated metadata:

   | Path | Origin change | Base change | Decision | Reason and final result |
   | ---- | ------------- | ----------- | -------- | ----------------------- |

   Use `base overwrite` for the same-purpose or clearly superseding base
   change, `origin retained` for divergent project behavior, `combined` for
   compatible line-level changes, and `regenerated` for generated metadata.
   Leave a path `unresolved` until its final content and reason are decided.

   Reconcile dependency and version fields in manifests separately from
   project identity and other metadata. Compare each project's dependency
   value with its prior baseline (the merge base for related histories, or the
   relevant project history for unrelated histories) and with the base value.
   An existing pin alone is not evidence of an intentional downgrade. Compare
   it with the prior project value: retain it only when the project side
   explicitly lowered or narrowed the dependency relative to that baseline,
   unless the request changes it. Otherwise, prefer a compatible upstream
   upgrade while retaining the project's identity fields and unrelated
   metadata. Before accepting an upgrade, inspect `peerDependencies` and
   related workspace manifests for compatible peer ranges and coupled runtime
   or type packages. When `peerDependenciesMeta` is present, use
   `optional: true` only to understand whether consumers may omit the peer; it
   does not change the peer's version range. If the base adds that optional
   marker, do not remove a current dependency solely for that reason. When the
   same package appears in `dependencies` or `devDependencies` and
   `peerDependencies`, use the peer range for consumer compatibility and
   preserve the local entry unless its usage or package contract changes. Do
   not accept an isolated upgrade that violates a peer range or leaves related
   packages on incompatible majors; preserve the project set or update the
   complete compatible set from the base. Record the field-level decision in
   the reconciliation table; do not resolve the entire manifest from one side.

   Treat dependency removal as a separate decision. Never remove a dependency
   from the project manifest solely because the base removed it or made its
   peer optional. Before accepting a removal, search the project source,
   configuration, scripts, tests, stories, package entrypoints, peer contract,
   and package-tooling conventions for usage or intentional retention. If the
   evidence is inconclusive, preserve the project dependency and record the
   reason in the reconciliation table.

   For unrelated histories, there is no reliable merge-base change history.
   Treat the current `origin/main` tree as the project baseline. Compare the
   tracked path sets with `git ls-tree -r --name-only origin/main` and
   `git ls-tree -r --name-only base/main`; treat paths present only in the base
   ref as possible upstream additions, not automatic replacements for current
   project files. Review them before accepting them into `base-main`, and do
   not silently restore a path or replace a workflow or documentation update
   that exists on the project side.

7. **Synchronize related histories.** When a merge base exists:

   1. Keep the selected target checked out and preserve it without deleting,
      resetting, or recreating it.
   2. If the latest `origin/main` is not already an ancestor of the target,
      merge it with `--no-commit`, then merge `base/main` with `--no-commit`.
      Preserve the complete history and do not use `--squash`. A fast-forward
      may advance the ref without creating a commit, but do not continue to a
      commit automatically.
   3. Resolve conflicts using the conflict review rules below. Compare the
      result with `origin/main` for the project-side paths inventoried in Step 6
      and apply the conflict-intent rule in Step 9: a compatible or superseding
      base change may replace an origin change, while a divergent origin
      change must remain intact. Complete the reconciliation table and do not
      commit while any overlapping path remains unresolved. Leave the merge
      pending for user review and stop before creating a merge commit.

8. **Synchronize unrelated histories.** When no merge base exists:

   1. If `base-main` does not exist, create it from `origin/main`, then merge
      `base/main` into it with `--allow-unrelated-histories --no-commit`. If it
      already exists, keep the branch and merge the latest `origin/main` and
      `base/main` into it with `--no-commit`, preserving its prior merge point.
      Merge `origin/main` first and then `base/main`; resolve conflicts and
      preserve the current project-side changes inventoried in Step 6 while
      incorporating compatible base-side additions. Use only the fetched
      remote-tracking refs as integration inputs; do not substitute a local
      `main`, target branch, working tree, or unpublished commit. Create
      `base-main` only when it is absent; otherwise preserve and update its
      existing integration history. Never delete and recreate it merely to
      begin a new sync, and never push it. After reconciliation and validation
      are complete, finalize the local `base-main` integration commit without
      pausing for separate user approval. Before applying it to the selected
      target, review the net integration against the project baseline with
      `git diff --name-status origin/main base-main`.
      For every project-side path inventoried in Step 6, inspect the result
      against both refs and apply the conflict-intent rule in Step 9. A
      compatible or superseding base change may replace the origin version; a
      divergent origin change must remain intact. A conflict-free merge is not
      sufficient evidence that the correct version was selected. Before
      applying it to the selected target, complete the reconciliation table and audit
      the net integration from the saved pre-sync target baseline to `base-main`
      with `git diff --name-status <target-before-sync> base-main`. This is the
      final `HEAD..base-main` audit before the target moves on. Classify every
      omitted base change as `intentional`, `compatible-but-retained`, or
      `unresolved`; stop with the pending integration if any item is unresolved
      or awaiting user review.
   2. After the local `base-main` integration commit exists, leave that
      internal branch and continue on the selected target. Keep the target's
      current branch and commits in place; do not delete, reset, or recreate
      it. The squash must be added on top of the preserved user commits. Do not
      finish the workflow with `base-main` checked out.
   3. After the reviewed `base-main` integration commit exists, squash the
      reviewed net changes from `base-main` into the selected target branch.
      Leave the reviewed result staged and uncommitted for a second user review;
      do not create the import commit automatically. Use the `origin/main`
      baseline and the Step 6 review; do not replace the target tree with an
      unreviewed base-side tree or copy individual `base-main` commits into the
      target branch. If the user later approves the import commit, apply the
      commit-subject rule in Step 9.

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

   Preserve intentional `origin/main` ordering of documentation sections,
   configuration blocks, imports, and declarations when integrating base
   changes. An order-only base change is not a reason to reorder the target;
   place compatible base additions within the origin structure. Follow the
   repository's formatter and import-order rules when they require a different
   placement, and preserve any ordering that is semantically significant.

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

   Before each merge or squash, compare the current
   branch identity and `HEAD` with the latest expected checkpoint for that
   operation. Use `--no-commit` for every merge and leave squash results
   staged but uncommitted. Refresh the checkpoint after every intentional
   branch switch or separately authorized commit. If either value changes
   unexpectedly, stop without committing and repeat the affected inspection
   and reconciliation. Do not assume an external commit, reset, or branch
   switch is part of this sync.

   When creating the internal `base-main` integration commit or a target commit
   explicitly authorized by the user, inspect the active provider's workflow
   or pipeline for comparable automated commit subjects and confirm the pattern
   against recent repository subjects. Follow that provider and repository
   convention, including meaningful markers and capitalization; do not borrow
   a format from another provider or invent a project-specific prefix. Treat a
   generic example in human workflow documentation as secondary to the
   provider's actual convention. If no comparable convention exists, use a
   concise standard subject that describes the synchronization.

   Treat generated metadata separately from authored source. Never hand-merge
   `apm.lock.yaml` hashes or deployed skill copies. Resolve authored `.apm/`
   files first, then regenerate with `apm install` and verify with
   `apm audit --ci`. After manifest or workspace changes, run the applicable
   Yarn refresh from the root guidance and review all generated lockfile or
   workspace changes before committing. Do not hide tool-generated changes in
   an automatic stash; preserve unrelated changes and stop if generated churn
   cannot be explained by the reconciled source.

10. **Validate the result.** On the checked-out branch, confirm:

- `git status --short` contains only the expected pending merge or staged
  squash result, or is clean when the operation was a fast-forward or made no
  changes; there are no unrelated changes or unresolved conflicts.
- `git diff --check` passes.
- the selected local target preserves its existing commits and has the pending
  synchronization applied on top.
- In unrelated-history mode, both `origin/main` and `base/main` are
  ancestors of local `base-main`, while the selected target preserves its
  existing commits and has only the reviewed pending synchronization applied on
  top.
- Any new `base-main` integration in this run uses only the resolved fetched
  `origin` and `base` refs; local branches and unpublished work are not direct
  integration inputs.
- The per-file reconciliation table is complete, and every omitted base change
  is classified as intentional or compatible-but-retained; unresolved items
  block completion.
- The changed documentation, manifests, workflows, and protected paths do
  not contain accidental stale identity references.
- Workflow and automation changes do not re-enable an origin-side disabled
  trigger or job unless that change was explicitly requested or required by
  the established project contract.
- The relevant log and diff summaries match the selected mode.
- No target merge or import commit was created without a separate, explicit
  user instruction to create that target commit. Any local `base-main`
  integration commit was created only after reconciliation and validation and
  was not pushed.

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
conflict decisions, pending merge or staged squash state, validation results,
and whether the persistent local-only `base-main` branch was created or
updated. Include the per-file reconciliation table, omitted-change
classifications, and whether unpublished target commits were preserved. Confirm
that no target commit or push occurred without a separate explicit commit or
push instruction, any `base-main` integration commit was local-only, no
`base-main` push occurred, and identify the branch with the pending review
state.
