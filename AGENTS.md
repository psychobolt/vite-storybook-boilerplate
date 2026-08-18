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
  workspace's `.env.defaults`, which is the only environment file agents may
  read for non-secret development defaults such as ports. Never read, search,
  parse, diff, or otherwise inspect `.env`, `.env.ci`, or any other environment
  file.
- Never inspect process environment variables or pass secret-bearing
  environment values to a tool. An ignored file or encrypted file is still
  inaccessible to the agent under this policy.
- Only create or update an environment file when the user explicitly requests
  the change and the content is non-secret, whether supplied directly for
  writing or generated without reading existing environment values. Do not
  overwrite or rotate existing secret-bearing files from agent tools.
- Use the [keys skill](.agents/keys/SKILL.md) for any operation that requires
  dotenv encryption, decryption, key validation, rotation, or existing secret
  values. If a secure user-controlled process is unavailable, stop and explain
  the boundary.

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

Use the [ui-package skill](.agents/ui-package/SKILL.md) for UI-package
scaffolding. Use the [ui-element skill](.agents/ui-element/SKILL.md) for
framework-neutral elements within a UI package, the [ui-composite
skill](.agents/ui-composite/SKILL.md) for framework-neutral composites within a
UI package, and the [ui-component skill](.agents/ui-component/SKILL.md) for
framework-specific UI components within a UI package. The UI-package skill
selects the appropriate implementation-unit procedure when scaffolding a UI
package. Use the
[app-package skill](.agents/app-package/SKILL.md) for app-package scaffolding,
the [api-package skill](.agents/api-package/SKILL.md) for API-package
scaffolding. Use the [todo skill](.agents/todo/SKILL.md) to track skills and
other work that are still in progress or awaiting an established workflow.

### Package dependency contract

Classify dependencies by how the built package uses them. Keep packages used
only by build tools, Storybook, tests, linting, formatting, or declaration
generation in `devDependencies`. If a local workspace package is required at
runtime, treat it as a consumer dependency; when the package is public, list it
in `peerDependencies` and document its installation in the package README.
Use the repository's documented package-manager workflow to update manifests
and lockfiles.

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
   resolve and validate `BASE_REF` using an approved user-controlled
   environment-loading workflow; do not read environment files or private
   keys. Inspect only paths that exist in that Git tree and stop if the
   reference is unavailable because its secure access prerequisite is missing.
4. **Preserve package integration.** Preserve or intentionally adapt package
   metadata, workspace registration, and
   every script required by the reference. Audit `build`, `build-dts` or other
   declaration builds when present, `dev`, `format`, `prepack`, `start`,
   `test`, `coverage`, `chromatic`, `lcov`, watch, and package-specific
   integration scripts;
   do not omit an existing script without a reason. Apply the root [package
   dependency contract](#package-dependency-contract) when adding or changing
   dependencies.
5. **Normalize metadata and environment.** Normalize copied names and paths in
   manifests, source entrypoints, READMEs, CI, and supported service
   configuration. When a package requires an encrypted `.env.ci`, use the
   [keys skill](.agents/keys/SKILL.md) to hand the operation to an approved
   user-controlled secure process. Agents must not read, write, or invoke
   commands that load `.env` or `.env.ci` files, private keys, or secret-bearing
   environment variables. Keep the project private key outside the
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
scaffolding, or component creation, use the appropriate guidance under `.agents/`.
Run the [keys skill](.agents/keys/SKILL.md)
before workflows that create or rotate repository dotenv encryption keys. The
[app-component skill](.agents/app-component/SKILL.md) is for creating or
extending application-owned elements, composites, or components within an app
package. The
[bootstrap skill](.agents/bootstrap/SKILL.md) is reserved for future project
setup orchestration and should use the keys skill when implemented. The
[fork skill](.agents/fork/SKILL.md) handles clean-project fork cleanup and
identity normalization without invoking the unfinished bootstrap workflow.
Use the [todo skill](.agents/todo/SKILL.md) to track placeholder or otherwise
unestablished skills and setup work. Treat the checked-out branch's
CI configuration as authoritative.

For UI work, use the [ui-package skill](.agents/ui-package/SKILL.md) for package
scaffolding. That skill delegates implementation units to the matching
[ui-element](.agents/ui-element/SKILL.md),
[ui-composite](.agents/ui-composite/SKILL.md), or
[ui-component](.agents/ui-component/SKILL.md) procedure. Use the [app-component
skill](.agents/app-component/SKILL.md) only for application-owned units inside
an app package.

When a skill, bundled reference, or relevant workflow dependency changes, use
the [todo skill](.agents/todo/SKILL.md) to update its testing register and reset
the affected tally to `0`.

### Agent-facing formatting

- Use numbered steps for ordered actions. Begin each step with a short bold
  intent, then keep its instructions together.
- Use bullets for independent rules, constraints, alternatives, or examples.
- Use short paragraphs for definitions and context. Do not place several
  unrelated actions in one paragraph.
- Keep shared rules in references and have the skill procedure point to them;
  avoid repeating the same rule in both places.
- When a skill has local references, use those references as the task-specific
  entrypoint and follow their links to shared guidance. Keep common rules in
  shared references and unit-specific rules in local references.
- Keep validation in the procedure when the skill has an execution workflow;
  do not add a duplicate checklist. Make additional validation conditional on
  the artifact that exists—for example, require an additional variant or
  composition render only when that variant or composition is defined.
- Format changed files before running relevant linters. Prefer `yarn g:format`
  or the documented workspace formatter. If the file type has no configured
  formatter, find and add the appropriate Prettier plugin in the workspace or
  shared `commons` tooling. If no suitable formatter exists, format manually
  and report that limitation with the checks performed.

### Skill structure

New skills live at `.agents/<name>/SKILL.md` and follow the layout at
https://agentskills.io/home so they stay consistent across whichever
agent/tool consumes them:

```
.agents/<name>/
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
