# Copilot Instructions

This monorepo is optimized for rapid front-end component development using Vite, Storybook, and modern frameworks. For details on architecture, workflows, and conventions, always reference the following documentation files:

- `README.md` (root, apps, packages)
- `bin/README.md` (workspace scripts)
- `commons/README.md` (shared config usage)
- `WORKFLOWS.md`, `DEVELOPMENT.md` (advanced workflows)

## General Guidance

- This project is ESM-first. The root `package.json` is configured with `"type": "module"`, so all scripts and packages should use ESM import/export syntax. Top-level async/await is allowed in all scripts, and you do not need to wrap async code in an IIFE or main function unless desired for clarity.
- This project uses an exact version policy in all `package.json` files: dependencies must always specify an exact version (no version ranges).
- Extend shared configs from `commons` for Vite, Vitest, ESLint, and Prettier. See examples in `commons/README.md`.
- UI libraries (`html-ui`, `react-ui`) are designed for cross-app usage; follow usage patterns in their respective READMEs.
- For hybrid PnP/node_modules setups, consult `WORKFLOWS.md` and `bin/bootstrap.ts`.
- Environment variables are managed via `dotenvx`.
- Dependency upgrades are automated by Renovate Bot (see `DEVELOPMENT.md`).
- Storybook is configured per UI package; use package-level scripts for isolated component development.
- Demo apps (`next-app`, `svelte-app`) import UI packages for integration and testing.
- CI/CD is set up with Codecov and GitHub Actions for coverage and workflow automation.

## Import Organization & Workspace Imports

- **All import statements must appear at the very top of the file, with no comments or blank lines before them.**
- Always use destructured imports for Node.js and third-party modules whenever possible (e.g., `import { readFile } from 'node:fs/promises'`).
- Always place all package imports (including native Node.js imports with the `node:` prefix, npm packages, and workspace packages) together at the very top of the file, with no blank lines between them. After all package imports, add a single blank line, then list all local (relative) file imports.

**Import order example:**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { $ } from 'commons/esm/bin/utils/functions.js';
import React from 'react';
import { Button } from 'html-ui';

import styles from './Button.module.css';
import { getColor } from './utils';
```

This ensures all package imports (node: built-ins, npm, and workspace packages) are grouped together at the top, with no blank lines between them, and a single blank line before any relative/local imports.

```ts
import React from 'react';
import { Button } from 'html-ui';

import styles from './Button.module.css';
import { getColor } from './utils';
```

## TypeScript Typing Guidance

- Never use the `any` type. Always use explicit types, interfaces, or `unknown` with proper type guards. This ensures type safety and maintainability across the codebase.
- Prefer using `interface` over `type` for object shapes and data structures when possible. This improves code clarity, supports declaration merging, and is the recommended convention for most TypeScript projects in this monorepo.
- Use optional chaining (`obj?.prop`) for property access safety and concise code. Avoid `typeof` checks for type discrimination when possible; prefer direct truthiness checks, method calls, or type guards for idiomatic TypeScript.
- Use `Object.hasOwn(obj, key)` instead of `Object.prototype.hasOwnProperty.call(obj, key)` for property checks (Node.js 16+).
- Prefer other modern TypeScript conventions for safety, clarity, and maintainability.
- Prefer type inference for local variables and function returns unless an explicit type is required for safety (e.g., reduce accumulators, empty arrays).

## Function Style Guidance

- For any function that consists of a single immediate return statement, prefer using a shorthand arrow function for conciseness and readability. Example:

  ```ts
  // Instead of:
  function isValid(x: number) {
    return x > 0;
  }

  // Use:
  const isValid = (x: number) => x > 0;
  ```

## Script File Guidance (bin/)

- Always define functions before they are used. Do not rely on variable or function hoisting. Place function definitions as close as possible to where they are used for clarity and maintainability.
- Always create scripts in TypeScript (`.ts`) for consistency and maintainability.
- Use `yarn run-script` to execute TypeScript scripts in the `bin/` directory, rather than calling `node` directly.
- Always use the `node:` prefix for native Node.js imports (e.g., `import fs from 'node:fs'`).
- Hoist all native Node.js imports to the top of the file, before third-party or local imports.
- Always use async file operations from `fs.promises` (e.g., `readFile`, `writeFile`, `unlink`) instead of sync methods (`readFileSync`, `writeFileSync`, `unlinkSync`) for all scripts. This ensures non-blocking, modern, and robust workflows.
- Use the `arg` package for argument parsing (see `bin/hash.ts`, `bin/apply-versions.ts`, `bin/ls-workspaces.ts`).
- Prefer explicit CLI flags for user input; avoid environment files unless strictly necessary.
- Remove unused imports and keep dependencies minimal for fast execution.
- Print errors to `stderr` and exit with non-zero status on failure.
- Output should be JSON or human-readable text, depending on the script's purpose.
- Reference `bin/README.md` for usage patterns and flag conventions.
- For ESM scripts, always use direct imports from Node.js built-in modules with the node: prefix and no file extension (e.g., import { mkdir, unlink } from 'node:fs/promises').
- For some modules such as node:child_process, you must use util.promisify to convert callback-based functions (e.g., exec, execFile) to promise-based usage. See examples in ls-workspaces.ts and bin/web-automation/chromatic.ts.
- When importing local TypeScript modules or scripts, always use the explicit .ts extension (e.g., import { foo } from './utils.ts'). This ensures compatibility with Node.js ESM and TypeScript module resolution settings.
