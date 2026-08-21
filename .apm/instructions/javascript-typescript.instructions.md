---
description: Repository JavaScript and TypeScript source conventions.
applyTo: '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'
---

## Import organization

- Organize imports by ownership and runtime role; this is an import
  organization convention, not a replacement for Prettier.
- For ordinary imports, use these groups in order:
  1. Node built-ins such as `node:fs` and `node:path`, when applicable.
  2. The target framework packages.
  3. Official plugins, adapters, and integrations for that framework.
  4. Other external packages.
  5. Workspace packages and configured absolute aliases.
  6. Relative imports, with parent paths before same-directory paths when both
     are present.
- Keep a framework and its official integrations together. Do not sort a
  framework plugin as an unrelated external package merely because its name
  is alphabetically later.
- Keep type-only imports in the group belonging to their module.
- Use stable alphabetical ordering within a group when it does not obscure a
  framework relationship or a runtime dependency.
- Resolve absolute imports from the nearest applicable `tsconfig`/`jsconfig`,
  including inherited `baseUrl` and `paths`. Treat those paths as the source
  of truth for local aliases.
- Use package `exports` for package-owned imports, and consult Vite or the
  framework configuration only when runtime compatibility needs confirmation.
  Do not infer ownership from an alias's spelling alone.
- Preserve the order of side-effect imports required by runtime setup,
  polyfills, CSS, Sass, Storybook, or a framework integration.
- Keep stylesheet imports with the source group they belong to unless the
  package configuration requires a different order. A CSS-module import and a
  side-effect stylesheet import do not have the same ordering contract.
- Do not apply generic import sorting to generated files or copy a sorting
  convention across framework-specific configuration without checking the
  target framework and package setup.

## Expressions

- Inline a local variable's initializer when that variable is read only once
  and has no type-specific purpose when writing new code. Keep a named
  variable when its value is reused or when its explicit type annotation,
  assertion, narrowing, or other tool-compatibility purpose is required.
  Existing variables may be intentional readability aids; do not refactor
  them solely to inline their expressions. For new code, prefer
  `return format(value)` over `const formatted = format(value); return formatted`,
  but retain a single-use variable when its cast is needed for type correctness.

## Typing

- Avoid `as` type assertions when the type can be expressed through inference,
  an explicit annotation, `satisfies`, a generic, control-flow narrowing, a
  type guard, or runtime validation. Use `as` only when the assertion is
  verified and necessary because the compiler cannot represent known type
  information or an external API requires it. Do not remove an existing
  assertion during an unrelated change unless the replacement preserves its
  type behavior.
