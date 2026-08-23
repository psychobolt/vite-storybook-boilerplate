---
description: Repository-local agent authoring conventions and cross-tool guidance.
applyTo: '**/AGENTS.md,.apm/skills/**/*.md'
---

# Agent guidance structure

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
- Use relative Markdown links for repository-local agent guidance. Keep links
  to files bundled with the same skill relative and within that bundle.
  Repository-local skills may intentionally link to sibling skills, the root
  `AGENTS.md`, or repository documentation; verify those paths from the
  authored and configured deployed layouts. Treat such cross-bundle links as
  repository-local, not portable standalone-skill links, and do not link to
  generated deployment directories. Follow APM's [package-relative link
  rules](https://microsoft.github.io/apm/producer/package-relative-links/).
- Keep validation in the procedure when the skill has an execution workflow;
  do not add a duplicate checklist. Make additional validation conditional on
  the artifact that exists—for example, require an additional variant or
  composition render only when that variant or composition is defined.
