---
description: Repository-local agent authoring conventions and cross-tool guidance.
applyTo: '**/AGENTS.md,.apm/skills/**/*.md,.apm/instructions/**/*.md'
---

# Agent guidance structure

- Use numbered steps for ordered actions, beginning each step with a short
  bold intent. Apply this format to skill procedures and other ordered
  sequences in `AGENTS.md` or references.
- Use bullets for independent rules, constraints, alternatives, or examples.
  Do not use a bold bullet as a substitute for a numbered step when the action
  has an order or prerequisite.
- Keep formatting consistent within each ordered sequence: use the same list
  structure, intent style, indentation, and sentence pattern for equivalent
  steps. Do not mix ordered prerequisites into an unordered list.
- Use short paragraphs for definitions and context. Do not place several
  unrelated actions in one paragraph.

## Procedure

1. **Summarize the targets.** Before changing any file, summarize its purpose,
   relevant current behavior, and intended change. For each target guidance
   file, also summarize every substantive section and each procedure step that
   contains more than a few sentences. Keep summaries concise and separate
   unless the targets have the same role and change.
2. **Read the full context.** Before modifying agent guidance, read and analyze
   the complete applicable hierarchy: the root and nearest `AGENTS.md`, the
   target skill, bundled references, linked shared references, and matching
   file-scoped instructions. Do not make a guidance change from an isolated
   excerpt.
3. **Inventory ownership and scope.** Search the hierarchy for each requested
   behavior, identify its canonical owner, and classify the change as new,
   clarification, exception, routing, or validation. If a rule already has an
   owner, modify or reference it instead of adding a duplicate. Do not edit
   until this inventory is complete.
4. **Edit the appropriate scope.** Keep shared rules in shared references and
   unit-specific rules in local references; have skill procedures point to
   them. Follow local reference links to shared guidance and limit the patch to
   the identified owner unless a cross-file change is necessary.
5. **Review every change.** Search changed behaviors and cross-links for
   redundancy or conflict. Inspect each changed diff hunk, remove restatements,
   migrate rules to their canonical owner, and update links so ownership is
   clear. Keep each remaining paragraph's purpose distinct.
6. **Trace the procedure flow.** Check changed rules against earlier gates and
   later execution. Remove options or examples that duplicate steps, bypass
   stop conditions, or create another authorization path; consolidate a gate
   with execution details unless they serve distinct purposes.
7. **Repeat refinement.** Before each removal or consolidation, verify that
   the remaining guidance is complete, unambiguous, and retains necessary
   context. Re-run steps 3–6 after each edit and continue until no further safe
   condensation is possible. Every remaining rule must have a clear owner and
   distinct purpose.
8. **Check links and deployment.** Use relative links for repository-local
   guidance and same-skill references; verify cross-bundle links against both
   authored and configured deployed layouts. Do not link to generated targets.
   Follow APM's [package-relative link
   rules](https://microsoft.github.io/apm/producer/package-relative-links/).
9. **Validate the result.** Keep validation in an execution procedure rather
   than adding a duplicate checklist. Make extra checks conditional on the
   artifact that exists, such as a variant or composition.
