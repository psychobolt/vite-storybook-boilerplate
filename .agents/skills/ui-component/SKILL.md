---
name: ui-component
description: Create or extend reusable UI components with the repository's framework, CSS-module, Storybook, accessibility, and testing conventions. Use when adding a component, variant, style module, story, or component-level behavior inside a UI package.
---

# UI Component

Create a reusable component that follows the target UI package's existing
framework and styling contract. Use this skill after package scaffolding, or
when changing a component inside an existing UI package.

## Procedure

1. **Inspect component context.** Read the nearest `AGENTS.md`, package README,
   and two comparable implementation units, including those from the selected
   compatible reference when scaffolding. Follow the selected framework's
   existing component, styling, and Storybook patterns. Read the [component CSF
   guidance](references/csf.md) before story or variant work.
2. **Confirm the component contract and framework.** Read the [UI
   implementation routing](../ui-package/references/routing.md). Confirm that
   the requested unit is a reusable, framework-specific component. If it is
   framework-neutral or application-owned, follow the routing reference before
   continuing. Confirm the framework and component API from the request and
   package context. Stop and ask if a framework-specific implementation is
   requested but the framework is unspecified. When a corresponding
   framework-neutral `ui-element` or `ui-composite` exists, derive the component
   from that base contract's semantics and styles and adapt its public API to
   the selected framework's prop, event, slot, or children conventions. Do not
   duplicate the base implementation. If no matching base
   element or composite exists, implement the component using the selected
   framework package's established conventions. Do not create a new
   framework-neutral base unless the request requires one.
3. **Preserve the styling contract.** Follow the [component styling
   guidance](references/styles.md) when creating the module, composing base
   styles, binding module keys, and using module values in stories or variant
   helpers.
4. **Apply the framework pattern.** Follow the package's framework-specific
   component, template, and class-binding conventions from the selected
   reference and its tooling documentation. When a base element or composite
   exists, add only the framework adapter or API layer required by the
   component. Use the component's actual CSS-module bindings; do not replace
   module keys with literal class strings or pass raw pseudo-state names as
   class names. When pseudo-state styles are transformed into CSS-module keys,
   inspect the effective Storybook output and bind the generated keys.
5. **Define the public API and accessibility.** Keep the public API focused.
   Use typed props, events, slots, or children as appropriate. Preserve native
   element behavior and keep business logic out of reusable components. Keep
   routing, business data access, permissions, application-owned state, and
   workflows in app components or app packages. Add accessible names, states,
   keyboard behavior, and disabled or loading semantics where applicable.
6. **Create stories and variants.** Add or update a story for the default state
   and any applicable meaningful variants, edge states, or interaction behavior. Use the package's
   story format and test hooks; do not leave copied story names, imports, or
   package references. Follow the [component CSF guidance](references/csf.md)
   for pseudo-state, renderer, naming, and shared variant-addon requirements.
7. **Update public exports.** Update the package barrel export only when the
   component is intended to be public. Check that the component's public export
   and all related style-module imports, stories, and tests use the new
   package-local names and paths.
8. **Validate the component.** Format the changed files, then run the package's
   documented lint, tests, library build, and Storybook build checks. Include
   type-check or declaration-generation commands only when the package uses
   them. Inspect the generated Storybook index and render the base/default
   state from its owning story plus at least one generated state when variants
   are involved; Storybook bundling alone does not validate renderer API usage. Scan for unchecked
   dynamic CSS-module indexes, literal replacement class names, stale copied
   paths, missing exports, and unused style imports before reporting completion.
