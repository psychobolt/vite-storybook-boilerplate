# Agent Guidance

This file is agent-facing guidance for this project. It complements the
human-facing [README](README.md), [development guide](DEVELOPMENT.md), and
[workflows](WORKFLOWS.md); consult those documents for shared commands and
operational details.

## Repository shape

- `apps/` contains application workspaces when an application is part of the
  checked-out project.
- `packages/` contains reusable UI, API, and shared tooling workspaces.
- Never delete `packages/commons`, `packages/stylelint-config`, or
  `packages/unplugged`; they provide shared repository infrastructure.
- Workspace-local `AGENTS.md` files add guidance for the directory they are in.
- Shared configuration and scripts are kept in the repository and shared tooling
  workspaces.

## Environment-file boundary

- Treat every environment file as write-only for agent workflows except the
  workspace's `.env.defaults`, which agents may read for non-secret
  development defaults such as ports. An explicitly authored, tracked static
  environment template at `.apm/skills/keys/references/.env.*` may also be
  read as documentation. This path-specific exception applies only to those
  authored static templates; do not treat them as access to live environment
  files. Never
  read, search, parse, diff, or otherwise inspect `.env`, any workspace-local
  `.env.<environment>`, `.env.keys`, or any other live or secret-bearing
  environment file. The `.env.defaults` exception above remains limited to
  non-secret development defaults.
- Never inspect process environment variables or pass secret-bearing
  environment values to a tool. An ignored file or encrypted file is still
  inaccessible to the agent under this policy.
- Only create or update an environment file when the user explicitly requests
  the change and the content is non-secret, whether supplied directly for
  writing or generated without reading existing environment values. During an
  independent fork identity migration or a package-scaffolding workflow
  governed by the keys skill, the agent may replace an inherited root `.env.*`
  target with an empty file or create a newly required workspace `.env.*`
  target from its matching authored template. It may run the keys skill's
  approved template-encryption commands, plus removal of dotenvx's known
  non-secret `HELLO` sample key, only against those newly written targets. Do
  not read the replaced files, generated `.env.keys`, or command output that
  contains private key values. Do not create or overwrite any other
  secret-bearing environment file from agent tools.
- Use the [keys skill](.apm/skills/keys/SKILL.md) for any operation that requires
  dotenv encryption, decryption, key validation, full reset, or data-retaining
  key migration. If a secure user-controlled process is unavailable for a
  data-retaining migration, stop and explain the boundary.

## Architecture

The project has three workspace types:

- `app-package` workspaces contain application composition, screens, workflows,
  and application-specific behavior.
- `ui-package` workspaces contain reusable presentation components and UI
  building blocks.
- `api-package` workspaces contain reusable business-logic utilities, domain
  services, and API or integration contracts when reuse is intentional.

The detailed purpose, boundaries, and conventions for each workspace belong in
its local `AGENTS.md` and should be established during scaffolding. Applications
compose reusable building blocks from UI and API packages. Base UI elements are
designed around pure HTML capabilities and a template-rendering layer;
framework-specific support adds the integration and behavior required by the
target framework or application.

Keep application-specific orchestration in app packages. Create an API package
for core business logic, domain utilities, or API helpers when the request
indicates that the code is intended for reuse. A UI package may intentionally
connect presentation to business logic only when that is its stated purpose and
its local guidance defines the boundary.

Reusable UI elements, composites, and framework-specific UI components should
remain application-agnostic. Do not add routing, business data access,
permissions, application-owned state, or workflows to them.

### Scaffolding proposal

Before creating a package or workspace, summarize the proposed architecture,
public entrypoint, required libraries and their purposes, validation approach,
and selected reference package or `BASE_REF`. Proceed when the choices are
clear. Ask the user when an architecture, framework, runtime, or dependency
choice would materially affect the result.

Use the [ui-package skill](.apm/skills/ui-package/SKILL.md) for UI-package
scaffolding. Use the [ui-element skill](.apm/skills/ui-element/SKILL.md) for
framework-neutral elements within a UI package, the [ui-composite
skill](.apm/skills/ui-composite/SKILL.md) for framework-neutral composites
within a UI package, and the [ui-component skill](.apm/skills/ui-component/SKILL.md) for
framework-specific UI components within a UI package. The UI-package skill
selects the appropriate implementation-unit procedure when scaffolding a UI
package. Use the
[app-package skill](.apm/skills/app-package/SKILL.md) for app-package
scaffolding, the [api-package skill](.apm/skills/api-package/SKILL.md) for
API-package scaffolding. Use the [todo skill](.apm/skills/todo/SKILL.md) to track skills and
other work that are still in progress or awaiting an established workflow.

### Base reference resolution

When a skill needs a base reference—including the upstream repository and
branch used for synchronization, or a base package or implementation—resolve
it in this order:

1. **Prefer authoritative references.** Use an explicit user-provided
   reference, repository documentation, and configured Git remotes first.
   Validate the resolved branch or path before using it. Do not read
   environment files or process environment variables; an explicitly supplied
   `BASE_REF` may be used as a non-secret reference.
