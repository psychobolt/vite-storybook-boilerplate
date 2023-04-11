# Development

## Getting Started

### Local environment setup

1. Init or checkout your repository with your chosen git client ([with a SSH url](https://git-scm.com/docs/git-clone#_git_urls))
2. Install the latest LTS node (https://nodejs.org/en/) standalone or with nvm
3. Setup Yarn (https://yarnpkg.com/getting-started/install)
4. Download and install [Visual Studio Code](https://code.visualstudio.com/)
5. Open your project in VSCode and install the recommended extensions
6. Run command `yarn install` in terminal to unpack root binaries
7. Run command `yarn bootstrap` in terminal to verify all dependencies
8. Follow Yarn's [Editor SDKs guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) to set VSCode's TypeScript version to workspace's

### Setup Remote Cache (Optional)

#### Local Development 

1. Create and login to a Vercel account: https://vercel.com/
2. Login to the default remote cache provider: ```yarn turbo login```
3. Follow any prompt instructions
4. Run ```yarn turbo link```

### Commands

```sh
yarn node ./script.js # Run a script file
yarn run script-name # Run a task
yarn turbo script-name # Run a turbo enabled task
```

See additional commands from yarn's [CLI guide](https://yarnpkg.com/cli)

> Each project level has their own set of scripts. Please see documentation in projects directories (`apps` or `packages`).

#### Main Project

```sh
yarn bootstrap # Verify dependencies for all workspaces
yarn dev # Start development services for all workspace projects
yarn build # Build all workspace projects

# Add a library to a workspace. You can also # cd app/app-name or packages/package-name and run `yarn add -[D]E library-name`
yarn workspace workspace-name add -[D]E library-name # library name can be a internal package
```

#### Internal Packages

##### Common Commands

```sh
cd packages/package-name
yarn dev
yann build
yarn build-storybook
yarn command-name script-name
yarn turbo chromatic # See setup instructions below
```

##### Chromatic Setup

1. Follow [instructions](https://www.chromatic.com/docs/setup) on creating a Chromatic project
2. Create a `.env` file if not exist in `packages/your-package`
3. Add `CHROMATIC_PROJECT_TOKEN=your-project-token` to `packages/your-package/.env`

#### Apps

##### Common Commands

```sh
cd apps/app-name
yarn dev
yarn build
yarn command-name script-name
```

## CI Config (Optional)

1. Follow one of the [CI guides](https://turbo.build/repo/docs/ci) on setting up environment variables for your CI
3. Keep CI configs up-to-date and add additional environments whenever you create a internal package or app.

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