# Agent Guidance

This file is agent-facing guidance for this project. It complements the human-facing [README](README.md), [development guide](DEVELOPMENT.md), and [workflows](WORKFLOWS.md); consult those documents for shared commands and operational details.

## Agent preflight

Run this preflight before task execution or orchestration.

1. **Record repository state.** Inspect the current branch, worktree status (`git status --short`), and relevant diffs to distinguish existing work from changes made during the task.
2. **Check incoming guidance and documentation.** Resolve origin's primary branch from its default-branch metadata and repository documentation (`origin/main` in this project), then fetch it without switching branches or changing the worktree. Identify incoming changes since the merge base under `.apm/` and to all Markdown files throughout the repository, including workspaces. Include additions, deletions, and renames. Compare affected paths with the current branch so local-only differences and changes already incorporated are not mistaken for incoming updates. If any incoming file changes remain unapplied, stop, list the affected paths, and ask the user to update the current branch from origin's primary branch before proceeding. Do not perform that update automatically. If the remote, branch, or history needed for this check is unavailable, stop and explain why freshness could not be verified.
3. **Verify local deployment.** Run `apm audit --ci` to verify that configured harness deployments contain the current authored skills and file-scoped instructions from `.apm/`. If the audit reports missing or stale deployment, run `apm install --frozen` from the repository root and rerun the audit. If frozen installation reports that `apm.yml` and `apm.lock.yaml` are out of sync, reconcile the authored APM changes with plain `apm install`, then rerun the audit. Treat a passing audit as deployment verification; file presence alone is insufficient.
4. **Apply task guidance.** Read the nearest `AGENTS.md`, relevant source context, and applicable task skill under `.apm/skills/`. Before editing any file, apply its matching deployed file-scoped instructions. They supplement the active skill and nearest `AGENTS.md`.

   Before editing authored AI guidance in AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, or files under .apm/skills/, .apm/instructions/, or .apm/prompts/, apply the [agent-guidance instruction](.apm/instructions/agent-guidance.instructions.md) as a required review gate. This gate does not apply to the human-maintained WORKFLOWS.md.

## Repository shape

- `apps/` contains application workspaces.
- `packages/` contains reusable UI, API, and shared tooling workspaces.
- Never delete `packages/commons`, `packages/stylelint-config`, or `packages/unplugged`; they provide shared repository infrastructure.
- Workspace-local `AGENTS.md` files add guidance for the directory they are in.
- Shared configuration and scripts are kept in the repository and shared tooling workspaces.

## Environment-file boundary

- Treat every environment file as write-only for agent workflows except the workspace's `.env.defaults`, which agents may read for non-secret development defaults such as ports. An explicitly authored, tracked static environment template at `.apm/skills/keys/references/.env.*` may also be read as documentation. This path-specific exception applies only to those authored static templates; do not treat them as access to live environment files. Never read, search, parse, diff, or otherwise inspect `.env`, any workspace-local `.env.<environment>`, `.env.keys`, or any other live or secret-bearing environment file.
- Never inspect process environment variables or pass secret-bearing environment values to a tool. An ignored file or encrypted file is still inaccessible to the agent under this policy. Never copy secret values between workspaces.
- Only create or update an environment file when the user explicitly requests the change and the content is non-secret, whether supplied directly for writing or generated without reading existing environment values. During an independent fork identity migration or a package-scaffolding workflow governed by the keys skill, the agent may replace an inherited root `.env.*` target with an empty file or create a newly required workspace `.env.*` target from its matching authored template. After the root target is encrypted, a workspace target may be cloned from it to carry the public key. Remove the clone's trailing blank line, preserve its normal final newline, and then stitch in the matching template; it remains unencrypted. It may run the keys skill's approved template-encryption commands, plus removal of dotenvx's known non-secret `HELLO` sample key, only against the newly written root target. Do not read the replaced files, generated `.env.keys`, or command output that contains private key values. Do not create or overwrite any other secret-bearing environment file from agent tools.
- Use the [keys skill](.apm/skills/keys/SKILL.md) for any operation that requires dotenv encryption, decryption, key validation, full reset, or data-retaining key migration. If a secure user-controlled process is unavailable for a data-retaining migration, stop and explain the boundary.

## Architecture

The project has three workspace types:

