---
name: ui-composite
description: Create or extend reusable, framework-neutral composite UI contracts built from smaller UI elements. Use when a base UI implementation assembles independently meaningful elements or coordinates their behavior through a public composition API.
---

# UI Composite

Create or extend a framework-neutral HTML/template composite inside a base UI
package. A composite is a larger public contract assembled from multiple
independently meaningful UI elements. It may expose slots or regions, or
coordinate state, events, or accessibility behavior across those elements.
Layout alone, a collection of items, or a fixed internal structure does not
make an implementation a composite.

## Procedure

1. **Inspect composite context.** Read the nearest `AGENTS.md`, package README,
   and two comparable implementation units, including those from the selected
   compatible reference when scaffolding. Follow the reference's existing
   template, styling, Storybook, and accessibility patterns. Read the
   [composite CSF guidance](references/csf.md) before story or variant work.
2. **Confirm the composition contract and rendering model.** Read the [UI
   implementation routing](../ui-package/references/routing.md). Confirm that
   the exposed contract assembles multiple independently meaningful elements or
   coordinates their behavior, state, events, or accessibility. If it instead
   exposes one stable HTML/template contract without coordinating multiple
   meaningful units, or if it is framework-specific or application-owned,
   follow the routing reference before continuing. Confirm the
   HTML/template-rendering model. Stop and ask if the request requires
   framework-specific behavior or the rendering model is unspecified and not
   established by the selected base package.
3. **Compose existing elements.** Build on the public contracts, semantics,
   and styles of existing elements. Expose only the slots, regions, state, and
   events that belong to the composite contract; do not duplicate primitive
   behavior or introduce routing, business data access, permissions,
   application-owned state, workflows, or other application-specific logic.
4. **Preserve the template and styling contract.** Follow the [composite
   styling guidance](references/styles.md). Verify that the base package's
   built style output includes the composite's own styles and required public
   element styles, while private sub-element styles remain internal.
5. **Create stories and variants.** Follow the [composite CSF
   guidance](references/csf.md) for the composite's default composition,
   supported regions or slots, coordinated states, accessibility states, and
   pseudo-state or variant stories.
6. **Update public exports and validate.** Export the composite only when it is
   part of the package API. Format changed files and run the package's
   documented lint, tests, library build, and Storybook checks. Include
   type-check or declaration-generation commands only when the package uses
   them. Render the base/default composition. When an alternate composition,
   coordinated or accessibility state, or private sub-element story exists,
   render at least one meaningful applicable example.
