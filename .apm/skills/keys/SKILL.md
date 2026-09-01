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
   encrypted root-environment handling is required. Record exact root and
   workspace target paths; do not discover them by reading environment files or
   applying a broad glob. Classify each selected target before writing it:

   - the repository-root `.env.<environment>` target is intentionally empty and
     is the only target that will be encrypted;
   - a newly required workspace or package target is cloned from the newly
     encrypted root target to carry its public key, then stitched with its
     matching authored template under this skill's `references/` directory,
     preserving every placeholder exactly (for example,
     `CHROMATIC_PROJECT_TOKEN=""` in the Storybook CI template); it remains
     unencrypted.

   Never apply the root-empty rule to a workspace or package target, and never
   replace a required template with a blank file or invented values. If a
   required template is missing, stop and ask rather than copying another
   template. Never encrypt a workspace or package target. Retained or existing
   values always use the secure-process path; full-reset encryption follows
   Step 5.

2. **Select the migration mode.** Use a full reset for a new independent
   project or an extension when the selected workflow establishes new targets
   or explicitly resets existing targets and inherited encrypted values must
   not be retained. Write the selected targets according to the classification
   in Step 1, without reading the previous files. Do not create a workspace
   target unless the workflow establishes that target. Encrypt only the root
   target as described in Step 5. For a newly created package whose workflow
   requires an environment target, write its matching plaintext template and do
   not create a package-local key source. Use a data-retaining migration when an
   extension or other
   workflow must preserve existing values. In that mode, a secure
   process decrypts each target with the currently valid private-key source
   from the repository root (`.env.keys` or the project's established secure
   root `.env` source), retires the old `.env.keys` only after successful
   recovery, and encrypts the recovered root target without an overload so a
   replacement root key can be created. Workspace targets remain plaintext
   templates and are not included in dotenv encryption. Re-encryption must not
   use `.env` overloads or other additional value sources, so existing values
   are not silently replaced or merged. A full reset is the repository's
   key-rotation path; there is no separate `rotate` command. Data retention uses
   decrypt, key retirement, and root encryption in that order. If the user has
   not selected a mode, stop and ask whether to reset the target values or
   retain them.
3. **Require a secure handoff where needed.** Explain that the agent cannot
   validate or decrypt existing environment files, retire an existing private
   key source, or re-encrypt retained values because any tool with workspace or
   process access could read the secret. Those operations require a
   user-controlled secret manager, privileged helper, CI operation, or
   manually run trusted terminal process. The full-reset exception is limited
   to encrypting the empty root target written during the current fork,
   extension, or package-scaffolding operation; workspace and package template
   creation is plaintext and does not use dotenv encryption.
   never request a private key in chat or ordinary tool input.
4. **Stop when no secure process exists.** If an approved secure process is not
   available for a data-retaining migration or a root target that is not newly
   written and empty, report that the workflow stopped because the agent cannot
   safely access the required key or environment files. Do not fall
   back to the ignored root `.env`, a workspace `.env.*`, inherited
   environment variables, or a shell command run by the agent.
5. **Encrypt only the root target.** Run encryption from the repository root
   against the newly written empty root target. Do not encrypt workspace or
   package targets; their matching templates remain plaintext. Use the root key
   file resolved by the repository's Yarn configuration and do not pass `-fk`.
   Yarn may inject the root `.env.keys` values into the command when that file
   exists. If a root target has no public key while an existing root key source
   may be retained, stop and use the secure-process path rather than generating
   another key entry. The root encryption command is:

   ```sh
   yarn g:dotenv encrypt \
     -f /path/to/repository/.env.environment
   ```

   Dotenvx may add its sample `HELLO` key when encrypting the empty root
   target. After root encryption succeeds, remove that known sample from the
   root target with one non-secret `del` command:

   ```sh
   yarn g:dotenv del HELLO \
     -f <root-target>
   ```

   Do not replace it with a value and do not run `encrypt` again.

6. **Create workspace templates.** After root encryption and root `HELLO`
   cleanup succeed, clone the root target into each newly required workspace or
   package target, remove its trailing blank line while preserving the normal
   final newline, then stitch in its matching authored template. This carries
   the root public key while preserving placeholders such as
   `CHROMATIC_PROJECT_TOKEN=""` as plaintext. Do not encrypt a workspace target
   or create a workspace-local key source. If a workspace target already
   contains encrypted or non-template values, stop and use the secure-process
   path. If no target is created or reset, create none.

   Use the command exit status and non-secret output to determine whether the
   root encryption and cleanup succeeded; do not read `.env.keys` or command
   output that contains private key values. When a new environment file is
   required, resolve its matching template from this skill; do not duplicate
   template paths or command rules in the calling workflow.

   If an existing root key must be replaced, a secure process must retire it
   before keypair initialization. For a data-retaining migration, the
   user-controlled secure process must validate the active root key, decrypt the
   root target before retiring the old key source, encrypt the recovered root
   target from the repository root using its default key-file resolution, and
   remove any generated `HELLO` sample without exposing values. Workspace
   templates are not part of this operation. Do not run these commands from a
   workspace directory or create a workspace-local key source.

   For data-retaining migration, the corresponding secure decrypt operation
   uses the same root key source and target-file selection, for example:

   ```sh
   yarn g:dotenv decrypt -f /path/to/repository/.env.environment
   ```

   Do not pass an overload file or an additional `.env` input to the root
   encryption command.

7. **Handle failed recovery externally.** If data-retaining validation fails,
   the secure process must warn that existing encrypted values cannot be
   recovered with a replacement key unless another valid private key or
   plaintext recovery source exists. A full reset may proceed only after the
   user accepts that existing encrypted values will be lost. Do not ask the
   agent to copy, inspect, or verify the resulting environment files.
8. **Accept only a non-secret result.** For agent-run full-reset encryption,
   continue after the approved command reports success without secret output.
   For secure-process operations, continue only after that process reports a
   non-secret result, such as success or failure, the affected workspace names,
   and any required public configuration changes. Do not ask for key values,
   decrypted values, ciphertext, or environment-file contents.
9. **Clean up agent-visible state.** Do not retain secret values because the
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
