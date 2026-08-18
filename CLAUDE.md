# Claude Code Guidance

[AGENTS.md](AGENTS.md) (and nested workspace `AGENTS.md` files) is the
authoritative, cross-tool source of agent guidance for this repository. Read
it first for repository shape, architecture, and working principles.

## Claude Code specifics

- Route task inquiries by consulting root [AGENTS.md](AGENTS.md) first, then
  the nearest workspace-local `AGENTS.md` for directory-specific rules.
- Claude Code loads repository skills from `.agents/skills/*/SKILL.md` (see
  [AGENTS.md](AGENTS.md)'s "Workflow skills" section) the same way other
  supporting agents do.

## Maintaining this file

Keep this file thin. Guidance that isn't specific to Claude Code — repo
structure, architecture, working principles, skill content — belongs in
`AGENTS.md` or the relevant `.agents/skills/*/SKILL.md`, not here. Update those
files directly instead of duplicating their content into this one.
