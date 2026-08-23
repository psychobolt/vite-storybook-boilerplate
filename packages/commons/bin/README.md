# Bin

Commons scripts, executables, and any runtimes for workspace or infrastructure related workflows.

## List Workspaces

`ls-workspaces` ([Source](ls-workspaces.ts))

```sh
yarn ls-workspaces [options]
```

Returns a list of workspaces in the project. See options below.

### Filters

#### Name

`--name/-n [regExp]`

Returns only workspaces that fullfills the match.

#### Include/Exclude

`--include [globExp]` and/or `--exclude [globExp]`

List workspaces that matches a glob pattern for location. You may use a combination of filters (e.g. `--include "packages/*" --exclude "packages/*-{ui,config}"`).

#### Node Linker

`--node-linker [type]`

Returns only workspaces that matches the linker type (e.g. `pnpm`). You can specify more than one filters e.g. `--node-linker=pnpm --node-linker=node-modules`

#### Turbo Only

`--turbo-only`

Returns only workspaces that support `turbo`.

#### Storybook

`--storybook`

Returns only workspaces that contain a `.storybook/main.*` configuration file.

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

## Lint

`lint.ts` ([Source](lint.ts))

A suite that executes and outputs the results from supported runners ([ESLint](utils/README.md#eslint), [Stylelint](utils/README.md#eslint)).

```sh
# For integrated workspace
yarn g:run-script $PROJECT_CWD/bin/lint.ts [options]
# Or
yarn lint [options]
# Or
npm lint [options]
```

### Options

#### Runner

```sh
--runner [runner]
```

Pass one or more runner to be executed and return results.

#### Formatter

```sh
--formatter [formatter | reporter] # shorthand (-f)
```

Pass one or more formatter or reporter flags.

## TSC Paths (Experimental)

`tsc-paths.ts` ([Source](./tsc-paths.ts))

Remove alias and restore relative path for project modules in `*.d.ts` emitted files.

```sh
# For integrated workspace
yarn tsc --project ./tsconfig.dts.json && yarn g:run-script $PROJECT_CWD/bin/lint.ts [options]
# Or
yarn tsc --project ./tsconfig.dts.json && tsc-paths [options]
# Or
npm tsc --project ./tsconfig.dts.json && tsc-paths [options]
```

### Options

#### Project (Required)

Process files based on TypeScript [config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```sh
--project /path/to/tsconfig.json # shorthand (-p)
```

#### Watch

Watch for emitted declaration files and process them.

```sh
--watch # shorthand (-w)
```