2. **Use local sibling checkouts only as a last resort.** If those sources do
   not yield a usable reference because, for example, the documented upstream
   is inaccessible, inspect sibling directories adjacent to the workspace root
   for a likely local checkout, such as `../base-project`. This is not an
   equivalent source of truth. Verify its repository identity, remotes, branch,
   and requested path, and report that the local fallback was used.
3. **Refresh a usable fallback when possible.** Before using a sibling
   checkout, inspect its worktree and refs. When its `origin` is accessible,
   refresh its refs and synchronize its relevant branch without discarding local
   changes or pushing. A current fetched remote ref may be used without
   changing the sibling worktree.
4. **Fail closed when the fallback is untrusted.** If the sibling checkout
   cannot be verified or synchronized, stop and ask the user for a new base
   reference. Do not silently use stale local files after all other reference
   sources have failed.

### Package dependency contract

Classify dependencies by how the built package uses them. Keep packages used
only by build tools, Storybook, tests, linting, formatting, or declaration
generation in `devDependencies`. If a local workspace package is required at
runtime, treat it as a consumer dependency; when the package is public, list it
in `peerDependencies` and document its installation in the package README.
Treat a type-only import as a consumer dependency when it appears in emitted
declarations. Classify it as a regular dependency or peer dependency according
to the package's public contract; keep it in `devDependencies` only when the
type is erased or remains internal to the package.
Use the repository's documented package-manager workflow to update manifests
and lockfiles.

### Workspace refresh

After changing workspace manifests, package names, workspace registration,
lockfiles, or package paths, inspect `git status` and the relevant diff. Always
complete the refresh; do not skip it because the edit is metadata-only or
dependency ranges are unchanged. Use the repository and workspace linker
configuration to determine the affected scope: run `yarn install` from the
repository root for affected PnP workspaces, and run `yarn bootstrap` for
affected non-PnP workspaces. If both scopes are affected, run `yarn install`
before `yarn bootstrap`. Inspect `git status` and the relevant diff again after
each command; bootstrap may update generated files. If a required command
fails, stop before dependent commands and report the failure.

### Shared package procedure

Apply this procedure when scaffolding an app, API, or UI package:

1. **Inspect reference context.** Read the nearest `AGENTS.md`, README, and
   relevant package configuration.
   Inspect the worktree and preserve unrelated changes. Scan the selected
   reference's `package.json`, workspace/task configuration, `.env.defaults`,
   package workflow, and usage documentation for its contract. Do not open
   secret-bearing environment files or inspect process environment variables.
2. **Confirm the package contract.** Confirm the package boundary, runtime,
   public entrypoint, required libraries, and validation approach before
   creating files. Ask when a material choice is unspecified.
