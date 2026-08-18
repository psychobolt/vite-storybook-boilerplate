# UI Element Styling Guidance

Read the [shared UI styling guidance](../../ui-package/references/styles.md)
first for consumer CSS, CSS-module, Sass/PostCSS, and tooling rules. Apply
these element-specific rules in addition to it.

## Element style contract

- Define the element's classes in its external
  `<ImplementationUnit>.module.scss` and preserve the selected reference's
  class naming and nesting conventions.
- Element Sass may `@use` source `.scss` files for variables, functions, or
  mixins. Preserve the selected reference's `@use` inputs and Sass composition
  rather than replacing them with unrelated imports.
- Keep the compiled element classes within the base package's public style
  output. If the selected package generates a separate CSS entrypoint for each
  element, preserve that established output and its consumer import. Do not
  create an additional standalone entrypoint unless the base package's
  established contract requires one.
- Import the module object into the element template and bind classes from its
  keys. Import the same module object in stories or variant helpers when their
  args, metadata, or render functions need CSS-module class values.
- Keep the element's styling framework-neutral and preserve actual imports,
  bindings, and typed dynamic lookups from the selected reference.
