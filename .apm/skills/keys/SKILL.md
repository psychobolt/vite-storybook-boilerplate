---
name: keys
description: Gate repository dotenvx workflows that create, reset, or re-encrypt environment files without exposing environment files or secret values to the agent.
---

# Keys

Gate repository dotenvx key workflows before encrypted environment files are
created, reset, or re-encrypted. The agent may read a workspace's non-secret
`.env.defaults` and authored static environment templates under
`.apm/skills/keys/references/.env.*` as documentation. During an explicitly
selected independent fork identity migration, it may write an empty root
`.env.<environment>` target or a matching template to a newly required
workspace target, without reading the previous files. During scaffolding, it
may write a matching template to a newly created package when that target is
established by the package documentation and encrypt it with the repository-
root key. It may then run the narrow template-encryption paths described
below. It must not open or read any live `.env.*` file or execute commands that
load one or any secret-bearing environment variable. Secret-dependent work
must be performed by a user-controlled secure process outside the agent's
filesystem and tool context. Do not expose key values in output, commits, or
status reports.

## Procedure

1. **Identify the non-secret scope.** Determine from package documentation,
   scripts, and file names whether the requested workflow needs encrypted
   environment handling. `.env.defaults` may be read for non-secret metadata.
   Authored static environment templates under `.apm/skills/keys/references/`
   may be read as documentation. Do not open or read live `.env.<environment>`
   files outside that authored template directory, except the permitted
   `.env.defaults` metadata, and never read `.env.keys` or any other live or
   secret-bearing environment file. During an explicitly selected independent
   migration, replacing a root `.env.<environment>` target with an empty file
   and replacing a newly required workspace `.env.<environment>` target with
   its matching authored template are non-secret; do not replace any other
   environment file. Do not inspect process environment variables.
   Encryption of retained or existing values remains a separate secure-process
   operation; full-reset encryption follows Step 5. Record the exact
   root and workspace target paths from the request or repository
   documentation; do not discover targets by reading environment files or by
   applying a broad environment-file glob. For each target, resolve the
   matching `.env.*` template under this skill's `references/` directory. If
   the required template does not exist, stop and ask rather than inventing
   values or copying another environment template.
2. **Select the migration mode.** Use a full reset for a new independent
   project when inherited encrypted values must not be retained. Replace each
   explicitly selected root `.env.<environment>` target with an empty file,
   and replace each explicitly selected workspace `.env.<environment>` target
   with its matching authored template, without reading the previous files. Do
   not create a workspace target from a template unless the workflow
   establishes that target. Then encrypt the targets as described in Step 5.
   For a newly created package whose workflow requires an environment target,
   write its matching template and encrypt it with the repository-root key; do
   not create a package-local key source. Use a data-retaining migration
   only when the user wants existing values preserved. In that mode, a secure
   process decrypts each target with the currently valid private-key source
   from the repository root (`.env.keys` or the project's established secure
   root `.env` source), retires the old `.env.keys` only after successful
   recovery, and encrypts the recovered root target without an overload so a
   replacement root key can be created. It then encrypts each workspace target
   with that new root key. Re-encryption must not use `.env` overloads or other
   additional value sources, so existing values are not silently replaced or
   merged. A full reset is the repository's key-rotation path; there is no
   separate `rotate` command. Data retention uses decrypt, key retirement, and
   encrypt in that order. If the user has not selected a mode, stop and ask
   whether to reset the target values or retain them.
3. **Require a secure handoff where needed.** Explain that the agent cannot
   validate or decrypt existing environment files, retire an existing private
   key source, or re-encrypt retained values because any tool with workspace or
   process access could read the secret. Those operations require a
   user-controlled secret manager, privileged helper, CI operation, or
   manually run trusted terminal process. The full-reset exception is limited
   to encrypting empty or templated targets written during the current fork or
   package-scaffolding operation;
   never request a private key in chat or ordinary tool input.
