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
git checkout -b cherry-pick-$OUTPUT # create a PR branch
git cherry-pick $REF -x # note we should always provide the original SHA in the commit message. The 'x' arg will handle this.
git push
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

`--name/-n [regExp]` and/or `--filter [globExp]`.

Returns only workspaces that fullfills the match. For `filter`, you may use a negative expression e.g. `--filter "!apps/*"`.

#### Linker

`--node-modules`

Returns only workspaces that use `node_modules` linked directories.

#### Turbo Only

`--turbo-only`

Returns only workspaces that support `turbo`.

#### No Private

`--no-private`

Returns only workspaces that are not set to `private: true`.

#### Since

`--since`

Only include workspaces that have been changed since [changesetBaseRefs](https://yarnpkg.com/configuration/yarnrc#changesetBaseRefs).

### Formatters

```sh
--format [formatter]
```

#### `semver`

Returns the name and semantic version mapping of each workspace.

E.g.

```json
{ "[workspaceName1]": "[semVer1]", "[workspaceName2]": "[semVer2]" }
```

## Apply Versions

`apply-versions.ts` [Source](apply-versions.ts)

```sh
yarn apply-versions [--strategy [type]] [--force]
```

Utility for applying version strategy targets from `.yarn/versions`. Before running, run `git stash` to ensure workspaces are in a clean state. If no strategy `type` is specified, the default strategy used is `build`.

| Type        | SemVer                                 |
| ----------- | -------------------------------------- |
| `build`     | \_.\_.1-dev.^x                         |
| `launch`    | ^X.^x.0                                |
| `stable`    | \_.^x.^x[-rc.^x] <br> \_.\_.\_-rc.^x\* |
| `minor`\*\* | \_.^x.\_                               |
| `patch`\*\* | \_.\_.^x                               |

^ = possible bumps

[ ] = optional tag that is used to prevent version conflicts. For instance, if 1.2.0 is the latest and there is a new a minor version strategy on 1.1.0, bump to preminor instead: 1.2.0-rc.1. \*Additional long releases will only increment prerelease.

\*\* Applies all target workspaces and additionally apply bump. It will also bump changed workspaces.
