# UI Composite CSF Guidance

Read the [shared CSF guidance](../../ui-package/references/csf.md) first for
CSF Next, the repository's shared preview, variant integration, naming, and
validation rules. Apply these composite-specific rules in addition to it.

## Composite and sub-element stories

- Use the composite's name as the top-level Storybook category for its public
  compositions.
- A composite may contain private sub-elements that follow element-like
  implementation patterns. They are owned by the composite, are not global
  package elements, and should not be exported as standalone UI elements.
- Group stories for private sub-elements under the composite category, using a
  title such as `<Composite>/Elements/<Element>`.
- Keep sub-element stories focused on the composite context in which they are
  used. Use the composite's renderer, template, styling, and public composition
  conventions rather than treating the sub-element as an independently
  reusable element.
- If a sub-element becomes independently reusable or is added to the package's
  public API, promote it to a regular UI element and follow the element CSF
  guidance instead.
