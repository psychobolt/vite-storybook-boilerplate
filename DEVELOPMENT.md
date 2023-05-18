# Development

## Getting Started

### Local environment setup

1. Install the latest LTS node (https://nodejs.org/en/) standalone or with nvm
2. Setup Yarn (https://yarnpkg.com/getting-started/install)
3. Download and install [Visual Studio Code](https://code.visualstudio.com/)
4. Open your project in VSCode and install the recommended extensions
5. Restart VSCode and reopen the project.
6. Run command `yarn install` in terminal to unpack root binaries
7. Run command `yarn bootstrap` in terminal to verify all dependencies
8. Follow Yarn's [Editor SDKs guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) to set VSCode's TypeScript version to workspace's

#### Troubleshooting ESLint extension

1. Ensure you are running VSCode with the node version you have yarn installed on.
2. If above step doesn't work after restart, copy `.pnp.loader.mjs` to a safe location. e.g. Linux `cp ./.pnp.loader.mjs /absolute/path/to/.pnp.loader.mjs`. Then update **user settings**:

```sh
    "eslint.runtime": "node"
    "eslint.execArgv": ["--loader", "/absolute/path/to/.pnp.loader.mjs"]
```

### Setup Remote Cache (Optional)

#### Local Development

1. Create and login to a Vercel account: https://vercel.com/
2. Login to the default remote cache provider: `yarn turbo login`
3. Follow any prompt instructions
4. Run `yarn turbo link`

### Commands

```sh
yarn bin-script # Execute a binary script
yarn task-name # Run a task
yarn run bin-or-task-name [-B]
```

See [information](https://yarnpkg.com/cli) on commands for Yarn.

> Each project level has their own set of scripts. Please see documentation in projects directories (`apps` or `packages`).

#### Main Project

```sh
yarn bootstrap # Verify dependencies for all workspaces after running the initial `yarn install`
yarn node ./path/to/script.js # Run a js script file
yarn ts-script ./path/to/script.ts # Run a ts script file
yarn up package-name [--exact] # Upgrade all instances of package to latest release

# Reusable scripts that can be included in a workspace script e.g. "lint": "yarn g:ts-script ./path/to/script.ts",
yarn g:ts-script ./path/to/script.ts
```

#### Common

```sh
#cd (packages|apps)/workspace-name # if not using workspace command
yarn [workspace workspace-name] turbo task-name [--force] # Run a turbo enabled task
yarn [workspace workspace-name] bootstrap
yarn [workspace workspace-name] start # Serve production build
yarn [workspace workspace-name] turbo run dev # Start up dev server, Storybook, watch, etc...
yann [workspace workspace-name] turbo run build # Build for production
yarn [workspace workspace-name] turbo run watch # Recompile sources when a file changes (package workspaces)
yarn [workspace workspace-name] turbo run build-storybook # Build for production
yarn [workspace workspace-name] test [--coverage]
yarn [workspace workspace-name] turbo lcov # Generate interactive coverage report (after running test coverage command above)
yarn [workspace workspace-name] lint
yarn [workspace workspace-name] format
yarn [workspace workspace-name] chromatic # See setup instructions below
yarn [workspace workspace-name] add -[D]E library-name # Add a library. Library can be a private package
```

## Chromatic Setup

1. Follow [instructions](https://www.chromatic.com/docs/setup) on creating a Chromatic project
2. Create a `.env` file if not exist in `packages/your-package`
3. Add `CHROMATIC_PROJECT_TOKEN=your-project-token` to `packages/your-package/.env`

## CI Config (Optional)

1. Follow one of the [CI guides](https://turbo.build/repo/docs/ci) on setting up environment variables for your CI
2. Keep CI configs up-to-date and add additional environments whenever you create a internal package or app.

## Vercel Deployment (Optional)

1. Create and login to a Vercel account: https://vercel.com/
2. Follow [Vercel's guide](https://vercel.com/docs/concepts/monorepos#using-monorepos-with-vercel-dashboard) on deploying apps using their dashboard

## Syncing With Original Fork (Optional)

Occassionally it may be good to keep up to date with the latest enhancements of `vite-storybook-boilerplate`. You can add new remote to merge with:

```sh
git remote add base https://github.com/psychobolt/vite-storybook-boilerplate.git
```

Anytime there are new updates, run:

```sh
git pull origin/base
# or with merge strategy:
# git merge origin/base
```
