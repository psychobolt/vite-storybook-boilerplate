---
description: Repository JavaScript and TypeScript source conventions.
applyTo: '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'
---

## Imports

- Organize imports by ownership and runtime role; this is an import
  organization convention, not a replacement for Prettier.
- For ordinary imports, use these groups in order:
  1. **Node runtime.** Group Node built-ins such as `node:fs` and `node:path`,
     when applicable.
  2. **Framework runtime.** Group the target framework packages.
  3. **Framework integrations.** Group official plugins, adapters, and
     integrations for that framework.
  4. **External packages.** Group other external packages.
  5. **Workspace packages.** Group workspace packages and configured absolute
     aliases.
  6. **Relative modules.** Group relative imports, with parent paths before
     same-directory paths when both are present.
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

## Node APIs and asynchronous control flow

- Prefer a Node API's native promise-based variant, such as `node:fs/promises`
  or `node:timers/promises`, when the workflow is asynchronous. Use
  `async`/`await` and preserve the API's error behavior.
- When only a conventional error-first callback API exists, prefer
  `node:util`'s `promisify` over a hand-written Promise wrapper. Keep a manual
  wrapper when the API has non-standard callback results, event or lifecycle
  semantics, required `this` binding, or another behavior that `promisify`
  cannot preserve.
- Do not convert an existing callback API during an unrelated change unless
  the promise-based form is required for correctness or consistency with the
  surrounding workflow.

## Property access and destructuring

- When a locally resolved object supplies several values, destructure the
  needed properties at the narrowest useful scope instead of repeating member
  access. Keep imported API namespaces explicit, such as `path.join`, so the
  source module remains clear.
- Retain member access for one-off or dynamic properties, mutation, fluent APIs,
  required object identity or `this` binding, or when it makes the relationship
  to the owning object clearer. If destructuring a property would collide with
  a local binding, keep it on the source object or in a rest object and access
  it by its original key (for example, `options.handler`) instead of inventing
  a renamed alias. When a local name is available, derive it from that key
  (for example, `const handler = options.handler || defaultHandler`).
- For parsed options or configuration objects, prefer destructuring a field
  when it is used more than once. For example, prefer `const { _ } = args` over
  repeating `args._`.

## Dependency placement

- Follow the root package dependency contract and the target workspace's
  existing organization. Place a library in `devDependencies` when it is used
  only by authoring, build, test, lint, formatting, or other development
  tooling and is absent from built runtime output and emitted declarations.
  Otherwise classify it according to the package's runtime and consumer
  contract. Do not move an existing dependency during an unrelated change.

## Type safety

- Avoid `as` type assertions when the type can be expressed through inference,
  an explicit annotation, `satisfies`, a generic, control-flow narrowing, a
  type guard, or runtime validation. Use `as` only when the assertion is
  verified and necessary because the compiler cannot represent known type
  information or an external API requires it. Do not remove an existing
  assertion during an unrelated change unless the replacement preserves its
  type behavior.
- Prefer a library's public type for typed overrides. For configuration
  overrides, `satisfies Partial<LibraryConfig>` can provide validation and
  autocomplete without an assertion.
- Do not cast generic `unknown` configuration values merely to satisfy the
  compiler. Prefer a public library type, `satisfies`, narrowing, or runtime
  validation when the value is genuinely untrusted.
- Prefer inferred function return types when TypeScript can infer the intended
  useful type. Add an explicit return type when inference is insufficient, a
  recursive function requires it, or it is needed to enforce a deliberate
  public contract; do not annotate a return just to repeat what the
  implementation already determines.
- For exported composed configuration values, use an explicit public type when
  needed to preserve the intended declaration and consumer autocomplete.

## Local expressions, functions, reuse, and scope

