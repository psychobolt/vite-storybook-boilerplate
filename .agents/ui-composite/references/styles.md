# UI Composite Styling Guidance

Read the [shared UI styling guidance](../../ui-package/references/styles.md)
first for the base package's consumer CSS, Vite-generated style outputs,
CSS-module, Sass/PostCSS, and tooling rules. Apply these composite-specific
rules in addition to it.

## Composite style contract

- Keep public style entrypoints owned by the base package; do not create
  standalone public entrypoints for private sub-elements.
- Include the composite's own classes and styles in the base package's public
  built style output according to the selected Vite and Sass setup.
- Reuse the established style contract of any public elements composed by the
  composite. Include their required public style output or Sass composition
  without copying or redefining their class definitions.
- Keep private sub-element styles within the composite's source and built style
  output. Their template or Storybook imports may support source rendering or
  story setup, but do not establish public consumer CSS.
- Preserve the selected reference's HTML/template, Sass/PostCSS, CSS-module,
  accessibility, and typed dynamic-lookup conventions.
