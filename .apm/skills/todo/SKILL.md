---
name: todo
description: Track repository skills, setup work, and other tasks that have been requested but not yet established. Use when recording, reviewing, or completing deferred work.
---

# Todo

Maintain the references for deferred repository guidance, setup work, and other
in-progress or not-yet-established tasks. The canonical registers are
`.apm/skills/todo/references/skills.md` and
`.apm/skills/todo/references/work.md`. Deployed skill copies are generated
artifacts; never update their registers directly.

## Procedure

1. **Read the canonical register.** Read the relevant register under
   `.apm/skills/todo/references/` before adding or changing an item. If the
   Todo skill was loaded from a deployed target, resolve the repository's
   `.apm/skills/todo/` source instead of reading or writing the deployed copy.
2. **Record the work.** Add only work that is explicitly requested, discovered
   as a concrete gap, or already represented by a placeholder file. Keep each
   register description concise: record the scope, current state, and
   representative evidence required to consider it stable, but do not copy the
   skill's procedure or references into the register.
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
8. **Verify the register.** Confirm that the canonical register was read and
   updated, the item has a clear scope and establishment criteria, existing
   placeholder files and unrelated work were preserved, stable items have an
   explicit status and reference, and the deployed copies were synchronized.

## Registers

- `.apm/skills/todo/references/skills.md` — placeholder, testing, and stable
  skills.
- `.apm/skills/todo/references/work.md` — other deferred or in-progress work.
