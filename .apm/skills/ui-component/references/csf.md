# UI Component CSF Guidance

Read the [shared CSF guidance](../../ui-package/references/csf.md) first for
CSF Next, repository `commons`, shared preview, variant-addon, naming, and
validation rules. Apply these component-specific rules in addition to it.

## Component stories and variants

- Use the target framework's current Storybook renderer and component-meta API;
  do not copy a renderer-specific API from another package.
- Apply the shared pseudo-state mapping through the component's framework props,
  attributes, or CSS-module bindings.
- Preserve the component's actual CSS-module imports and typed class lookups in
  stories and render helpers. Do not replace module keys with raw pseudo-state
  names or literal class strings.
- Use the component's name for `<ImplementationUnit>` in the shared naming
  rules. Keep additional behavior variants in the component's regular story
  file unless a separate variant group is useful.
