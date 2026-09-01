---
name: fork
description: Migrate a cloned repository to a new project identity, optionally remove explicitly approved demo content, and reset Git history only when requested. Use when preparing a repository for independent fork development.
---

# Fork

Prepare a repository for independent development without invoking the
unfinished bootstrap workflow. For a fresh clone or fork, identity migration
is the default.

## Protected scope

- Preserve every path protected by the root [repository shape
  guidance](../../../AGENTS.md#repository-shape); do not duplicate or override
  that protected-path list here.
- Preserve root package-manager, workspace, shared configuration, agent
  guidance, and skill infrastructure unless the user explicitly includes it in
  the cleanup scope.
- Do not delete a workspace from `apps/` or `packages/` based on its name alone.
  Inventory candidates and obtain confirmation of the exact deletion scope.
- Follow the root [environment-file boundary](../../../AGENTS.md#environment-file-boundary)
  for all environment-file and process-environment handling. Use the [keys
  skill](../keys/SKILL.md) for any encrypted environment operation.

## Procedure

1. **Verify Git identity and keep the workflow local.** Before beginning fork
   inventory or changing files, determine the effective Git `user.name` and
   `user.email` from Git configuration. If either value is missing, stop and ask
   the user to configure the Git author identity. Do not infer it from package
   metadata, remote ownership, or repository documentation, and do not change
   Git configuration unless the user explicitly requests that change.

   This skill does not create hosted forks, verify provider authentication, or
   publish remotes. A user-provided project URL is sufficient to configure
   `origin` locally. Do not test hosted reachability or authentication; fork
   does not publish remotes, and hosted destination availability is not a
   local fork issue.

2. **Inspect the fork context.** Read the nearest `AGENTS.md`, package and
   workspace configuration, and repository workflow documentation. Inspect the
   worktree and preserve unrelated changes. Record the current branch, remotes,
   workspace list, protected paths, and candidate demo paths without changing
   working files. If the current branch tracks a remote, refresh its relevant
   ref and determine whether the local history is ahead, behind, or current.
   If no remote is configured or the repository has no commit, classify it as
   an unpublished fresh repository; there is no history to synchronize. Do not
   merge the upstream repository during fork preparation. If no Git remotes are
   configured, use repository documentation and local repository metadata to
   distinguish the project repository from the upstream repository. For any
   unresolved original or upstream reference, use the root [base reference
   resolution](../../../AGENTS.md#base-reference-resolution); its order and
   fallback rules are authoritative. Never use a base reference as the
   project's `origin`. Compare the workspace root directory name with the
   resolved source repository name. A different directory name is evidence
   that the clone may be intended for a new project, but local directory names
   are not authoritative project identity and do not by themselves authorize
   identity changes, remote changes, cleanup, or history replacement.

3. **Select the operation mode and upstream relationship.** Classify the
   repository as fresh or otherwise unmigrated, or as already having its
   project identity and required remote setup established. Use identity
   migration for a fresh or unmigrated repository and preserve all files during
   that pass. For an established repository, a later invocation may enter
   cleanup review: inventory likely demo content and present the exact
   deletion set, but do not remove it in the review pass. Changing the
   repository history alone does not establish this state.

   Determine whether the new project is independent or an extension of an
   existing project. Use the user's instruction first; the destination project
   name, URL, workspace directory name, existing synchronization documentation,
   and configured remotes are supporting signals, not proof by themselves. In
   either case, the resulting project is the canonical `origin` and may become
   the base for future extensions. Always configure the resolved original
   source as the local-only `base` remote; never publish it and never use it as
   `origin`. For an independent new project, remove the original source and
   `base` from tracked documentation and workflow references while retaining
   the `base` remote for local synchronization. For an extension, retain and
   normalize the intended upstream relationship in tracked synchronization
   guidance as well. If the relationship is ambiguous, preserve files and ask
   whether the project is independent or an extension and which local or
   documented upstream relationship is intended.

   Determine separately from the user's current instruction whether it asks to
   clear or reset Git history, or to add or update `origin` or `base`. If the
   user has not stated whether existing history should be preserved or reset,
   stop and ask for that history disposition before applying the identity
   migration. Do not infer preservation or reset from an unpublished `origin`,
   an unrelated history, or the absence of a merge base.

4. **Inventory the original identity.** Search eligible tracked and source
   files, including manifests, lockfiles, licenses, READMEs, development and
   workflow documentation, CI and automation configuration, scripts, badges,
   and agent guidance, for:

   - the original repository name, owner, URL, package names, author and
     copyright holder;
   - `repository`, `homepage`, `bugs`, `funding`, `description`, `license`,
     and other identity properties that actually exist;
   - hard-coded project URLs or owner names in ordinary workflow examples,
     service configuration, badges, and automation, including workflow
     conditions, actor or bot allowlists, repository-owner expressions,
     synchronization refs, and package or workspace paths;
   - intentional upstream references used to synchronize from the base
     repository.

   Exclude secret-bearing environment files, generated output, dependencies,
   and Git internals from content scans. Keep generic tooling names such as
   Storybook, Vite, Yarn, and shared package names unless they are specifically
   part of the old project identity. Inspect Git remotes with `git remote -v`
   or `git remote get-url --all <remote>` when available and record their URLs
   as Git metadata, not repository content.

5. **Confirm identity and scope.** Apply replacement values explicitly given
   by the user. Ask only for values or decisions that remain material and
   unresolved. When an identity property exists, explicitly decide whether to
   retain it with a replacement value or remove it; do not silently remove an
   existing property. This includes `name`, `description`, `license`,
   `author`, copyright ownership, `repository`, `homepage`, `bugs`, and
   `funding`. A repository owner in a new URL does not automatically establish
   the package author or copyright holder. Preserve a user-supplied license
   value exactly; do not normalize `Proprietary` to `UNLICENSED` unless the
   user explicitly requests that value. For an independent new project,
   retain only the selected active license; do not append the original
   project's license as a second active license. Preserve existing upstream
   copyright notices and attribution text in place and unchanged by default.
   Do not create, move, rewrite, or relink a `NOTICE` file or other
   attribution material unless the user explicitly requests it or a clearly
   established legal requirement requires it.

   Confirm the requested project URL for `origin` and the resolved original
   source URL for the local-only `base` remote. For an independent new
   project, when no project name is supplied, use the current repository root
   directory's basename as the project name. For an extension, also
   confirm that the original source is the chosen upstream URL for `base`. If
   the user explicitly supplies
   a new project URL, always update or add `origin` locally, regardless of
   hosted destination availability. Add or update `base` locally in either
   mode, and do not use the original source to create `origin`. If no project
   URL is available, ask for it before adding or changing `origin`.
   If normalized `origin` and `base` URLs are identical, treat that as a
   remote-role collision. Do not infer a fork, history reset, or cleanup from
   the collision; report it and ask which project and upstream roles are
   intended.
   If the project `origin` is absent, empty, or has no published project ref,
   record that local remote setup is incomplete. Do not infer a history
   operation or hosted-publication requirement from that state; use the
   explicit history disposition above.
   If a required URL or branch cannot be discovered from repository
   documentation or Git metadata, ask before changing remotes.

   Stop before deletion, history replacement, or unresolved identity changes
   when the required decision is missing. A user response approving the
   proposed deletion set is the required cleanup decision; do not infer it from
   the initial fork invocation or from the fact that the repository is no
   longer on the original history.

   If the invocation supplies no fork parameters or leaves the next operation
   unresolved, do not finish with an inventory report that merely says no
   changes were made. Present the discovered context and ask the user to
   choose a next step:

   - choose whether to preserve or reset the existing Git history, then
     establish a new project identity, including the destination project URL
     and identity-field decisions;
   - prepare the repository as an extension, including its intended `origin`,
     upstream `base`, and synchronization relationship;
   - review candidate demo content and approve an exact cleanup set, without
     deleting anything during the review; or
   - exit without changes.

   Do not change files, remotes, branches, or history until the selected
   operation and any required values are clear.

6. **Apply the non-secret changes.**
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
   - Disable the automatic Bitbucket synchronization trigger by commenting out
     its push trigger or equivalent automatic trigger. Preserve the Bitbucket
     workflow and its manual dispatch entry point unless the user explicitly
     requests that manual execution also be disabled. Do not delete the
     Bitbucket mirror jobs or their configuration.
   - In content-cleanup mode, remove only the approved demo paths. Preserve
     protected paths and shared tooling. Update workspace manifests, lockfiles,
     task configuration, documentation, and references in existing workflow or
     automation files as required by the deletion.
   - Preserve workflow, automation, and coverage configuration files. Update
     them instead of deleting them because an example was removed. Consolidate
     inapplicable package or workspace jobs into one commented example so they
     cannot execute. Preserve the fork workflow-sync CI itself; update its
     references according to Step 9 and update removed paths as required.
   - Remove an `apps/` or `packages/` container only after the approved cleanup
     leaves it empty; never delete a non-empty container as a shortcut.

7. **Refresh workspace tooling.** After Step 6 changes workspace manifests,
   package names, workspace registration, lockfiles, or package paths, always
   complete the root [workspace refresh](../../../AGENTS.md#workspace-refresh),
   including for metadata-only changes or unchanged dependency ranges, before
   invoking the [keys skill](../keys/SKILL.md) or any other workspace-dependent
   command.

8. **Apply environment changes.** For new or reset targets, follow the [keys
   skill](../keys/SKILL.md) full-reset procedure. It selects the targets,
   writes root targets empty and workspace or package targets from their
   matching authored templates, then encrypts all selected targets for an
   environment suffix in one command using the shared repository-root `-fk`
   path. Do not substitute blank workspace files for a required template. If
   an extension leaves the root target unchanged, encrypt only the new target
   with that same root key path. If no target is created or reset, run no
   encryption. If existing values must be retained, use the keys skill's
   data-retaining migration and hand it to the approved secure process; do not
   replace those targets with templates.

9. **Normalize documentation and workflow references.** Replace stale project
   identity in ordinary documentation, badges, manifests, project-owned
   license metadata, scripts, CI, and automation with the confirmed new
   values. Do not rewrite license notices, copyright lines, or attribution
   text merely to update project identity. Use the confirmed project URL for
   consumer-facing project links.

   For generic workflow or automation examples, remove hard-coded references to
   the original project and use the repository's project context, resolved
   remote names, branch inputs, or other repository-neutral expressions. For
   either an independent project or an extension, identify the resulting
   `origin` as the canonical project. When a new project URL is supplied,
   inspect every synchronization workflow and document and classify each as
   either current-project upstream synchronization or future extension
   guidance. For an independent new project, remove the original source and
   `base` reference from tracked documentation, workflows, and automation; the
   original source is retained only through local Git state. Update
   future-extension workflows and documentation so they use the new `origin`
   as their base reference. For an extension, retain the original source as
   `base` for current-project upstream synchronization when that relationship
   is intended, while future-extension guidance uses the new `origin` as its
   base. If one file serves both purposes, parameterize or document the two
   references rather than leaving the roles ambiguous. Make the distinction
   clear between project and base references.

   Do not use broad text substitution. Update each occurrence according to
   whether it is new-project identity, upstream synchronization guidance,
   generic tooling documentation, or an external reference that should remain.
   Repeat the identity scan after editing. Every match for the original owner,
   repository, package, URL, bot, actor, or path must be updated, removed, or
   explicitly classified as preserved attribution or local-only Git metadata.
   Inspect workflow conditions and automation expressions as well as visible
   names and URLs; do not treat a general text scan as complete until those
   references have been classified.

10. **Migrate history only after the required preflight.** Process this step
    only when the user's current instruction explicitly requests a history
    reset. Complete Procedure 1 and the remaining identity and local remote
    configuration checks before replacing history. A reset does not require
    hosted reachability: record any local tracking ref and do not stop solely
    because the new `origin` is unpublished. Do not silently discard local
    commits that are ahead of a remote unless the user explicitly requested the
    reset. Preserve the validated working tree and create the new history from
    it with an orphan-history workflow. Before
    orphaning the requested branch, detach it from any old upstream with:
    `git branch --unset-upstream <branch>`. After the new commit is validated,
    remove only the stale local remote-tracking ref for that branch if it still
    points to the discarded origin history. Never remove `base/*` refs. This
    prevents the reset branch from appearing diverged from an unpublished or
    historical `origin`; do not fetch or compare it against that stale history.
    Do not
    create a recovery branch or temporary recovery reference; the explicit
    history-reset request determines that the existing history is disposable.
    Replace the requested branch only after confirming the new commit contains
    the retained files and no unresolved changes. Do not infer history
    replacement from ordinary fork cleanup. The absence of a merge base only
    indicates unrelated histories; it does not authorize history replacement.
    Resolve shallow or incomplete history and use the `sync` workflow for
    history integration. If the current history is already unrelated or
    appears previously reset, preserve it and report that state when the user
    did not request another history change. Do not rewrite unrelated branches
    or push the result.

11. **Check remotes and original references.** Normalize SSH and HTTPS forms,
    host aliases, case, and a trailing `.git` before comparing URLs. Verify that
    the confirmed project URL is configured as `origin` and the resolved
    original source is configured as the local-only `base` remote in either
    mode. For an independent new project, that `base` remote must not be
    treated as a tracked documentation or workflow reference. Report remotes
    that still point to a different old project when they were not intentionally
    retained. Do not remove or rewrite a remote that the user did not authorize.
    Hosted reachability is not part of this check; configuring the local remotes
    is sufficient because this skill never publishes them.
    If remotes are unavailable, report that the comparison was documentation
    only; Step 2 handles fallback resolution. Do not test hosted authentication
    or publish a remote as part of this skill.

12. **Validate the prepared repository.** Format changed files with the
    repository's formatter and run `git diff --check`. Verify that protected
    paths remain, approved removed workspaces are absent from workspace and task
    configuration, manifests and lockfiles are valid, requested remotes point to
    the confirmed URLs, and no stale old-project identity remains in eligible
    files outside preserved upstream attribution. Check that existing upstream
    attribution was not changed or relocated unless explicitly authorized or
    legally required. Check that ordinary workflow examples no longer present
    the old project as the current repository. When an
    independent new project was selected, verify that no tracked documentation,
    workflow, or automation retains the original source or `base` reference;
    any retained original source must exist only in local Git state. When an
    extension was selected, verify that current-project upstream references
    use the selected `base` and future-extension synchronization references use
    the new `origin`. Verify that the Bitbucket synchronization workflow has no
    active automatic trigger. Record the command result for a full-reset
    encryption path, or the secure process result for a data-retaining path,
    for the selected root and workspace environment targets; do not inspect
    those files to perform this check. For a full reset, report encryption as
    pending only when the approved command failed or could not run. Do not
    claim the fork's CI setup is ready while required encryption remains
    incomplete. Recheck
    `.env.defaults` only for non-secret defaults; do not inspect any other
    environment file. Run remaining repository checks that are available and
    report checks that cannot run until project setup is complete.

13. **Hand off without bootstrap.** Report the selected mode, preserved or
    removed paths, identity fields updated or removed, `origin` or `base`
    additions or updates, CI template replacement and encryption status,
    history-reset result, intentional upstream references, remaining
    unresolved decisions, and validation results. Do not
    run the [bootstrap
    skill](../bootstrap/SKILL.md); the repository is ready for a future,
    separately defined setup workflow.
