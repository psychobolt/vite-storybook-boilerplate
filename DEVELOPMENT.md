# Development

## Getting Started

### Local environment setup

1. Install the latest LTS node (https://nodejs.org/en/) standalone or with [nvm](https://nodejs.org/en/download/package-manager#nvm)/[nvm-windows](https://github.com/coreybutler/nvm-windows)
2. Setup Yarn (https://yarnpkg.com/getting-started/install)
3. Run command `yarn install && yarn bootstrap` in terminal to install dependencies
4. Download and install [Visual Studio Code](https://code.visualstudio.com/)
5. Open your project in VSCode with latest LTS node (e.g. `nvm use lts/* && code ./vite-storybook-boilerplate`)
6. Check notifications (bottom right of VSCode status bar) and install all recommended extensions
7. Follow Yarn's [Editor SDKs guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) (step 3) to set VSCode's TypeScript version to workspace's
8. Restart VSCode and reopen the project.

### ESLint Setup

In order to support lint highlighting in VSCode editor, your workspace config must be flattened as `[workspace]/eslint.config.ts`. If you've scaffolded your workspace project, please refer [example](eslint.config.ts) and [docs](https://eslint.org/docs/latest/use/configure/configuration-files-new) for migration references.

#### Troubleshooting

##### Windows

To overcome the `spawn: UNKNOWN` error, update your `.vscode/settings.json` file with:

```json
{
  "eslint.runtime": "node",
  "eslint.execArgv": ["D://absolute/path/to/your/project/bin/eslint-runtime.js"]
}
```

> Keep this change and ensure the settings file is not pushed.

### Setup Remote Cache (Optional)

#### Local Development

1. Create and login to a Vercel account: https://vercel.com/
2. Login to the default remote cache provider: `yarn turbo login`
3. Follow any prompt instructions
4. Run `yarn turbo link`

### Commands

```sh
# Some examples
yarn my-bin-script # Execute a binary script
yarn my-task-name # Run a task
yarn run [-B] my-bin-or-task-name
yarn exec my-bin-or-script
```

See [information](https://yarnpkg.com/cli) on commands for Yarn.

> Each project level has their own set of scripts. Please see documentation in projects directories (`apps` or `packages`).

#### Main Project

```sh
yarn node ./path/to/script.js # Run a js script file
yarn run-script ./path/to/script.ts # Run a ts script file
yarn up package-name [--exact] # Upgrade all instances of package to latest release
yarn lint
yarn format # This is automatically called on git commit

# Global tasks that can be hoisted to any workspace scope
yarn g:run-script ./path/to/script.ts # Reusable scripts that can be included in a workspace script e.g. "lint": "yarn g:run-script ./path/to/script.ts"
yarn g:lint-js # Lint js files with eslint
yarn g:lint-css # Lint [s]css files with stylelint
yarn g:prettier [options] # Runs prettier format tool
```

##### Additional Scripts

See [scripts/README.md](scripts/README.md)

#### Workspace Scope

```sh
#cd (packages|apps)/workspace-name # optional if not using yarn workspace command, otherwise you'll run task on all workspaces
yarn [workspace workspace-name] turbo task-name [--force] [-- --some-option] # Run a turbo enabled task
yarn [workspace workspace-name] turbo run start # Serve production build
yarn [workspace workspace-name] turbo run dev # Start up dev server, Storybook, watch, etc...
yann [workspace workspace-name] turbo run build # Build for production
yarn [workspace workspace-name] turbo run watch # Recompile sources when a file changes (package workspaces)
yarn [workspace workspace-name] turbo run build-storybook # Build for production
yarn [workspace workspace-name] turbo run lint
yarn [workspace workspace-name] turbo run format # This is automatically called on git commit
yarn [workspace workspace-name] turbo run chromatic # Requires Chromatic Setup
yarn [workspace workspace-name] turbo run test
yarn [workspace workspace-name] turbo run coverage # Collect code coverage (also may run tests)
yarn [workspace workspace-name] turbo run lcov # Generate interactive coverage report (after running command above)
yarn [workspace workspace-name] add -[D]E library-name # Add a library. Library can be a private package
```

You can also run multiple workspaces with Turbo's filter option. e.g. `yarn turbo run format --filter=react-ui --filter=html-ui --filter=apps/**`.

See [docs](https://turbo.build/repo/docs/core-concepts/monorepos/filtering) for more details.

## Chromatic Setup

1. Follow [instructions](https://www.chromatic.com/docs/setup) on creating a Chromatic project
2. Create a `.env` file if not exist in `packages/your-package`
3. Add `CHROMATIC_PROJECT_TOKEN=your-project-token` to `packages/your-package/.env`

## Envrionment Variables

### Using environment files

```sh
yarn [workspace] g:dotenv my-script-or-bin # Loads envronment variables with your script or bin
```

See [documentation](https://github.com/entropitor/dotenv-cli#usage) for usage.

### Best Practices

- Keep team shared secrets in a `.env` file. Utilize [`dotenv-vault`](https://www.dotenv.org/) e.g. (`yarn [workspace] g:dotenv-vault [pull/push]`), to sync environment variables with your CI or the team.
- Keep personal secrets or local overrides in a `.env*.local` file.
  By default, it is best practice to not commit `.env*` files. However, the exception is default variables for a project (e.g. `.env.defaults`, `.env.production`, `.env.development`, etc...).

## [Workflows](WORKFLOW.md)

Additional development guides and best practices
