# Vite Storybook Boilerplate

[<img src="https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/branch/main/graph/badge.svg">](https://codecov.io/gh/psychobolt/vite-storybook-boilerplate/tree/main)

[<img src="https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/ci.yml/badge.svg">](https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/ci.yml) [<img src="https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/apps.yml/badge.svg">](https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/apps.yml) [<img src="https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/packages.yml/badge.svg">](https://github.com/psychobolt/vite-storybook-boilerplate/actions/workflows/packages.yml)

A modern fast ⚡💨 starter plate for developing front-end components

## Features

- Monorepo support ready
  - Speed up tasks and builds with [Turborepo](https://turbo.build/repo) and [remote caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
  - [Common configs](https://github.com/psychobolt/vite-storybook-boilerplate/tree/main/packages/commons) for your project needs: [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Storybook](https://storybook.js.org), [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/) and more...
- Support for [Hybrid PnP and node_modules](https://yarnpkg.com/getting-started/recipes#hybrid-pnp--node_modules-mono-repo) linked projects
- [ES Module enabled](https://nodejs.org/api/esm.html#enabling)
- [Vercel](https://vercel.com/) deployable apps built with [Next.js](https://nextjs.org/) and [Svelte](https://svelte.dev/)
- Internal UI library examples
- Pre-commit formatting hook configured with [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged)
- Load and store environment variables using [dotenv-cli](https://github.com/entropitor/dotenv-cli)+[dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) and [dotenv-vault](https://www.dotenv.org/)

## Development

See [development guide](DEVELOPMENT.md) for details