4. **Stop when no secure process exists.** If an approved secure process is not
   available for a data-retaining migration or any target that is not a newly
   written empty or templated target, report that the workflow stopped because the agent
   cannot safely access the required key or environment files. Do not fall
   back to the ignored root `.env`, a workspace `.env.*`, inherited
   environment variables, or a shell command run by the agent.
5. **Run the approved encryption path.** For a full reset, after the agent
   writes the empty root target and any matching workspace templates, it may
   encrypt the repository-root `.env.<environment>` target first, then each
   applicable workspace `.env.<environment>` target.
   Omit `-fk` for the root command when a fresh root key must be generated;
   use the repository-root `.env.keys` as the `-fk` source for workspace
   commands. Do not create or encrypt a workspace target unless the package
   documentation explicitly requires that environment target. When a new
   environment file is required, resolve its matching template from this
   skill; do not duplicate template paths or command rules in the calling
   workflow.
   If an existing root key must be replaced, a secure process must
   retire it before the root encryption command. For a data-retaining
   migration, the user-controlled secure process must validate the active root
   key against every applicable workspace, decrypt the targets before
   retiring the old key source, encrypt the root target without overloads to
   create the replacement root key, then encrypt each workspace target with
   that root key without exposing values. The `-f` input selects the file being
   encrypted. Never point `-fk` at a workspace-local key source. The full-reset
   commands are:

   ```sh
   yarn g:dotenv encrypt -f /path/to/repository/.env.environment
   yarn g:dotenv encrypt -fk /path/to/repository/.env.keys -f /path/to/workspace/.env.environment
   ```

   For a newly created UI package whose workflow requires an environment
   target, use the repository-root key directly:

   ```sh
   yarn g:dotenv encrypt -fk /path/to/repository/.env.keys -f /path/to/package/.env.environment
   ```

   Run these commands only for empty or templated targets written during the
   current full-reset or package-scaffolding operation, without overload files
   or additional `.env` inputs. Do not read `.env.keys` or command output that
   contains private key values.

   For data-retaining migration, the corresponding secure decrypt operation
   uses the same root key source and target-file selection, for example:

   ```sh
   yarn g:dotenv decrypt -fk /path/to/repository/.env.keys -f /path/to/repository/.env.environment
   yarn g:dotenv decrypt -fk /path/to/repository/.env.keys -f /path/to/workspace/.env.environment
   ```

   Do not pass an overload file or an additional `.env` input to either
   encryption command.

6. **Handle failed recovery externally.** If data-retaining validation fails,
   the secure process must warn that existing encrypted values cannot be
   recovered with a replacement key unless another valid private key or
   plaintext recovery source exists. A full reset may proceed only after the
   user accepts that existing encrypted values will be lost. Do not ask the
   agent to copy, inspect, or verify the resulting environment files.
7. **Accept only a non-secret result.** Continue only after the user-controlled
   process reports a non-secret result, such as success or failure, the affected
   workspace names, and any required public configuration changes. Do not ask
   for key values, decrypted values, ciphertext, or environment-file contents.
8. **Clean up agent-visible state.** Do not retain secret values because the
   agent must never receive them. Do not retain secure-process output that
   contains secrets in task notes, logs, generated artifacts, commits, or the
   final response. Do not claim that conversation context can be erased; avoid
   repeating any sensitive value if one is accidentally exposed.

## References

- [Environment templates](references/)
- [Storybook CI dotenv template](references/.env.ci)
- [dotenvx CLI introduction](https://dotenvx.com/docs/cli/introduction)
- [dotenvx `encrypt -fk` reference](https://dotenvx.com/docs/cli/encrypt-fk)
- [dotenvx `decrypt -fk` reference](https://dotenvx.com/docs/advanced/decrypt-fk)
- [dotenvx keypair reference](https://dotenvx.com/docs/cli/keypair)

Use the repository's `g:dotenv` wrapper in the user-controlled secure process
rather than assuming a globally installed binary. The agent must not invoke it
when it can access secret-bearing environment files.
