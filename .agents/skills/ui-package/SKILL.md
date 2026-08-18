---
name: ui-package
description: Create a reusable UI package by following an existing repository pattern. Use when adding a UI package, replacing starter content, or restructuring a package that must retain the monorepo's build, Storybook, styling, and validation integration.
---

# UI Package

Create the smallest reusable UI package that fits the repository's existing
architecture. Keep application business logic out of the package.

## Procedure

1. **Apply shared package procedure.** Follow the root [shared package
   procedure](../../AGENTS.md#shared-package-procedure) before the
   UI-package-specific steps below.
2. **Confirm UI package intent.** Confirm the intended package name, framework
   or rendering model, public entrypoint, and target location under `packages/`
   from the request. For a base UI or `-elements` package, use
   framework-neutral HTML/template rendering
   when that matches the root architecture. For a framework-specific package,
   stop and ask if the framework or rendering model is unspecified.
3. **Discover and select compatible UI references.** Search the repository and,
   when requested, `BASE_REF` for the closest existing UI package that matches
   the requested framework or rendering model. For a framework-specific UI
   package, also locate the corresponding framework-neutral base element or
   composite when one exists. Determine whether the base package publishes its
   template or JavaScript implementation or uses it only for Storybook and
   internal build work. Use the base contract's semantics and styles,
   and adapt its public API to the target framework's conventions; do not
   assume the framework package must expose the same prop, event, slot, or
   children shape or import an internal template as a runtime dependency. Use
   the framework-specific package as a reference for framework integration and
   Storybook configuration. If no exact match exists, select the closest
   compatible reference and identify what must be augmented from the base
   contract and the requested framework's documented conventions. If no
   compatible reference exists, compose the
   package from those sources rather than treating the absence as a blocker.
   Before creating files, read each selected reference's `AGENTS.md`, README,
   and relevant repository documentation, then compare source entrypoints,
   styles, stories or documentation, build configuration, and both Storybook
   `main` and `preview` configuration, including preview support files such as
   `meta.ts`, renderer adapters, and local Storybook utilities. Inspect package
   and Storybook test configuration when present. Check shared Storybook helpers
   for renderer-specific defaults and addon registration. Trace the effective Vite,
   PostCSS, Storybook preview, addon, and indexer configuration after shared
   configs are composed before adding package-local equivalents. Determine
   whether the shared configuration already supplies the variant story glob,
   indexer, or Vite plugin; preserve inherited registrations and add or
   override them only as the current `commons` documentation requires. Read the
   [Storybook setup guidance](references/storybook.md) for official API and
   framework setup links, and the [CSF guidance](references/csf.md) for story
   and variant conventions. Read the [styling guidance](references/styles.md)
   while inspecting the selected reference. Augment the selected reference only
   after this inspection.
4. **Set up framework tools.** Discover and set up framework coding tools before
   implementing source. Inspect the framework's official guidance for compiler
   or Vite plugins, template or SFC language services, and CSS-module support.
   Prefer tooling already used by
   the repository; if none exists, propose the smallest appropriate toolset
   before adding it. Keep editor extensions out of `package.json`. Keep project
   extension recommendations in `.vscode/extensions.json`, preserving existing
   entries, and verify that required tooling is actually available in the user's
   editor. Follow the repository's validation contract for type-checking rather
   than introducing commands solely for editor support.
5. **Create the UI workspace.** Create the workspace using the selected UI
   reference's structure. Preserve source entrypoints, styles, stories or
   documentation, build configuration,
   and Storybook integration. Add `commons` only when the package imports
   shared configuration, helpers, Storybook utilities, or build tooling; it is
   normally a development dependency unless it is part of the published runtime
   contract.
   Review the `commons` README and current shared Storybook implementation to
   determine the supported preview-extension API. Extend the common Storybook
   preview using that documented API and preserve framework renderer defaults,
   docs configuration, and required addon registrations. UI packages must
   preserve Chromatic integration; when setup is unavailable, use an empty
   `CHROMATIC_PROJECT_TOKEN=` placeholder and never invent project identifiers.
6. **Delegate implementation-unit work.** Read the [UI implementation
   routing](references/routing.md), select the matching procedure, and invoke
   it after choosing the compatible reference. Pass that reference as context to
   the selected skill. When the reference comes from `BASE_REF`, use each
   selected package's `AGENTS.md`,
   README, and comparable implementation units from that Git tree, including
   their source, styles, stories, tests, and exports; do not expect the new
   package to contain those units yet. Augment the selected references after
   inspecting their guidance and the requested framework's documented
   conventions. For packages that use variant stories, follow the `commons`
   documentation and implementation when composing the shared Storybook Vite
   plugin and indexer. Preserve inherited registrations rather than adding
   duplicates. Validate at least one variant story through the package's
   Storybook build.
7. **Preserve the CSS contract.** Follow the [styling
   guidance](references/styles.md) for consumer-facing CSS, Sass composition,
   CSS-module imports, generated declarations, and framework tooling. Verify
   the Vite-generated public style outputs and the consumer import usage
   described by the package README.
8. **Separate build, test, and Storybook configuration.** Keep package-level
   library build, test, and Storybook configuration separate when the reference
   package does so, including Storybook test-runner configuration when present.
   Trace each effective configuration and add plugins only to
   the layer that requires them. Keep framework-specific behavior in the
   integration layer rather than coupling it to the base UI package. Do not let
   test-only or Storybook-only behavior leak into the consumer library build.
   Use Storybook documentation, CSF, and example files as API and
   implementation references, including their props, args, descriptions, and
   source patterns. Determine public package exposure from `src/` entrypoints
   and the effective Vite build configuration; do not add Storybook files to
   public exports unless the package explicitly intends that.
   Run the package's documented validation commands, including type-check or
   declaration-generation commands only when the package uses them. Inspect the
   generated Storybook index and render the base/default state from its owning
   story plus one generated state when variants are involved; treat renderer
   warnings and runtime story failures as validation findings.
