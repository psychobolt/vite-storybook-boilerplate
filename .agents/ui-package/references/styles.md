# UI Styling Guidance

Use this reference for styling implementation units in UI packages. Read the
selected package's README for general consumer style usage, then inspect its
Vite build configuration and generated build outputs for the actual public
style entrypoints. Also inspect its Sass/PostCSS configuration, CSS-module
configuration, module declarations, and consumer style imports before applying
these rules. The README may not enumerate every generated entrypoint. Preserve
the selected reference when its setup differs.

Implementation-specific rules are available in the [UI element styling
guidance](../../ui-element/references/styles.md), [UI composite styling
guidance](../../ui-composite/references/styles.md), and [UI component styling
guidance](../../ui-component/references/styles.md).

## CSS and Sass contract

- Establish the selected package's styling contract before choosing between
  shared CSS utilities and implementation-local styles. Follow its CSS-module,
  Sass, global-scope, and framework conventions.
- When no base element, composite, or other existing contract provides the
  needed style, inspect the package's shared style entrypoints and CSS utility
  classes first. Reuse an existing utility when it expresses the required
  behavior.
- Create a shared CSS utility only when the behavior is broadly reusable and
  belongs in the package's shared styling API. Otherwise define the behavior in
  the implementation unit's local CSS module.
- Treat the package README as the authority for general consumer style usage,
  but do not assume it lists every generated entrypoint. Inspect the package's
  Vite build configuration to determine how public style outputs are discovered
  or generated, and verify that the built CSS contains the implementation
  styles expected by that usage. Do not assume that importing a CSS module
  anywhere in implementation or Storybook source is sufficient for consumer
  styles. Those imports may support internal rendering, class lookup, preview,
  or story generation, but only the documented consumer usage together with
  the Vite-generated public style output establishes the consumer CSS contract.
- Preserve established per-implementation CSS outputs when the package's Vite
  configuration generates them. A package may expose both a shared stylesheet
  and separate element or component styles; do not collapse those outputs into
  one entrypoint unless the package contract is intentionally changing.
- Prefer the repository's established CSS Modules with Sass composition when
  supported and compatible with the target framework. Keep package-level style
  entrypoints as distinct consumer-facing build outputs, while allowing them
  to be generated from or composed with source CSS modules used by components
  during development. Keep Storybook-only style imports separate from that
  public output.
- Import the resulting module object in components, elements, stories, and
  variant helpers wherever CSS-module values are consumed. Do not replace
  those values with literal class strings. A narrowed module-key lookup such as
  `styles[variant]` is valid when `variant` is typed or otherwise constrained to
  the module's available keys.
- Use typed lookup maps or equivalent narrowing for dynamic module keys. Do not
  use unchecked arbitrary-string indexes or treat generated declaration files
  as authored source.
- Preserve the package's Vite, TypeScript, stylelint, Sass, and PostCSS setup.
  Treat `typescript-plugin-css-modules` and other language-service plugins as
  compatibility-sensitive when a framework supplies its own tooling. Generated
  CSS-module declarations are development or lint artifacts; exclude them from
  source commits and published package artifacts. Distinguish those generated
  declarations from authored ambient `.d.ts` files that extend repository or
  framework types; retain an authored declaration when the selected reference
  requires it.
