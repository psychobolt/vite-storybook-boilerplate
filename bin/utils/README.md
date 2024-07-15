# Utils

## Functions

### `const { error, stdout, stderr } = await $(command, options)`

Analogous to running a sub process, denoted similarly as [shell substitution](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html) e.g. `$(command)`. By default, command `stdio` will be piped to the main process.
