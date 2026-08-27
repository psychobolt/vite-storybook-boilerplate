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

| Skill          | Runs | Test with                                                                                                                                                |
| -------------- | ---: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui-package`   |    0 | Scaffold base and framework-specific UI packages from compatible references.                                                                             |
| `ui-element`   |    0 | Create a framework-neutral element and verify its styling, Storybook, exports, and validation.                                                           |
| `ui-composite` |    0 | Create a composite from elements or composites, including private sub-elements, and verify its contract.                                                 |
| `ui-component` |    0 | Create a framework-specific component from a base unit and verify its styling and Storybook integration.                                                 |
| `todo`         |    0 | Record a skill change, complete a representative workflow, and update its stability state.                                                               |
| `ci`           |    0 | Diagnose representative CI-provider and dependency-update failures.                                                                                      |
| `keys`         |    0 | Test secure handoff, fail-closed access, approval, rotation, and recovery without exposing secrets.                                                      |
| `fork`         |    0 | Run identity migration and approved cleanup, including Git and hosted-access preflight when applicable, remotes, optional history reset, and validation. |
| `sync`         |    0 | Synchronize related and unrelated histories with local `base-main` integration and validation.                                                           |

## Stable skills

No skills are currently marked stable; move a skill here only when its
representative workflows are ready for normal development.
