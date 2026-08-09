# Agent Guidance

This file is agent-facing guidance for this project. It complements the
human-facing [README](README.md), [development guide](DEVELOPMENT.md), and
[workflows](WORKFLOWS.md); consult those documents for shared commands and
operational details.

## Repository shape

- `apps/` contains application workspaces.
- `packages/` contains reusable UI and shared tooling workspaces.
- Workspace-local `AGENTS.md` files add guidance for the directory they are in.
- Shared configuration and scripts are kept in the repository and shared tooling
  workspaces.

## Architecture

Applications compose reusable building blocks from UI packages. Base elements
are designed around pure HTML capabilities and a template-rendering layer.
Framework-specific support adds the integration and behavior required by an
application.

Business logic generally belongs in app workspaces, not reusable UI packages. A
future package may intentionally export UI connected to business logic when
that is its stated purpose.

## Working principles

- Read the nearest guidance and relevant source context before changing files.
- Keep changes focused and preserve unrelated worktree changes.
- Treat root and nested README, development, workflow, and usage documents as
  human-facing documentation. Read them for context, but do not modify them
  unless the user explicitly requests documentation changes.
- Prefer generic, reusable UI over application-specific behavior in UI packages.
- Follow the repository and workspace configuration rather than introducing new
  conventions.
- Format changed files before manually running the relevant linters, then report
  what was checked.

## Workflow skills

For CI failures, blocked pull requests, or dependency-update checks, use the
appropriate provider-specific guidance under `.agents/` when the agent supports
skills. Treat the checked-out branch's CI configuration as authoritative.

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
them; a single `SKILL.md` is sufficient otherwise.
