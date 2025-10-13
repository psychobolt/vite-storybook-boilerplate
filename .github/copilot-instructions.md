# Copilot Instructions

This monorepo is optimized for rapid front-end component development using Vite, Storybook, and modern frameworks. For details on architecture, workflows, and conventions, always reference the following documentation files:

- `README.md` (root, apps, packages)
- `bin/README.md` (workspace scripts)
- `commons/README.md` (shared config usage)
- `WORKFLOWS.md`, `DEVELOPMENT.md` (advanced workflows)

## General Guidance

- This project is ESM-first. The root `package.json` is configured with `"type": "module"`, so all scripts and packages should use ESM import/export syntax. Top-level async/await is allowed in all scripts, and you do not need to wrap async code in an IIFE or main function unless desired for clarity.
- Extend shared configs from `commons` for Vite, Vitest, ESLint, and Prettier. See examples in `commons/README.md`.
- UI libraries (`html-ui`, `react-ui`) are designed for cross-app usage; follow usage patterns in their respective READMEs.
- For hybrid PnP/node_modules setups, consult `WORKFLOWS.md` and `bin/bootstrap.ts`.
- Environment variables are managed via `dotenvx`.
- Dependency upgrades are automated by Renovate Bot (see `DEVELOPMENT.md`).
- Storybook is configured per UI package; use package-level scripts for isolated component development.
- Demo apps (`next-app`, `svelte-app`) import UI packages for integration and testing.
- CI/CD is set up with Codecov and GitHub Actions for coverage and workflow automation.

## Script File Guidance (bin/)

- Always use the `node:` prefix for native Node.js imports (e.g., `import fs from 'node:fs'`).
- Hoist all native Node.js imports to the top of the file, before third-party or local imports.
- Use the `arg` package for argument parsing (see `bin/hash.ts`, `bin/apply-versions.ts`, `bin/ls-workspaces.ts`).
- Prefer explicit CLI flags for user input; avoid environment files unless strictly necessary.
- Remove unused imports and keep dependencies minimal for fast execution.
- Print errors to `stderr` and exit with non-zero status on failure.
- Output should be JSON or human-readable text, depending on the script's purpose.
- Reference `bin/README.md` for usage patterns and flag conventions.
- For ESM scripts, always use direct imports from Node.js built-in modules with the node: prefix and no file extension (e.g., import { mkdir, unlink } from 'node:fs/promises').
- For some modules such as node:child_process, you must use util.promisify to convert callback-based functions (e.g., exec, execFile) to promise-based usage. See examples in ls-workspaces.ts and bin/web-automation/chromatic.ts.
- When importing local TypeScript modules or scripts, always use the explicit .ts extension (e.g., import { foo } from './utils.ts'). This ensures compatibility with Node.js ESM and TypeScript module resolution settings.

## Workspace Package Imports

When importing from workspace packages (such as `commons`, `html-ui`, `react-ui`), always use the package name (e.g., `import { EXIT_USAGE_ERROR } from 'commons/esm/bin/utils/functions.js'`).
Do not use relative paths to reference workspace packages from scripts or apps; use the package name as defined in `package.json` dependencies.
For any use of these packages in scripts, always reference the `esm/` or `cjs/` folders for JavaScript or TypeScript imports (e.g., `import { EXIT_USAGE_ERROR } from 'commons/esm/bin/utils/functions.js'`).
This ensures compatibility with monorepo tooling, TypeScript, and Node.js ESM resolution.

## TypeScript Typing Guidance

- Prefer using `interface` over `type` for object shapes and data structures when possible. This improves code clarity, supports declaration merging, and is the recommended convention for most TypeScript projects in this monorepo.
