# UI Component Styling Guidance

Read the [shared UI styling guidance](../../ui-package/references/styles.md)
first for consumer CSS, CSS-module, Sass/PostCSS, and tooling rules. Apply
these component-specific rules in addition to it.

## Component style contract

- Create or update the external `<ImplementationUnit>.module.scss` using the
  selected framework package's naming, nesting, and CSS-module conventions.
- When deriving from a framework-neutral base element or composite, preserve
  the base package's public CSS contract. If the selected framework reference
  composes the base package's built `.css` through the component's Sass module,
  retain that import, its required Sass dependencies, and its `@use` and
  global-scope composition pattern. Otherwise follow the actual Vite and Sass
  setup rather than assuming a fixed CSS filename or import path. Keep base
  classes available to consumers alongside component-local classes.
- Retain `@use` statements required by the repository's CSS-module tooling,
  even when the same style is also loaded into the module's global scope.
- Import the module object in the component and bind both composed base classes
  and local classes from its keys. Import it in stories or variant helpers when
  their args, metadata, or render functions need CSS-module class values.
- Keep framework-specific style bindings in the integration layer and preserve
  the selected framework's component, template, Sass, and CSS-module
  conventions.
