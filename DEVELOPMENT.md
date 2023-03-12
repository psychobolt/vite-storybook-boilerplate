# Development

## Getting Started

### Local environment setup

1. Init or checkout your repository with your chosen git client ([with a SSH url](https://git-scm.com/docs/git-clone#_git_urls))
2. Install the latest LTS node (https://nodejs.org/en/)
3. Setup Yarn (https://yarnpkg.com/getting-started/install)
4. Download and install [Visual Studio Code](https://code.visualstudio.com/)
5. Open your terminal and `cd` into your project root directory
6. Run command `yarn` to unplug dependencies

#### Setup Remote Cache (Optional)

1. Create and login to a Vercel account: https://vercel.com/
2. Connect Turborepo with Vercel to sync cache across all environments (remote and local): ```yarn turbo login```
3. Follow the prompt instructions
4. Follow one of the [CI guides](https://turbo.build/repo/docs/ci) on setting up environment variables for your CI

## Syncing With Original Fork

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

## Scripts

Coming soon
