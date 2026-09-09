# Workflows

## Integration

This project contains several default configurations to help you setup CI testing and deployment. Before you begin, make sure to configure some essential environments.

### Turbo

Follow one of the [CI guides](https://turbo.build/repo/docs/ci) on setting up environment variables for your CI

### Chromatic

1. Follow [instructions](https://www.chromatic.com/docs/setup) on creating a Chromatic project
2. Create a `.env` file if not exist in `packages/your-package`
3. Add `CHROMATIC_PROJECT_TOKEN=your-project-token` to `packages/your-package/.env`

### Vercel

Follow [Vercel's guide](https://vercel.com/docs/getting-started-with-vercel) on setting up your deployments to Vercel's dashboard.

## Agent Skills

Repository-specific agent workflows are authored in the [.apm/skills/](.apm/skills/) directory and referenced in the root [AGENTS](AGENTS.md#workflow-skills) markdown file. In most cases, the skills can be found automatically by the LLM agent after APM deployment. They can also be installed manually with [APM](DEVELOPMENT.md#setup-agent-package-manager-recommended).

### Fork

Ideally the [fork skill](.apm/skills/fork/SKILL.md) is used when establishing the early project identity after cloning the base project.

#### New Project Identity (with history reset)

Execute this only once at the beginning of the project's conception.

```text
Prepare this repository as an independent fork with a new identity.

Project name: <project-name, or use the current directory name>
Project URL for origin: <project-url>
Author and copyright holder: <value, or retain the existing value>
License: <requested license or terms, or retain the existing license>
History: reset the existing Git history after completing the fork preflight.
```

#### Project Extension (with existing history)

Execute this only once at the beginning of the project's conception.

```text
Prepare this repository as an extension of an existing project.

Project URL for origin: <project-url>
History: preserve the existing Git history; do not reset it.
```

#### Workspaces Removal

Can be run anytime after initial project conception.

```text
Review and apply cleanup to these paths:

Requested paths:
- <path>
- <path>

Confirm the exact deletion set before removing anything.
```

### Sync

This skill performs a merge between the base upstream git project (base/\*\*) and the current (origin/main). The agent will determine what changes to be kept, merged, or overwritten during conflict resolution. Then it will rebase to your local branch.

> Note: If a common git [merge-base](https://git-scm.com/docs/git-merge-base) history is found, all history is retained from the base and origin. An `base-main` local branch is only created as a merge reference if there is no related history - **do NOT publish this branch.**

Before you begin, make sure you are on a clean branch. Preferrably your changes stashed or already committed (and not pushed):

```sh
git stash                   # or git add . && git commit -m "[DEV] Patch"
git checkout -b dev/upgrade # or dev/patch
```

Then instruct the agent to sync across projects using the local skill, e.g:

```text
I've created a new local branch. Sync changes from base/main. Do not publish any changes.
```

Once complete, you may verify changes before proceeding e.g. `git merge --continue`.

## Syncing With Base Project (git)

Occasionally it may be good to keep up to date with the latest enhancements of `vite-storybook-boilerplate`. You can add new remote to merge with:

```sh
git remote add base https://github.com/psychobolt/vite-storybook-boilerplate
```

Anytime there are new updates, run:

```sh
git fetch base
git merge base/main [--squash]
git add .                                # after resolving any conflicts
git commit -m "upgrading infrastructure" # your comment
git push
```