- `app-package` workspaces contain application composition, screens, workflows, and application-specific behavior.
- `ui-package` workspaces contain reusable presentation components and UI building blocks.
- `api-package` workspaces contain reusable business-logic utilities, domain services, and API or integration contracts when reuse is intentional.

The detailed purpose, boundaries, and conventions for each workspace belong in its local `AGENTS.md` and should be established during scaffolding. Applications compose reusable building blocks from UI and API packages. Base UI elements are designed around pure HTML capabilities and a template-rendering layer; framework-specific support adds the integration and behavior required by the target framework or application.

A UI package may intentionally connect presentation to business logic only when that is its stated purpose and its local guidance defines the boundary.

Reusable UI elements, composites, and framework-specific UI components should remain application-agnostic. Do not add routing, business data access, permissions, application-owned state, or workflows to them.

### Scaffolding proposal

Before creating a package or workspace, summarize the proposed architecture, public entrypoint, required libraries and their purposes, validation approach, and selected reference package or `BASE_REF`. Proceed when the choices are clear. Ask the user when an architecture, framework, runtime, or dependency choice would materially affect the result.

Use the [ui-package skill](.apm/skills/ui-package/SKILL.md) for UI-package scaffolding. Use the [ui-element skill](.apm/skills/ui-element/SKILL.md) for framework-neutral elements, the [ui-composite skill](.apm/skills/ui-composite/SKILL.md) for framework-neutral composites, and the [ui-component skill](.apm/skills/ui-component/SKILL.md) for framework-specific components within a UI package. The UI-package skill selects the appropriate implementation-unit procedure when scaffolding a UI package. Use the [app-package skill](.apm/skills/app-package/SKILL.md) for app-package scaffolding and the [api-package skill](.apm/skills/api-package/SKILL.md) for API-package scaffolding.

### Base reference resolution

When a skill needs a base reference—including the upstream repository and branch used for synchronization, or a base package or implementation—resolve it in this order:

