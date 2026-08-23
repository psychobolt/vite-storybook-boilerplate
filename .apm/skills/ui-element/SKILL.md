---
name: ui-element
description: Create or extend reusable, framework-neutral HTML or template-rendered elements using the repository's styling, Storybook, accessibility, and validation conventions. Use when implementing elements inside a base UI package.
---

# UI Element

Create or extend an element inside the base UI package that framework-specific
UI packages can derive from or integrate with. Treat the element's HTML/template
behavior, semantics, and styles as the source contract for framework components.
Use the package README and effective Vite/TypeScript outputs to determine
whether that template implementation is published to consumers or is only used
by Storybook and internal build work; do not infer public JavaScript entrypoints
from a `src` file or folder. An element is the smallest reusable UI design unit
with one stable HTML/template contract. It may render a collection or fixed
internal layout; that alone does not make it a composite. Keep the
implementation focused on reusable HTML capabilities and the repository's
template-rendering layer; do not introduce framework-specific component
behavior or application business logic.

## Procedure

1. **Inspect element context.** Read the nearest `AGENTS.md`, package README,
   and two comparable implementation units, including those from the selected
   compatible reference when scaffolding. Follow the selected reference's
   existing element, styling, and Storybook patterns before creating or
   modifying an element. Read the [element CSF guidance](references/csf.md)
   before story or variant work.
2. **Confirm the element contract and rendering model.** Read the [UI
   implementation routing](../ui-package/references/routing.md). Confirm that
   the contract and ownership match a framework-neutral element. If they do
   not, follow the routing reference before continuing. Confirm the HTML or
   template-rendering model. A template library such as Lit may be used when it
   preserves the base HTML contract; do not treat that as framework-specific
   application integration. Stop and ask if the request requires
   framework-specific behavior or the rendering model is unspecified and not
   established by the selected base package.
3. **Preserve the styling contract.** Follow the [element styling
   guidance](references/styles.md) for the element's module, template, stories,
   Sass inputs, and the base package's public style output.
4. **Use the template-rendering pattern.** Preserve native HTML behavior,
   attributes, events, slots or template inputs, and accessibility semantics.
   Do not introduce JSX, framework components, routing, business data access,
   permissions, application-owned state, workflows, or other application
   business logic.
5. **Create stories and variants.** Follow the [element CSF
   guidance](references/csf.md) for regular and variant stories, including
   pseudo-state naming, shared addon helpers, base-story ownership, and
   generated story contracts. Keep additional behavior variants in regular
   element stories unless a variant file is specifically useful.
6. **Update public exports.** Export the element and its styles only when they
   are part of the package API. Check that names and paths are package-local.
7. **Validate the element.** Format changed files and run the package's
   documented lint, tests, library build, and Storybook checks. Include
   type-check or declaration-generation commands only when the package uses
   them. Inspect generated entries and render the base/default state from its
   owning story plus the generated pseudo-state stories when applicable.
