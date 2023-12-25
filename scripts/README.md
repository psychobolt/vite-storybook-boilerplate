# Utility Scripts

Scripts for workspace or infrastructure related workflows.

## Bootstrap

`bootstrap.ts` ([Source](bootstrap.ts))

Installs workspaces that do not support `pnp` linker

## List Unmerged

`git-ls-unmerged.sh` ([Source](git-ls-unmerged.sh))

Given a list of SHA (`COMMITS`), export a list of changes (referenced by `REF`) that are not in `BASE_REF`.

### Example

We can validate and cherry-pick several commits that are not in `BASE_REF`. The following is executed in git bash:

```sh
COMMITS="f67dda88fe9d0a892c44af923cbbc50bfe454e0e bf7352d6328221cd1c02104c99f57faf5be54c7d" # possible commits
BASE_REF=master # if not declared, uses `origin/main`
source ./git-ls-unmerged.sh
echo $REF
echo $COUNT # returns number of commits not in BASE_REF
echo $OUTPUT # shortened REF, each SHA seperated by '-'
git checkout -b cherry-pick-$OUTPUT # create a branch
git cherry-pick $REF -x # note we should always provide the original SHA in the commit message. The 'x' arg will handle this.
git checkout main
git merge cherry-pick-$OUTPUT
```

## List Workspaces

`ls-workspaces.ts` ([Source](ls-workspaces.ts))

```sh
yarn ls-workspaces [options]
```

Returns a list of workspaces in the project. See options bellow.

### Filters

#### Location

`--location/-l [globExp]`

#### Name

`--name/-n [regExp]` and/or `--filter [globExp]`

Returns only workspaces that fullfills the match. For `filter`, you may use a negative expression e.g. `--filter "!apps/*"`

#### Linker

`--node-modules`

Returns only workspaces that use `node_modules` linked directories

#### No Private

`--no-private`

Returns only workspaces that are not set to `private: true`

### Formatters

```sh
--format [formatter]
```

#### `semver`

Returns the name and semantic version mapping of each workspace

## Fix Versions

`fix-versions.ts` [Source](fix-versions.ts)

```sh
yarn fix-versions
```

Bump workspace versions to the latest distributive tagged release