1. **Prefer authoritative references.** Use an explicit user-provided reference, repository documentation, and configured Git remotes first. Validate the resolved branch or path before using it. An explicitly supplied `BASE_REF` may be used as a non-secret reference within the [environment-file boundary](#environment-file-boundary).
2. **Use local sibling checkouts only as a last resort.** If those sources do not yield a usable reference because, for example, the documented upstream is inaccessible, inspect sibling directories adjacent to the workspace root for a likely local checkout, such as `../base-project`. This is not an equivalent source of truth. Verify its repository identity, remotes, branch, and requested path, and report that the local fallback was used.
3. **Refresh a usable fallback when possible.** Before using a sibling checkout, inspect its worktree and refs. When its `origin` is accessible, refresh its refs and synchronize its relevant branch without discarding local changes or pushing. A current fetched remote ref may be used without changing the sibling worktree.
4. **Fail closed when the fallback is untrusted.** If the sibling checkout cannot be verified or synchronized, stop and ask the user for a new base reference. Do not silently use stale local files after all other reference sources have failed.

### Package dependency contract

Classify dependencies by how the built package uses them. Keep packages used only by build tools, Storybook, tests, linting, formatting, or declaration generation in `devDependencies`. If a local workspace package is required at runtime, treat it as a consumer dependency; when the package is public, list it in `peerDependencies` and document its installation in the package README. Treat a type-only import as a consumer dependency when it appears in emitted declarations. Classify it as a regular dependency or peer dependency according to the package's public contract; keep it in `devDependencies` only when the type is erased or remains internal to the package.

When a `resolutions` fix targets a transitive dependency rather than a declared direct dependency, identify its actual parent in the resolved dependency graph and use a parent-qualified selector, such as `parent/child`, instead of a bare child package name. Follow [Yarn's resolution selector syntax](https://yarnpkg.com/configuration/manifest#resolutions), adding a parent version qualifier when needed to target the intended dependency edge, and verify the resolved result.

Use the repository's documented package-manager workflow to update manifests and lockfiles.

### Non-PnP workspace integration

For a package intentionally excluded from Plug'n'Play (PnP):

- Add its workspace path to the root `.yarnrc.yml` `pnpIgnorePatterns`.
- Keep each workspace package reference in the manifest section required by the package contract—`dependencies`, `devDependencies`, `peerDependencies`, or `optionalDependencies`—and preserve its `workspace:` protocol or explicit version metadata. Do not replace that package dependency entry with a portal.
- Add a relative `portal:` resolution in the non-PnP workspace's `resolutions` for each workspace package that it must resolve through the non-PnP linker. Keep those paths synchronized when workspace packages move or are renamed.

### Workspace refresh

After changing workspace manifests, package names, workspace registration, lockfiles, or package paths, always complete the refresh, even for metadata-only edits or unchanged dependency ranges. Use the repository and workspace linker configuration to determine the affected scope: run `yarn install` from the repository root for affected PnP workspaces, and run `yarn bootstrap` for affected non-PnP workspaces. If both scopes are affected, run `yarn install` before `yarn bootstrap`. Review generated changes, including bootstrap output, under the [working principles](#working-principles). If a required command fails, stop before dependent commands and report the failure.

### Shared package procedure

Apply this procedure when scaffolding or updating an app, API, or UI package:

1. **Inspect reference context.** Read the nearest `AGENTS.md`, README, and relevant package configuration. Scan the selected reference's `package.json`, workspace/task configuration, `.env.defaults`, package workflow, and usage documentation for its contract. Before changing a package command or utility, inspect its nearest README, development, and usage documentation plus comparable package docs. Update each document that describes the changed contract, preserve intentional package-specific differences, and scan for stale names, paths, commands, or examples.
2. **Confirm the package contract.** Apply the [scaffolding proposal](#scaffolding-proposal) before creating a workspace; for updates, ask about unspecified material changes to the existing contract.
3. **Select a reference.** Select the closest local reference. If none exists, resolve and validate an explicit `BASE_REF` or documented base reference using [base reference resolution](#base-reference-resolution). Inspect only paths that exist in that Git tree and stop if no usable reference remains.
4. **Preserve package integration.** Preserve or intentionally adapt package metadata, workspace registration, and every script required by the reference. Audit `build`, `build-dts` or other declaration builds when present, `dev`, `format`, `prepack`, `start`, `test`, `coverage`, `chromatic`, `lcov`, watch, and package-specific integration scripts; do not omit an existing script without a reason. Apply the root [package dependency contract](#package-dependency-contract) when adding or changing dependencies. For a non-PnP workspace, apply the [non-PnP workspace integration](#non-pnp-workspace-integration) whenever the package is created or updated. Apply the [workspace refresh](#workspace-refresh) after these changes and before any workspace-dependent command.
5. **Normalize metadata and environment.** Normalize copied names and paths in manifests, source entrypoints, READMEs, CI, and supported service configuration. When a package requires an `.env.*` target, use the [keys skill](.apm/skills/keys/SKILL.md) to resolve its matching template, target scope, and permitted encryption path. For a new package, use the package-enrollment path only when the package documentation establishes that target. Follow the root [environment-file boundary](#environment-file-boundary) for all such work.
6. **Assign ports and derive outputs.** Assign a distinct development port by inspecting each workspace's `.env.defaults` and choosing the next available port. If the required default is unavailable, ask. Derive package exports and type paths from actual build artifacts rather than copied filenames.
7. **Set up coding tools.** Discover the repository's coding tools and framework or runtime tooling before implementing source. Keep editor-only tooling separate from package dependencies, and refresh generated workspace SDKs when the repository requires it.
8. **Validate and report.** Format changed files, run the established package checks, verify the expected build artifacts and package entrypoints, and report the formatter, validation performed, and any checks that could not run. Scan for stale references before finishing.

## Working principles

- Keep changes focused on the requested task.
- Before and after running any command that may modify files, inspect worktree status (`git status --short`) and the relevant diff. Preserve pre-existing changes, including ambiguous or tool-generated changes; never restore a file to `HEAD` without explicit user approval.
- Treat root and nested README, development, workflow, and usage documents as human-facing documentation. Read them for context and update them when the requested package or workflow requires synchronized public install, API, or usage documentation. Otherwise preserve them. When correcting names, URLs, paths, or commands, preserve surrounding wording and section order; adjust grammar only as required by the correction. Add explanations or rephrase prose only when requested or necessary for accuracy.
- Keep each workspace aligned with its type and nearest local guidance rather than applying UI, app, or API conventions interchangeably.
- Follow repository and workspace configuration and conventions. Before recommending or implementing a change, verify its assumptions against current source and relevant authoritative documentation. Prefer configured values and supported public APIs over hardcoded assumptions or internal APIs. Account for documented variations in workspaces, providers, and versions; state material compatibility limits. Keep the solution proportional to established requirements rather than adding speculative abstractions.

## Workflow skills

- Prefer workspace-managed CLI binaries. When a command is provided by a workspace dependency, invoke it through Yarn (`yarn <command>`) instead of an ad hoc package runner. Use `npx` only when no local binary exists or the user explicitly requests it; do not install dependencies implicitly.
- Use the skills CLI for discovery or explicitly requested personal or ad hoc installs. When a skill should belong to this repository, install it through APM (`apm install ... [--skill ...]`) so `apm.yml`, `apm.lock.yaml`, and the configured deployments remain synchronized. Do not use the Skills CLI's project installation, update, or removal commands to manage repository-owned skills.

The [app-component skill](.apm/skills/app-component/SKILL.md) is for creating or extending application-owned elements, composites, or components within an app package. The [bootstrap skill](.apm/skills/bootstrap/SKILL.md) is reserved for future project setup orchestration and should use the keys skill when implemented. The [fork skill](.apm/skills/fork/SKILL.md) prepares independent forks through identity migration or explicitly confirmed content cleanup, with optional history and remote migration, without invoking the unfinished bootstrap workflow. The [sync skill](.apm/skills/sync/SKILL.md) synchronizes `origin/main` with `base/main`, including unrelated-history integration when required. When performing a base-project sync, use the sync skill's preflight to discover and read updated guidance from the resolved base. Use the [todo skill](.apm/skills/todo/SKILL.md) to track placeholder or otherwise unestablished skills and setup work. Treat the checked-out branch's CI configuration as authoritative.

When a skill, its bundled reference, linked instruction, or a dependency used by its workflow changes, use the [todo skill](.apm/skills/todo/SKILL.md) to update its testing register and reset the affected tally to `0`.

### Workflow and documentation guidance

- Format changed files before running relevant linters. Prefer `yarn g:format` or the documented workspace formatter. If the file type has no configured formatter, find and add the appropriate Prettier plugin in the workspace or shared `commons` tooling. If no suitable formatter exists, format manually and report that limitation with the checks performed.

### Skill structure

Authored skills live at `.apm/skills/<name>/SKILL.md` and follow the layout at https://agentskills.io/home so they stay consistent across whichever agent/tool consumes them:

```
.apm/skills/<name>/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories
```

Only add `scripts/`, `references/`, or `assets/` when a skill actually needs them; a single `SKILL.md` is sufficient otherwise. Do not add product-specific metadata directories for repository-local skills. If a skill creation tool generates product-specific metadata files or directories, remove them before completing the skill.

Authored file-scoped instructions live at `.apm/instructions/` and are deployed to supported agent targets by APM. Do not author or maintain duplicate instruction files in generated target directories.

### APM source and deployment

- Treat every file under `.apm/` as repository-authored source. After changing any `.apm/` file, run `apm install` from the repository root to synchronize the configured agent targets. Do not manually edit generated target directories. If APM is unavailable, report that deployment could not be synchronized.

### APM lockfile changes

When an APM install changes `apm.lock.yaml`, apply this follow-up:

1. **Inspect the change and CLI.** Compare the lockfile with its pre-install state, preserving any existing user edits. Check whether the installed APM CLI is current for its configured release source; check for available updates without installing them. If it is outdated, ask the user to update it and recheck before proceeding with this follow-up. If the version cannot be verified, report that and defer this follow-up.
2. **Assess base synchronization.** Resolve and refresh the project and base refs, then compare their synchronization state using the [sync skill](.apm/skills/sync/SKILL.md) history model without merging or committing changes. Account for unrelated histories and squash imports; ancestry alone cannot establish their synchronization state. If the state cannot be verified, report it as unknown.
3. **Request the next step.** If the project is behind its base, ask the user to initiate a sync. If a sync is already underway, continue its review rather than requesting another. If the project is current, present the lockfile changes generated by the current APM CLI and ask the user to review and commit them. Do not commit or discard changes automatically.
