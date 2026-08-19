---
name: bootstrap
description: Prepare repository prerequisites and coordinate future project setup workflows. Use when bootstrapping a project before package, application, or API scaffolding.
---

# Bootstrap

## Status

Placeholder for the future project setup workflow. When this skill is defined,
it will coordinate repository prerequisites and setup steps before other
scaffolding skills run.

## Handoff

- When setup requires dotenv encryption keys, use the [keys
  skill](../keys/SKILL.md) first.
- Do not duplicate key rotation or private-key handling here.

Until the workflow is defined, do not infer additional bootstrap actions from
this placeholder.
