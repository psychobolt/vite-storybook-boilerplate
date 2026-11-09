# Skills Todo

## Skill states

This register tracks repository-local skills through three states:

- `Unestablished`: the procedure or boundaries are still being defined.
- `Testing`: the skill is defined but its workflow needs representative runs. The tally counts completed end-to-end workflow runs and resets to `0` when the skill, one of its bundled references, or a relevant dependency changes. Relevant dependencies include scripts, packages, configuration, tools, and linked guidance that can affect the skill's workflow.
- `Stable`: the skill is ready for normal development and no longer needs a workflow tally.

## Unestablished skills

<table>
  <thead>
    <tr>
      <th scope="col">Skill</th>
      <th scope="col">Current state</th>
      <th scope="col">Needed to establish it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>app-package</code></td>
      <td>Placeholder</td>
      <td>Define application-package architecture, runtime and build contracts, environment handling, and validation.</td>
    </tr>
    <tr>
      <td><code>api-package</code></td>
      <td>Placeholder</td>
      <td>Define API-package boundaries, reusable business-logic conventions, dependency rules, runtime contracts, and validation.</td>
    </tr>
    <tr>
      <td><code>app-component</code></td>
      <td>Placeholder</td>
      <td>Define how application components differ from reusable UI components, including state, data access, styling, testing, and exports.</td>
    </tr>
    <tr>
      <td><code>bootstrap</code></td>
      <td>Placeholder</td>
      <td>Define the project setup orchestration workflow and its sequencing with <code>keys</code> and the scaffolding skills.</td>
    </tr>
  </tbody>
</table>

## Skills in testing

The tally increments only after an end-to-end representative workflow. Static validation and partial runs do not count.

<table>
  <thead>
    <tr>
      <th scope="col">Skill</th>
      <th scope="col">Runs</th>
      <th scope="col">Test with</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ui-package</code></td>
      <td>0</td>
      <td>Scaffold base and framework-specific UI packages from compatible references.</td>
    </tr>
    <tr>
      <td><code>ui-element</code></td>
      <td>0</td>
      <td>Create a framework-neutral element and verify its styling, Storybook, exports, and validation.</td>
    </tr>
    <tr>
      <td><code>ui-composite</code></td>
      <td>0</td>
      <td>Create a composite from elements or composites, including private sub-elements, and verify its contract.</td>
    </tr>
    <tr>
      <td><code>ui-component</code></td>
      <td>0</td>
      <td>Create a framework-specific component from a base unit and verify its styling and Storybook integration.</td>
    </tr>
    <tr>
      <td><code>todo</code></td>
      <td>0</td>
      <td>Record a skill change, complete a representative workflow, and update its stability state.</td>
    </tr>
    <tr>
      <td><code>ci</code></td>
      <td>0</td>
      <td>Diagnose representative CI-provider and dependency-update failures.</td>
    </tr>
    <tr>
      <td><code>keys</code></td>
      <td>0</td>
      <td>Test secure handoff, fail-closed access, approval, full reset, data-retaining migration, and recovery without exposing secrets.</td>
    </tr>
    <tr>
      <td><code>fork</code></td>
      <td>0</td>
      <td>Run identity migration and approved cleanup, including Git preflight, local remotes, optional history reset, and validation.</td>
    </tr>
    <tr>
      <td><code>sync</code></td>
      <td>0</td>
      <td>Test guidance discovery, both history modes, scoped regeneration, and graph consolidation with justified retained duplicates.</td>
    </tr>
  </tbody>
</table>

## Stable skills

No skills are currently marked stable; move a skill here only when its representative workflows are ready for normal development.
