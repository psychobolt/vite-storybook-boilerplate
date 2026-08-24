# Skills Todo

This register tracks repository-local skills through three states:

- `Unestablished`: the procedure or boundaries are still being defined.
- `Testing`: the skill is defined but its workflow needs representative runs.
  The tally counts completed end-to-end workflow runs and resets to `0` when
  the skill, one of its bundled references, or a relevant dependency changes.
  Relevant dependencies include scripts, packages, configuration, tools, and
  linked guidance that can affect the skill's workflow.
- `Stable`: the skill is ready for normal development and no longer needs a
  workflow tally.

## Unestablished skills

| Skill           | Current state | Needed to establish it                                                                                                             |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `app-package`   | Placeholder   | Define application-package architecture, runtime and build contracts, environment handling, and validation.                        |
| `api-package`   | Placeholder   | Define API-package boundaries, reusable business-logic conventions, dependency rules, runtime contracts, and validation.           |
| `app-component` | Placeholder   | Define how application components differ from reusable UI components, including state, data access, styling, testing, and exports. |
| `bootstrap`     | Placeholder   | Define the project setup orchestration workflow and its sequencing with `keys` and the scaffolding skills.                         |

## Skills in testing

The tally increments only after an end-to-end representative workflow. Static
validation and partial runs do not count.

| Skill          | Runs | Test with                                                                                                                                                                                      |
| -------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui-package`   | 0    | Scaffold a framework-neutral base UI package and a framework-specific package derived from a compatible base reference.                                                                        |
| `ui-element`   | 0    | Create a framework-neutral HTML/template element and verify its styling, Storybook, exports, and validation contract.                                                                          |
| `ui-composite` | 0    | Create a framework-neutral composite that coordinates multiple elements or composites, including a private sub-element story, without application-specific behavior.                           |
| `ui-component` | 0    | Create a framework-specific component derived from a base element or composite and verify framework styling and Storybook use.                                                                 |
| `todo`         | 0    | Record a skill modification, reset its tally, complete a representative workflow, and move it to the appropriate stable state.                                                                 |
| `ci`           | 0    | Diagnose representative provider workflows, including Bitbucket Pipelines when present, and a dependency-update validation failure.                                                            |
| `keys`         | 0    | Test secure-handoff and fail-closed behavior for missing access, validation, approval, rotation, recovery, and cleanup without exposing environment files or key values.                       |
| `fork`         | 0    | Run a confirmed fork cleanup that removes approved demo workspaces, preserves protected infrastructure, normalizes identity, and validates stale-reference removal without invoking bootstrap. |
| `sync`         | 0    | Run both related-history and unrelated-history synchronization workflows, including conflict review, local `base-main` integration, validation, and guarded `dev/upgrade` publication.         |

## Stable skills

No skills are currently marked stable; move a skill here only when its
representative workflows are ready for normal development.
