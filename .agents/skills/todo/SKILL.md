---
name: todo
description: Track repository skills, setup work, and other tasks that have been requested but not yet established. Use when recording, reviewing, or completing deferred work.
---

# Todo

Maintain the references for deferred repository guidance, setup work, and other
in-progress or not-yet-established tasks. Keep each register concise and do not
duplicate the contents of the referenced skill or documentation.

## Procedure

1. **Read the register.** Read the relevant register under `references/` before
   adding or changing an item.
2. **Record the work.** Add only work that is explicitly requested, discovered
   as a concrete gap, or already represented by a placeholder file. Record the
   scope, current state, and evidence required to consider it stable.
3. **Track incomplete workflows.** Keep placeholder skills and incomplete
   workflows listed until their procedure, boundaries, references, and
   validation expectations are defined.
4. **Reset testing status.** Whenever a skill's `SKILL.md`, bundled reference,
   or declared or repository-local dependency changes in a way that can affect
   its workflow, immediately add or update its testing entry with a tally of
   `0`. Dependencies include scripts, packages, configuration, tools, and
   linked guidance that the skill relies on.
5. **Count representative runs.** After the agent completes an end-to-end
   representative workflow, increment that skill's tally. Formatting, static
   validation, and partial workflow runs do not count.
6. **Mark stable skills.** When a skill is ready for normal development, move it
   to the stable skills section and remove its testing tally. Do not silently
   delete the record.
7. **Keep the scope narrow.** Do not implement deferred work while maintaining
   the register unless the user separately requests implementation.
8. **Verify the register.** Confirm that the appropriate register was read and
   updated, the item has a clear scope and establishment criteria, existing
   placeholder files and unrelated work were preserved, and stable items have
   an explicit status and reference.

## Registers

- [Skills](references/skills.md) — placeholder, testing, and stable skills.
- [Work](references/work.md) — other deferred or in-progress work.
