# Unplugged

Workspace for hoisting any non-PnP configurations or dependencies into their "unplugged" state. 

## Configuration

```sh
yarn workspace unplugged add -[D]E library-name
```

## Q & A

__Q:__ What's the difference between `yarn unplug library-name` and _this_ workspace?

__A:__ Use `yarn unplug` for libraries that cannot completely use Yarn's resolver or linker (e.g. pnpm, CJS/ESM loader). If however, it can be resolved by any of the project runtimes and not elsewhere, then it is preferred to mirror the libraries so that can be resolved in this workspace as a _alternative_.
