# Vite Storybook Boilerplate

[<img src="https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/branch/main/graph/badge.svg">](https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/tree/main) [<img src="https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/ci.yml/badge.svg">](https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/ci.yml?query=branch%3Amain)

A modern starter plate for developing front-end components

## Features

- Monorepo support ready
  - Utilizes [Yarn PnP strategy](https://yarnpkg.com/features/pnp#what-is-yarn-plugnplay) to correct and hoist workspace dependencies
  - Speed up tasks and builds with [SWC](https://swc.rs/), [Turborepo](https://turbo.build/repo) and [remote caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
  - [Workspace scripts](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/scripts) for handling various workflows such as [release versioning](WORKFLOWS.md) and [hybrid PnP and node_modules](https://yarnpkg.com/getting-started/recipes#hybrid-pnp--node_modules-mono-repo) support
  - [Common configs and plugins](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/packages/commons) for your project needs: [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Storybook](https://storybook.js.org), [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/) and more...
- [ES Module enabled](https://nodejs.org/api/esm.html#enabling)
- Pre-commit formatting hook configured with [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged)
- Load and store environment variables using [dotenv-cli](https://github.com/entropitor/dotenv-cli)+[dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) and [dotenv-vault](https://www.dotenv.org/)

## Development

See [development guide](DEVELOPMENT.md) for details

## Demos

### Packages

Sample packages and Storybook integrations

- [html-ui](packages/html-ui/)
- [react-ui](packages/react-ui/)

### Apps

Sample applications and Vercel integrations

- [svelte-app](apps/svelte-app/)
- [next-app](apps/next-app/)
