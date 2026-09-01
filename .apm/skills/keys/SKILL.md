---
name: keys
description: Gate repository dotenvx workflows that create, reset, or re-encrypt environment files without exposing environment files or secret values to the agent.
---

# Keys

Gate dotenvx workflows that create, reset, or re-encrypt environment files.
Follow the root [environment-file boundary](../../../AGENTS.md#environment-file-boundary);
this skill owns only its narrow exception for writing and encrypting newly
created empty or templated targets. It may read `.env.defaults` and authored
templates under `references/.env.*` as documentation, but never live
environment files, private keys, or secret-bearing process values. Secret-
dependent work requires a user-controlled secure process. Preserve blank
template placeholders and never add example variables or values before
encryption.

## Procedure

1. **Identify and classify the non-secret scope.** Determine from the request,
   package documentation, scripts, and `.env.defaults` whether encrypted
   environment handling is required. Record exact root and workspace target
   paths; do not discover them by reading environment files or applying a
   broad glob. Classify each selected target before writing it:

   - the repository-root `.env.<environment>` target is intentionally empty;
   - a newly required workspace or package target uses its matching authored
     template under this skill's `references/` directory, preserving every
     placeholder exactly (for example, `CHROMATIC_PROJECT_TOKEN=""` in the
     Storybook CI template).

   Never apply the root-empty rule to a workspace or package target, and never
   replace a required template with a blank file or invented values. If a
   required template is missing, stop and ask rather than copying another
   template. Retained or existing values always use the secure-process path;
   full-reset encryption follows Step 5.

2. **Select the migration mode.** Use a full reset for a new independent
   project or an extension when the selected workflow establishes new targets
   or explicitly resets existing targets and inherited encrypted values must
   not be retained. Write the selected targets according to the classification
   in Step 1, without reading the previous files. Do not create a workspace
   target unless the workflow establishes that target. Then encrypt the
   targets as described in Step 5. For a newly created package
   whose workflow requires an environment target, write its matching template
   and encrypt it with the repository-root key; do not create a package-local
   key source. Use a data-retaining migration when an extension or other
   workflow must preserve existing values. In that mode, a secure
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
   to encrypting empty or templated targets written during the current fork,
   extension, or package-scaffolding operation;
   never request a private key in chat or ordinary tool input.
4. **Stop when no secure process exists.** If an approved secure process is not
   available for a data-retaining migration or any target that is not a newly
   written empty or templated target, report that the workflow stopped because the agent
   cannot safely access the required key or environment files. Do not fall
   back to the ignored root `.env`, a workspace `.env.*`, inherited
   environment variables, or a shell command run by the agent.
5. **Run one encryption pass.** For a full reset, collect every selected
   target for the same environment suffix before invoking dotenvx. Run one
   `encrypt` command with one repository-root `-fk` path and one `-f` option per
   root, workspace, or package target. The `-fk` path identifies the shared
   `.env.keys` file that dotenvx may create or update; it is not another
   environment input and does not justify a second encryption pass. Never run
   root and workspace encryption as separate commands, and never rerun
   `encrypt` after a partial or ambiguous result without a secure process first
   resolving the key file. A full reset may use:

   ```sh
   yarn g:dotenv encrypt \
     -fk /path/to/repository/.env.keys \
     -f /path/to/repository/.env.environment \
     -f /path/to/workspace/.env.environment \
     -f /path/to/package/.env.environment
   ```

   For a package-only enrollment, use one command with the new target and the
   established repository-root `-fk` path. Do not create or encrypt a target
   unless the calling workflow establishes it. If no target is created or
   reset, run no encryption. If the secure process reports multiple private-
   key entries, do not merge them, convert them to comma-separated values, or
   edit the key file through the agent; resolve the key set in that secure
   process.

   Dotenvx may add its sample `HELLO` key when encrypting an empty target.
   After the single encryption command succeeds, remove that known sample from
   the affected targets with one non-secret `del` command listing the same
   `-f` paths. For example:

   ```sh
   yarn g:dotenv del HELLO \
     -f <root-target> \
     -f <workspace-target>
   ```

   Do not replace it with a value and do not run `encrypt` again.
   Use the command exit status and non-secret output to determine whether both
   commands succeeded; do not read `.env.keys` or command output that contains
   private key values. When a new environment file is required, resolve its
   matching template from this skill; do not duplicate template paths or
   command rules in the calling workflow.

   If an existing root key must be replaced, a secure process must retire it
   before the single encryption command. For a data-retaining migration, the
   user-controlled secure process must validate the active root key against
   every applicable workspace, decrypt the targets before retiring the old key
   source, encrypt all recovered targets in one pass with the replacement root
   `-fk` path, and remove any generated `HELLO` sample without exposing values.
   The `-f` options select the files being encrypted. Never point `-fk` at a
   workspace-local key source.

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
7. **Accept only a non-secret result.** For agent-run full-reset encryption,
   continue after the approved command reports success without secret output.
   For secure-process operations, continue only after that process reports a
   non-secret result, such as success or failure, the affected workspace names,
   and any required public configuration changes. Do not ask for key values,
   decrypted values, ciphertext, or environment-file contents.
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
