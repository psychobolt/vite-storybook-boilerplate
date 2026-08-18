# Storybook CSF Guidance

This reference records the rules shared by regular and variant stories across
UI packages. Do not duplicate renderer or implementation-specific APIs here.
Use the listed paths as starting points, verify that they still exist, and
search the repository for the current `commons` documentation and
implementation when a path is stale. Implementation-specific CSF guidance is
available from the skill that owns the work:

- [UI component CSF guidance](../../ui-component/references/csf.md)
- [UI element CSF guidance](../../ui-element/references/csf.md)
- [UI composite CSF guidance](../../ui-composite/references/csf.md)

## Canonical references

- Regular CSF Next usage and shared preview defaults:
  [`packages/commons/README.md`](../../../packages/commons/README.md)
- Variant addon setup and regular/variant examples:
  [`packages/commons/.storybook/addons/README.md`](../../../packages/commons/.storybook/addons/README.md)
- Story generators and pseudo-state helpers:
  [`packages/commons/.storybook/utils/README.md`](../../../packages/commons/.storybook/utils/README.md)

## Official Storybook documentation

Use the [general Storybook guidance](storybook.md) for the official API and
framework setup links. Use the local `commons` documentation for
repository-specific wrappers, defaults, and Variant CSF behavior.

- [CSF Next API](https://storybook.js.org/docs/api/csf/csf-next)
- [Writing stories](https://storybook.js.org/docs/writing-stories)

Check the package's Storybook version and target framework before applying an
upstream example. CSF Next may expose APIs that are wrapped or adapted by this
repository's shared preview configuration.

## Shared rules

- Prefer CSF Next for new regular stories and variant story templates.
- Read the target renderer's current Storybook documentation before using
  renderer-specific story, meta, or extension APIs. Do not copy an API from
  another renderer because the syntax appears similar.
- Keep the repository's shared Storybook addon API unchanged. Do not add a
  custom render function unless the target renderer or component contract
  requires it; use the documented renderer API and shared helpers first.
- Keep published implementation source independent of Storybook-only files.
  Stories and variants may import implementation source, but source should not
  import story or variant metadata, generators, or test helpers. Put shared
  runtime types and constants in source modules. Do not add Storybook-only
  props to a published implementation solely to support story generation
  unless the selected package deliberately defines them as part of its
  implementation contract. A renderer-specific template may intentionally
  accept an adapter-specific pseudo-state contract when it is the package's
  Storybook-facing render target rather than a reusable consumer component.
  Framework-specific components should keep those story args in the
  Storybook adapter and should not extend their public component props with
  them unless that behavior is genuinely part of the public contract.
- Keep ordinary stories and generated variant stories consistent in title,
  component metadata, args, accessibility behavior, and public naming.
- For pseudo-state stories, use shared arg-type and generator helpers when
  available. Preserve their default pseudo-classes and state attributes, and
  extend them only when the implementation adds new state data. Map the
  resulting args through the implementation's public render API, such as
  framework props, HTML attributes, template inputs, or style bindings.
- Use the shared helper's default attribute mapping when the renderer can
  consume it directly. If it cannot, extend the shared
  `getPseudoStateArgTypes` through a package-local wrapper in the package's
  Storybook-only utility layer, such as `.storybook/utils`. Configure the
  wrapper's `argStateAttrMapper` internally to translate the mapped attribute
  object into the renderer's expected input; stories should import the local
  `getPseudoStateArgTypes` wrapper rather than the mapper itself. Do not place
  a Storybook-only adapter in the published source utilities. Keep the shared
  pseudo-state options and addon API unchanged; do not create a wrapper merely
  to duplicate the default mapping.

## Story and variant naming

- Follow the package's established `.stories.ts(x)`, `.story.ts(x)`,
  `.variant.ts`, `.variants.ts`, `.variant.tsx`, or `.variants.tsx` convention.
- If an implementation unit defines or already has a `Secondary` variant and a
  matching `Primary` variant class, use the `Primary` story or variant filename
  for the default variant stories. If no `Primary` variant class exists, use
  `Default`. For utility-generated variants without named classes, choose a
  filename that best represents the coherent variant group.
- When there are no named behavior variants beyond pseudo-states, use
  `<ImplementationUnit>.variants.ts(x)` for the implementation unit's
  pseudo-state stories. Additional behavior variants may be included when
  useful, but should generally remain in the implementation unit's regular
  story file.

## Variant story contract

- A file matched by the variants story glob must export default metadata and a
  `stories` collection or generator accepted by the shared variants addon.
- Converting a regular `.stories.ts(x)` file requires converting its story
  exports to that variant contract; renaming the file alone is insufficient.
- Include the corresponding base story when the variants file owns the complete
  story set. A variants file may omit a duplicate base story when the package's
  established story hierarchy assigns the matching regular story to another
  file. This may be a sibling story or a parent-folder story used as the base
  for a child story group. The implementation may reuse the base through
  explicit composition or established metadata duplication, depending on the
  supported Storybook format. Prefer explicit composition when adding or
  refactoring stories, but preserve an established duplication convention
  unless refactoring is requested. When no comparable hierarchy establishes
  the relationship, do not infer a base from a filename or folder alone. The
  generated Storybook index should expose each base state from its owning
  source along with its requested generated variant states.
- Keep the addon API unchanged. Extend shared pseudo-state data only when the
  component introduces new states.