- Inline a local variable's initializer when that variable is read only once
  and has no type-specific purpose when writing new code. Keep a named
  variable when its value is reused or when its explicit type annotation,
  assertion, narrowing, or other tool-compatibility purpose is required, or it
  normalizes a predicate for a compound condition.
  Do not retain a single-use variable solely because its name seems more
  readable; add a readability-oriented local only when the user explicitly
  requests that style. Existing variables may be intentional readability aids;
  do not refactor them solely to inline their expressions. For new code, prefer
  `return format(value)` over `const formatted = format(value); return formatted`,
  but retain a single-use variable when its cast is needed for type correctness.
- For function- or module-local variables and type definitions, omit
  qualifiers already clear from the scope when the shorter name remains
  unambiguous. For example, use `Options` instead of `ServerOptions` in a
  server-specific module, or `options` instead of `serverOptions` when it is
  the only option set in scope. Keep qualifiers when names cross module or
  package boundaries, multiple concepts could be confused, or the name is part
  of a public API.
- When a parsed option or configuration value is passed to multiple consumers,
  normalize the shared input once into a named local before constructing
  dependent values. Do not introduce one-use locals solely to name different
  fallback expressions; inline each fallback at its consumer.
  Keep a named value when it is reused, requires a type or narrowing purpose,
  controls evaluation, or is required by tooling.
- Prefer defaults in function parameters or destructuring declarations over
  follow-up fallback assignments or one-use fallback variables when behavior
  is unchanged. Preserve intentional distinctions between omitted,
  `undefined`, and `null` inputs.
- For a known array or string, use a named boolean such as
  `const hasTargets = targets.length > 0` when the emptiness check is reused
  or an inline condition would obscure intent. A direct length check is fine
  for a simple one-off condition.
- Prefer direct control flow over immediately invoked function expressions,
  closure-based initializers, and one-use local wrappers or helpers. In
  executable ESM entrypoints, prefer top-level `await` for startup operations
  when it simplifies the flow and removes an unnecessary async wrapper; do not
  change the module format just to enable it. Call existing Node, library, or
  workspace APIs directly for linear operations. Keep `await` inside a
  function when the asynchronous work belongs to that function, callback, or
  lifecycle. Do not introduce a one-use wrapper or helper merely to forward
  arguments, rename an API operation, or group inline logic. Keep a local
  function when it is reused, recursive, required by a callback or event
  contract, or provides a necessary lifecycle, cleanup, or error boundary.
  When logic is intended for other scripts, move it to an appropriate module
  and export it instead of hiding a reusable API in one entrypoint. Retain a
  closure when it provides necessary encapsulation, deferred execution, or
  deliberate scope isolation, and do not refactor an existing function or
  closure solely to apply this preference.

## Conditions and booleans

- Use direct truthy or falsy conditions for values already typed as booleans or
  optional values, such as `if (enabled)` and `if (!enabled)`, instead of
  redundant comparisons with `true` or `false`.
- Normalize or validate unknown and union-typed input before relying on its
  truthiness. Keep a strict comparison when the input contract requires the
  exact boolean value; do not introduce coercion merely to shorten a condition.
- For compound conditions, normalize non-boolean inputs or distinct checks
  into named boolean predicates before combining them. Express the final
  condition using those predicates and compare them directly for relationships
  such as mutual exclusivity. Keep simple one-off checks inline.

## Configuration defaults and composition

- Before adding a fallback for a configuration value, check the target
  workspace's `.env.defaults`, its established environment-loading path, and
  the library's documented default behavior. Rely on those defaults instead
  of duplicating them in source code. If the value is not configured and the
  library has no default, preserve it as unset; do not invent a hardcoded
  fallback unless the requested contract requires one. When the value is
  required, fail fast rather than continuing with invalid configuration.
  Prefer the library's native validation and error; do not catch or wrap it
  merely to restate the same failure.
- When extending a third-party configuration factory, preserve its defaults.
  Merge nested overrides with the library's documented merge utility or with
  explicit object composition; do not replace nested configuration accidentally.
  Follow the library's semantics for arrays and other special configuration
  values rather than assuming every value supports a generic deep merge.
- Keep configuration-specific helpers and types local unless multiple
  configurations reuse them.
