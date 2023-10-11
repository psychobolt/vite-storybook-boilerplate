# Development

## Getting Started

### Local environment setup

1. Install the latest LTS node (https://nodejs.org/en/) standalone or with nvm
2. Setup Yarn (https://yarnpkg.com/getting-started/install)
3. Run command `yarn install && yarn bootstrap` in terminal to install dependencies
4. Download and install [Visual Studio Code](https://code.visualstudio.com/)
5. Open your project in VSCode with latest LTS node (e.g. `code ./vite-storybook-boilerplate`)
6. Check notifications (bottom right of VSCode status bar) and install all recommended extensions
6. Follow Yarn's [Editor SDKs guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) (step 3) to set VSCode's TypeScript version to workspace's
7. Restart VSCode and reopen the project.

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
yarn lint
yarn format

# Reusable scripts that can be included in a workspace script e.g. "lint": "yarn g:ts-script ./path/to/script.ts",
yarn g:ts-script ./path/to/script.ts
yarn g:lint-js # Lint js files with eslint
yarn g:lint-css # Lint [s]css files with stylelint
yarn g:prettier [options] # Runs prettier format tool
```

#### Workspace Scope

```sh
#cd (packages|apps)/workspace-name # option if not using yarn workspace command, otherwise you'll run task on all workspaces
yarn [workspace workspace-name] turbo task-name [--force] [-- --some-option] # Run a turbo enabled task
yarn [workspace workspace-name] bootstrap
yarn [workspace workspace-name] start # Serve production build
yarn [workspace workspace-name] turbo run dev # Start up dev server, Storybook, watch, etc...
yann [workspace workspace-name] turbo run build # Build for production
yarn [workspace workspace-name] turbo run watch # Recompile sources when a file changes (package workspaces)
yarn [workspace workspace-name] turbo run build-storybook # Build for production
yarn [workspace workspace-name] turbo run lint
yarn [workspace workspace-name] turbo run format
yarn [workspace workspace-name] turbo run chromatic # Requires Chromatic Setup
yarn [workspace workspace-name] turbo run test
yarn [workspace workspace-name] turbo run coverage # Collect code coverage (after running tests)
yarn [workspace workspace-name] turbo run lcov # Generate interactive coverage report (after running command above)
yarn [workspace workspace-name] add -[D]E library-name # Add a library. Library can be a private package
```

You can also run multiple workspaces with Turbo's filter option. e.g. `yarn turbo run format --filter=react-ui --filter=html-ui --filter=apps/**`.

See [docs](https://turbo.build/repo/docs/core-concepts/monorepos/filtering) for more details.

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
3. (Optional) Modify `scripts/opt-in-vercel.sh` to configure opt-in behavior for Vercel deployments

## Syncing With Original Fork (Optional)

Occassionally it may be good to keep up to date with the latest enhancements of `vite-storybook-boilerplate`. You can add new remote to merge with:

```sh
git remote add base https://github.com/psychobolt/vite-storybook-boilerplate.git
```

Anytime there are new updates, run:

```sh
git merge base/main
```
