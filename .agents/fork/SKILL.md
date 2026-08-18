---
name: fork
description: Clean a repository fork by removing original demo content and base-repository identity references while preserving protected infrastructure. Use before project-specific setup; do not invoke bootstrap.
---

# Fork

Prepare a clean project fork without running the unfinished bootstrap workflow.
The fork procedure removes the original repository's demo scope and identity
references, preserves shared infrastructure, and stops with a handoff for
later project setup.

## Protected scope

- Preserve every path protected by the root [repository shape
  guidance](../../AGENTS.md#repository-shape); do not duplicate or override
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
   workspace configuration, and the repository workflow documentation. Inspect
   the worktree and preserve unrelated changes. Record the current branch,
   remotes, workspace list, protected paths, and candidate demo paths without
   changing files.
2. **Inventory original identity.** Search eligible tracked and source files
   for the original repository name, owner, repository URL, package names,
   author or organization, documentation links, CI references, service
   identifiers, and remote names. Exclude secret-bearing environment files,
   generated output, dependencies, and Git internals from content scans. Keep
   generic tooling names such as Storybook, Vite, Yarn, and shared package names
   unless they are specifically part of the original project identity. Inspect
   Git remotes with `git remote -v` or `git remote get-url --all <remote>` and
   record their URLs as Git metadata, not repository content.
3. **Confirm cleanup and identity.** Present the proposed deletion set and the
   original identity fields that need replacement. Ask the user for values that
   are required by the package manager or project configuration, including the
   new root package name and repository identity when those fields are retained.
   For optional manifest properties such as `repository`, `homepage`, `bugs`,
   `funding`, `author`, or an original project description, remove the property
   when the user does not provide a replacement. Do not request secret tokens
   or private keys in chat; route those through the approved secure workflow.
   Stop before deletion or identity changes when a required value or deletion
   decision is unresolved.
4. **Remove demo content.** After confirmation, remove only the approved demo
   applications and packages. Preserve the protected paths and any shared
   tooling required by the remaining workspace. Update workspace manifests,
   lockfiles, task configuration, documentation, and references within
   existing workflow and automation files as required by the deletion.
   Preserve the workflow, automation, and coverage configuration files
   themselves; update them to omit removed folders and files instead of
   deleting them because their original examples are gone. Preserve the
   workflow synchronization documentation in `WORKFLOWS.md`, including its
   `Syncing With Original Fork` section and commands. Keep the fork
   workflow-sync CI unchanged. If CI jobs for removed packages or workspaces
   become inapplicable, consolidate them
   into one commented job example so they cannot execute; do not retain
   separate commented or disabled copies for each removed workspace. Remove an
   `apps/` or `packages/` container only after the approved cleanup leaves it
   empty; never delete a non-empty container as a cleanup shortcut.
5. **Normalize repository identity.** Update the confirmed non-secret identity
   values across eligible manifests, README and workflow documentation, CI
   configuration, package metadata, badges, URLs, and scripts. Remove optional
   original properties when no replacement was supplied. Use exact, reviewed
   replacements rather than broad text substitution, and do not alter generic
   dependency or tool references. Preserve the `Syncing With Original Fork`
   section in `WORKFLOWS.md` as intentional synchronization guidance; do not
   remove or normalize its original-repository reference as stale identity.
   Preserve existing coverage configuration files; only update references to
   removed paths when necessary.
   Do not modify secret-bearing environment files; leave encrypted
   configuration for the keys workflow.
6. **Check original repository references.** During cleanup, identify and
   confirm the original repository URL from repository metadata, documentation,
   workflow or automation configuration, or Git remotes before comparing remote
   URLs. Normalize SSH and HTTPS forms, host aliases, case, and a trailing
   `.git` before comparing. Report remotes that still point to the original
   repository, but do not rewrite `origin` as part of fork cleanup. If the
   references disagree and the original URL cannot be confirmed, report the
   comparison as indeterminate rather than guessing. Remove an obsolete `base`
   remote only with explicit user approval; remote cleanup is optional and not
   required for working-tree cleanup. Do not rewrite commit history.
7. **Validate the clean fork.** Format changed files with the repository's
   formatter and run `git diff --check`. Verify that protected paths remain,
   removed workspaces are absent from workspace and task configuration, edited
   manifests are valid, and no original identity references remain in eligible
   files except the preserved `Syncing With Original Fork` guidance. Recheck
   `.env.defaults` only for non-secret defaults; do not inspect any other
   environment file. Run the remaining repository checks that are available
   after cleanup and report checks that cannot run until project identity or
   bootstrap setup is complete.
8. **Hand off without bootstrap.** Report removed paths, preserved protected
   infrastructure, updated or removed manifest properties, unresolved identity
   values, remaining non-secret references, and validation results. Do not run
   the [bootstrap skill](../bootstrap/SKILL.md); the cleaned repository is ready
   for a future, separately defined setup workflow.
