# UI Element CSF Guidance

Read the [shared CSF guidance](../../ui-package/references/csf.md) first for
CSF Next, repository `commons`, shared preview, variant-addon, naming, and
validation rules. Apply these element-specific rules in addition to it.

## Element stories and variants

- Use the template-rendering layer's current Storybook renderer and metadata
  API. Preserve native HTML attributes, events, slots or template inputs, and
  accessibility behavior in stories.
- Apply the shared pseudo-state mapping through the element's HTML attributes,
  template inputs, and established style bindings.
- Use the element's name for `<ImplementationUnit>` in the shared naming rules.
  When there are no named behavior variants beyond pseudo-states, the result is
  typically `<Element>.variants.ts(x)`; keep additional behavior variants in
  `<Element>.stories.ts(x)` unless a separate variant group is useful.