3. **Select a reference.** Select the closest local reference. If none exists,
   resolve and validate an explicit `BASE_REF` or documented base reference
   using [base reference resolution](#base-reference-resolution). Inspect only
   paths that exist in that Git tree and stop if no usable reference remains.
4. **Preserve package integration.** Preserve or intentionally adapt package
   metadata, workspace registration, and
   every script required by the reference. Audit `build`, `build-dts` or other
   declaration builds when present, `dev`, `format`, `prepack`, `start`,
   `test`, `coverage`, `chromatic`, `lcov`, watch, and package-specific
   integration scripts;
   do not omit an existing script without a reason. Apply the root [package
   dependency contract](#package-dependency-contract) when adding or changing
   dependencies. Apply the [workspace refresh](#workspace-refresh) after these
   changes and before any workspace-dependent command.
5. **Normalize metadata and environment.** Normalize copied names and paths in
   manifests, source entrypoints, READMEs, CI, and supported service
   configuration. When a package requires an encrypted `.env.*`, use the
   [keys skill](.apm/skills/keys/SKILL.md) to resolve its matching template,
   target scope, and encryption path. For a newly created package, use the
   keys skill's package-enrollment path only when the package documentation
   establishes that target. Existing environment files and data-retaining
   migrations must use an approved user-controlled secure process. Agents must
   not read live environment files, private keys, or secret-bearing environment
   variables, or invoke commands that load them outside the keys skill's
   documented new-target exception. Keep the project private key outside the
   agent-accessible workspace and never copy secret values between workspaces.
6. **Assign ports and derive outputs.** Assign a distinct development port by
   inspecting each workspace's `.env.defaults` and choosing the next available
   port. If the required default is unavailable, ask rather than opening any
   other environment file. Derive package exports and type paths from actual
   build artifacts rather than copied filenames.
7. **Set up coding tools.** Discover the repository's coding tools and framework
   or runtime tooling
   before implementing source. Keep editor-only tooling separate from package
   dependencies, and refresh generated workspace SDKs when the repository
   requires it.
8. **Validate and report.** Format changed files, run the established package
   checks, verify the
   expected build artifacts and package entrypoints, and report the formatter,
   validation performed, and any checks that could not run. Scan for stale
   references before finishing.

## Working principles

- Read the nearest guidance and relevant source context before changing files.
- Keep changes focused and preserve unrelated worktree changes.
- Before and after running any command that may modify files, inspect `git
status` and the relevant diff. Preserve changes that existed before the
  command, including ambiguous or tool-generated changes; never restore a
  file to `HEAD` without explicit user approval.
- Treat root and nested README, development, workflow, and usage documents as
  human-facing documentation. Read them for context and update them when the
  requested package or workflow requires synchronized public install, API, or
  usage documentation. Otherwise preserve them.
- Keep each workspace aligned with its type and nearest local guidance rather
  than applying UI, app, or API conventions interchangeably.
- Follow the repository and workspace configuration rather than introducing new
  conventions.

## Workflow skills

For CI failures, blocked pull requests, dependency-update checks, package
scaffolding, or component creation, use the appropriate guidance under
`.apm/skills/`.

- Prefer workspace-managed CLI binaries. When a command is provided by a
  workspace dependency, invoke it through Yarn (`yarn <command>`) instead of
  an ad hoc package runner. Use `npx` only when no local binary exists or the
  user explicitly requests it; do not install dependencies implicitly.
- Use the skills CLI for discovery or explicitly requested personal or ad hoc
  installs. When a skill should belong to this repository, install it through
  APM (`apm install ... [--skill ...]`) so `apm.yml`, `apm.lock.yaml`, and the
  configured deployments remain synchronized. Do not use the Skills CLI's
  project installation, update, or removal commands to manage repository-owned
  skills.

Run the [keys skill](.apm/skills/keys/SKILL.md)
before workflows that create, reset, or re-encrypt repository dotenv files. The
[app-component skill](.apm/skills/app-component/SKILL.md) is for creating or
extending application-owned elements, composites, or components within an app
package. The
[bootstrap skill](.apm/skills/bootstrap/SKILL.md) is reserved for future project
setup orchestration and should use the keys skill when implemented. The
[fork skill](.apm/skills/fork/SKILL.md) prepares independent forks through
identity migration or explicitly confirmed content cleanup, with optional
history and remote migration, without invoking the unfinished bootstrap
workflow.
The [sync skill](.apm/skills/sync/SKILL.md) synchronizes `origin/main` with
`base/main`, including unrelated-history integration when required.
Use the [todo skill](.apm/skills/todo/SKILL.md) to track placeholder or otherwise
unestablished skills and setup work. Treat the checked-out branch's
CI configuration as authoritative.

For UI work, use the [ui-package skill](.apm/skills/ui-package/SKILL.md) for package
scaffolding. That skill delegates implementation units to the matching
[ui-element](.apm/skills/ui-element/SKILL.md),
[ui-composite](.apm/skills/ui-composite/SKILL.md), or
[ui-component](.apm/skills/ui-component/SKILL.md) procedure. Use the
[app-component skill](.apm/skills/app-component/SKILL.md) only for application-owned units inside
an app package.

When a skill, bundled reference, or relevant workflow dependency changes, use
the [todo skill](.apm/skills/todo/SKILL.md) to update its testing register and reset
the affected tally to `0`.

### Workflow and documentation guidance

- Before editing a file, apply any matching file-scoped instructions authored
  under `.apm/instructions/` and deployed by APM. These instructions supplement
  the active skill and nearest `AGENTS.md`; they do not replace them. If the
  target instructions have not been deployed, read the matching authored
  source before changing the file.
- Format changed files before running relevant linters. Prefer `yarn g:format`
  or the documented workspace formatter. If the file type has no configured
  formatter, find and add the appropriate Prettier plugin in the workspace or
  shared `commons` tooling. If no suitable formatter exists, format manually
  and report that limitation with the checks performed.

### Skill structure

Authored skills live at `.apm/skills/<name>/SKILL.md` and follow the layout at
https://agentskills.io/home so they stay consistent across whichever
agent/tool consumes them:

```
.apm/skills/<name>/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories
```

Only add `scripts/`, `references/`, or `assets/` when a skill actually needs
them; a single `SKILL.md` is sufficient otherwise. Do not add product-specific
metadata directories for repository-local skills. If a skill creation tool
generates product-specific metadata files or directories, remove them before
completing the skill.

Authored file-scoped instructions live at `.apm/instructions/` and are deployed
to supported agent targets by APM. Do not author or maintain duplicate
instruction files in generated target directories.

### APM source and deployment

- Treat every file under `.apm/` as repository-authored source. After changing
  any `.apm/` file, run `apm install` from the repository root to synchronize
  the configured agent targets. Do not manually edit generated target
  directories. If APM is unavailable, report that deployment could not be
  synchronized.
- At the start of every agent workflow, verify that the configured harness
  deployments contain the current authored skills and file-scoped instructions
  from `.apm/` by running `apm audit --ci`. If the audit reports any missing or
  stale deployment, run `apm install --frozen` from the repository root and
  rerun `apm audit --ci` before relying on repository-local guidance. If frozen
  installation reports that `apm.yml` and `apm.lock.yaml` are out of sync,
  reconcile the authored APM changes with plain `apm install`, then rerun the
  audit. Treat a passing `apm audit --ci` as deployment verification; file
  presence alone is insufficient.
