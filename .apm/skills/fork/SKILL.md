---
name: fork
description: Migrate a cloned repository to a new project identity, optionally remove explicitly approved demo content, and reset Git history only when requested. Use when preparing a repository for independent fork development.
---

# Fork

Prepare a repository for independent development without invoking the
unfinished bootstrap workflow. For a fresh clone or fork, identity migration
is the default. Content cleanup and history replacement are separate procedure
steps and never follow from invoking this skill alone.

## Protected scope

- Preserve every path protected by the root [repository shape
  guidance](../../../AGENTS.md#repository-shape); do not duplicate or override
  that protected-path list here.
- Preserve root package-manager, workspace, shared configuration, agent
  guidance, and skill infrastructure unless the user explicitly includes it in
  the cleanup scope.
- Do not delete a workspace from `apps/` or `packages/` based on its name alone.
  Inventory candidates and obtain confirmation of the exact deletion scope.
- Do not read secret-bearing environment files or process environment
  variables. The workspace's `.env.defaults` is the only environment-file read
  exception for non-secret metadata. Use the [keys skill](../keys/SKILL.md) for
  any encrypted environment operation.

## Procedure

1. **Inspect the fork context.** Read the nearest `AGENTS.md`, package and
   workspace configuration, and repository workflow documentation. Inspect the
   worktree and preserve unrelated changes. Record the current branch, remotes,
   workspace list, protected paths, and candidate demo paths without changing
   working files. If the current branch tracks a remote, refresh its relevant
   ref and determine whether the local history is ahead, behind, or current.
   If no remote is configured or the repository has no commit, classify it as
   an unpublished fresh repository; there is no history to synchronize. Do not
   merge the upstream repository during fork preparation. If no Git remotes are
   configured, use repository documentation and local repository metadata to
   distinguish the project repository from the upstream repository. When the
   original or upstream reference remains unresolved, apply the root [base
   reference resolution](../../../AGENTS.md#base-reference-resolution); stop if
   it yields no usable source. Never use an upstream/base reference as the
   project's `origin`.

2. **Select the operation mode.** Classify the repository as fresh or
   otherwise unmigrated, or as already having its project identity and required
   remote setup established. Use identity migration for a fresh or unmigrated
   repository and preserve all files during that pass. For an established
   repository, a later invocation may enter cleanup review: inventory likely
   demo content and present the exact deletion set, but do not remove it in the
   review pass. Changing the repository history alone does not establish this
   state. Determine from the user's current instruction whether it asks to
   clear or reset Git history, or to add or update `origin` or `base`. If the
   repository state is ambiguous, preserve files and ask before proposing
   cleanup.

3. **Inventory the original identity.** Search eligible tracked and source
   files, including manifests, lockfiles, licenses, READMEs, development and
   workflow documentation, CI and automation configuration, scripts, badges,
   and agent guidance, for:

   - the original repository name, owner, URL, package names, author and
     copyright holder;
   - `repository`, `homepage`, `bugs`, `funding`, `description`, `license`,
     and other identity properties that actually exist;
   - hard-coded project URLs or owner names in ordinary workflow examples,
     service configuration, badges, and automation;
   - intentional upstream references used to synchronize from the base
     repository.

   Exclude secret-bearing environment files, generated output, dependencies,
   and Git internals from content scans. Keep generic tooling names such as
   Storybook, Vite, Yarn, and shared package names unless they are specifically
   part of the old project identity. Inspect Git remotes with `git remote -v`
   or `git remote get-url --all <remote>` when available and record their URLs
   as Git metadata, not repository content.

4. **Confirm identity and scope.** Apply replacement values explicitly given
   by the user. Ask only for values or decisions that remain material and
   unresolved. When an identity property exists, explicitly decide whether to
   retain it with a replacement value or remove it; do not silently remove an
   existing property. This includes `name`, `description`, `license`,
   `author`, copyright ownership, `repository`, `homepage`, `bugs`, and
   `funding`. A repository owner in a new URL does not automatically establish
   the package author or copyright holder.

   Confirm the requested project URL for `origin` and upstream URL for `base`
   separately. If the user explicitly supplies a new project URL, updating or
   adding `origin` is part of identity migration. If the user explicitly asks
   for a base remote, add or retain only `base` at the confirmed upstream URL;
   do not use that URL to create `origin`. If no remotes exist, add `base` only
   unless the user separately provides or authorizes a project URL for `origin`.
   If normalized `origin` and `base` URLs are identical, treat that as a
   remote-role collision. Do not infer a fork, history reset, or cleanup from
   the collision; report it and ask which project and upstream roles are
   intended.
   If the project `origin` is absent, empty, or has no published project ref,
   infer an unpublished-fork candidate and propose a fresh-history migration.
   This is a workflow inference, not permission to discard local commits; do
   not replace history without the user's approval unless the current
   instruction already authorizes it.
   If a required URL or branch cannot be discovered from repository
   documentation or Git metadata, ask before changing remotes.

   Stop before deletion, history replacement, or unresolved identity changes
   when the required decision is missing. A user response approving the
   proposed deletion set is the required cleanup decision; do not infer it from
   the initial fork invocation or from the fact that the repository is no
   longer on the original history.

5. **Apply the selected changes.**

   - In identity-migration mode, preserve all applications, packages, demos,
     shared infrastructure, workflows, and automation files. Update manifests,
     lockfiles, documentation, scripts, badges, and configuration to the new
     project identity.
   - Comment out active scheduled cron timing by default, except for a
     workflow whose purpose is certificate renewal. Preserve the certificate
     renewal schedule so certificates are not allowed to expire. For other
     scheduled workflows, preserve the workflow or automation file, its jobs,
     manual triggers, and other triggers; comment only the schedule timing
     configuration. If leaving a `schedule` or equivalent parent with no
     active entries would make the configuration invalid, comment out that
     scheduling block as a unit rather than deleting the workflow or disabling
     its other triggers.
   - Reset an old CI dotenv file only when the fork request includes that
     reset. Do not open, copy, inspect, or rewrite the existing `.env.ci`.
     Hand the reset to the [keys skill](../keys/SKILL.md) or an approved
     user-controlled secure process so it can remove the old file and create a
     new `.env.ci` containing only the documented key names with blank values.
     Do not invent key names or include private keys, encrypted values, or
     copied ciphertext in the replacement. If the secure process is
     unavailable, leave the existing file untouched and report that the reset
     could not be completed.
   - In content-cleanup mode, remove only the approved demo paths. Preserve
     protected paths and shared tooling. Update workspace manifests, lockfiles,
     task configuration, documentation, and references in existing workflow or
     automation files as required by the deletion.
   - Preserve workflow, automation, and coverage configuration files. Update
     them instead of deleting them because an example was removed. Consolidate
     inapplicable package or workspace jobs into one commented example so they
     cannot execute. Preserve the fork workflow-sync CI itself and update only
     its stale project references or removed paths.
   - Remove an `apps/` or `packages/` container only after the approved cleanup
     leaves it empty; never delete a non-empty container as a shortcut.

6. **Normalize documentation and workflow references.** Replace stale project
   identity in ordinary documentation, badges, manifests, licenses, scripts,
   CI, and automation with the confirmed new values. Prefer a relative link
   when a local target exists; otherwise use the new project URL when it is a
   consumer-facing project link.

   For generic workflow or automation examples, remove hard-coded references to
   the original project and use the repository's project context, resolved
   remote names, branch inputs, or other repository-neutral expressions. A
   concrete URL may remain when it is intentionally the upstream `base`
   synchronization source. Keep the documented synchronization procedure and
   its upstream commands, but make the distinction clear: project references
   point to the new repository, while base references point to the upstream
   repository.

   Do not use broad text substitution. Update each occurrence according to
   whether it is new-project identity, upstream synchronization guidance,
   generic tooling documentation, or an external reference that should remain.

7. **Migrate history when explicitly requested or approved.** When the user
   asks to clear Git history, or approves a fresh-history proposal for an
   unpublished project, first verify the publication state from step 1. If a
   remote exists but its current state cannot be checked, stop before replacing
   history. Do not silently discard local commits that are ahead of a remote;
   continue only when the user's current instruction or explicit approval
   authorizes replacing that unpublished history. Preserve the validated
   working tree and create the new history from it with an orphan-history
   workflow. Keep a
   temporary local recovery reference until the new branch has been validated,
   unless the user explicitly rejects retaining one. Replace the requested
   branch only after
   confirming the new commit contains the retained files and no unresolved
   changes. If the user requested complete local history removal, delete the
   temporary recovery reference only after that validation; otherwise report
   that it remains. Do not infer history replacement from ordinary fork
   cleanup. The absence of a merge base only indicates unrelated histories; it
   does not authorize history replacement. Resolve shallow or incomplete
   history and use the `sync` workflow for history integration. If the current
   history is already unrelated or appears previously reset, preserve it and
   report that state when the user did not request another history change. Do
   not rewrite unrelated branches or push the result.

8. **Check remotes and original references.** Normalize SSH and HTTPS forms,
   host aliases, case, and a trailing `.git` before comparing URLs. Verify that
   an explicitly requested project URL is configured as `origin` and an
   explicitly requested upstream URL is configured as `base`. Report remotes
   that still point to the old project when they were not intentionally
   retained. Do not remove or rewrite a remote that the user did not authorize.
   If remotes are unavailable, report that the comparison was documentation
   only; the first step handles fallback resolution.

9. **Validate the prepared repository.** Format changed files with the
   repository's formatter and run `git diff --check`. Verify that protected
   paths remain, approved removed workspaces are absent from workspace and task
   configuration, manifests and lockfiles are valid, requested remotes point to
   the confirmed URLs, and no stale old-project identity remains in eligible
   files. Allow only intentional upstream synchronization references and
   explicitly retained attribution. Check that ordinary workflow examples no
   longer present the old project as the current repository. Recheck
   `.env.defaults` only for non-secret defaults; do not inspect any other
   environment file. Run remaining repository checks that are available and
   report checks that cannot run until project setup is complete.

10. **Hand off without bootstrap.** Report the selected mode, preserved or
    removed paths, identity fields updated or removed, `origin` or `base`
    additions or updates, history-reset result, intentional upstream
    references, remaining unresolved decisions, and validation results. Do not
    run the [bootstrap
    skill](../bootstrap/SKILL.md); the repository is ready for a future,
    separately defined setup workflow.
