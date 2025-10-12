# Copilot Instructions for Vite Storybook Boilerplate

This monorepo is optimized for rapid front-end component development using Vite, Storybook, and modern frameworks. For details on architecture, workflows, and conventions, always reference the following documentation files:

- `README.md` (root, apps, packages)
- `bin/README.md` (workspace scripts)
- `commons/README.md` (shared config usage)
- `WORKFLOWS.md`, `DEVELOPMENT.md` (advanced workflows)

## General Guidance

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
- Place reusable utilities in `commons/esm/bin/utils/` and import as needed.
  For ESM scripts, always use direct imports from `node:fs/promises` for promise-based APIs (e.g., `import { mkdir, unlink } from 'node:fs/promises'`). Avoid using `require` and `util.promisify` in ESM modules unless strictly necessary. For some modules such as `node:child_process`, you must use `util.promisify` to convert callback-based functions (e.g., `exec`, `execFile`) to promise-based usage. See examples in `bin/ls-workspaces.ts` and `bin/web-automation/chromatic.ts`.

If any section is unclear or missing, provide feedback to improve these instructions.
