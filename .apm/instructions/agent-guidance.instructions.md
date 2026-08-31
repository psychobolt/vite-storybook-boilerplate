---
description: Repository-local agent authoring conventions and cross-tool guidance.
applyTo: '**/AGENTS.md,.apm/skills/**/*.md,.apm/instructions/**/*.md'
---

# Agent guidance structure

- Use numbered steps for ordered actions. Begin each step with a short bold
  intent, then keep its instructions together.
- Apply this format to skill procedures and any other numbered or ordered
  action sequence in `AGENTS.md` or references.
- Use bullets for independent rules, constraints, alternatives, or examples.
- Use short paragraphs for definitions and context. Do not place several
  unrelated actions in one paragraph.

## Procedure

1. **Read the full context.** Before modifying agent guidance, read and analyze
   the complete applicable hierarchy: the root and nearest `AGENTS.md`, the
   target skill, bundled references, linked shared references, and matching
   file-scoped instructions. Do not make a guidance change from an isolated
   excerpt.
2. **Inventory rule ownership.** Before adding or relocating a rule, search the
   hierarchy for the behavior it would introduce or clarify. Create a small
   internal inventory of each requested behavior, its matching guidance, its
   canonical owner, its classification, and the planned action. Classify the
   proposed text as new behavior, clarification, exception, routing, or
   validation. If an existing rule owns the behavior, modify or reference that
   owner instead of adding a parallel reminder. Do not edit until this
   inventory is complete.
3. **Edit the appropriate scope.** Keep shared rules in references and have
   the skill procedure point to them; avoid repeating the same rule in both
   places. When a skill has local references, use those references as the
   task-specific entrypoint and follow their links to shared guidance. Keep
   common rules in shared references and unit-specific rules in local
   references. Keep the patch limited to the identified owner unless the
   inventory shows a necessary cross-file change.
4. **Review every change.** After modifying guidance, run targeted searches for
   the changed behaviors and check affected files and cross-links for redundant
   or conflicting information. Inspect every added or changed paragraph or
   diff hunk and state its unique purpose. Remove any text that only restates
   an existing rule, and migrate rules to their proper canonical section or
   reference when needed. Add or update cross-links so each rule has a clear
   owner.
5. **Trace the procedure flow.** Trace each new or changed rule through the
   procedure's earlier gates and later execution steps. Ensure that an option
   or example does not duplicate a later procedure, bypass a stop condition, or
   create a second authorization path. Keep a gate and its execution details
   separate only when each has a distinct purpose; otherwise consolidate them
   under the canonical owner.
6. **Check links and deployment scope.** Use relative Markdown links for
   repository-local agent guidance. Keep links to files bundled with the same
   skill relative and within that bundle. Repository-local skills may
   intentionally link to sibling skills, the root `AGENTS.md`, or repository
   documentation; verify those paths from the authored and configured deployed
   layouts. Treat such cross-bundle links as repository-local, not portable
   standalone-skill links, and do not link to generated deployment directories.
   Follow APM's [package-relative link
   rules](https://microsoft.github.io/apm/producer/package-relative-links/).
7. **Validate the result.** Keep validation in the procedure when the skill has
   an execution workflow; do not add a duplicate checklist. Make additional
   validation conditional on the artifact that exists—for example, require an
   additional variant or composition render only when that variant or
   composition is defined.
