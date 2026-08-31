---
name: keys
description: Gate repository dotenvx workflows that create, reset, or re-encrypt environment files without exposing environment files or secret values to the agent.
---

# Keys

Gate repository dotenvx key workflows before encrypted environment files are
created, reset, or re-encrypted. The agent may read a workspace's non-secret
`.env.defaults` and the authored static template at
`.apm/skills/**/references/.env.ci`. During an explicitly selected independent
fork identity migration, it may write that blank template to a root or
workspace replacement `.env.ci` without reading the previous file.
It must not open or read any live `.env` or workspace-local `.env.ci`, or
execute commands that load them or any secret-bearing environment variable.
Secret-dependent work must be performed by a user-controlled secure process
outside the agent's filesystem and tool context. Do not expose key values in
output, commits, or status reports.

## Procedure

1. **Identify the non-secret scope.** Determine from package documentation,
   scripts, and file names whether the requested workflow needs encrypted
   environment handling. `.env.defaults` may be read for non-secret metadata.
   The authored static template at `.apm/skills/**/references/.env.ci` may be
   read as documentation. Do not open or read `.env`, any workspace-local
   `.env.ci`, or any other live or secret-bearing environment file. During an
   explicitly selected independent fork identity migration, replacing a
   root or workspace `.env.ci` with the blank authored template is non-secret;
   do not replace any other environment file. Do not inspect process environment
   variables. Encryption remains a separate secure-process operation.
   Record the exact root and workspace target paths from the request or
   repository documentation; do not discover targets by reading environment
   files or by applying a broad environment-file glob.
2. **Select the migration mode.** Use a full reset for a new independent
   project when inherited encrypted values must not be retained. Replace each
   explicitly selected target with the blank [CI dotenv
   template](references/.env.ci), without reading the previous file, and then
   encrypt the targets as described in Step 5. Use a data-retaining migration
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
3. **Require a secure handoff.** Explain that the agent cannot validate,
   decrypt, encrypt, or generate project keys because any tool with workspace
   or process access could read the secret. Require a user-controlled secret
   manager, privileged helper, CI operation, or manually run trusted terminal
   process to perform the secret-dependent operation. Never request a private
   key in chat or ordinary tool input.
4. **Stop when no secure process exists.** If an approved secure process is not
   available, report that the workflow stopped because the agent cannot safely
   access the required key or environment files. Do not fall back to the
   ignored root `.env`, a workspace `.env.ci`, inherited environment variables,
   or a shell command run by the agent.
5. **Provide the secure process requirements.** The user-controlled process
   must validate the active root key against every applicable workspace and
   confirm decryption and re-encryption without exposing values. For a full
   reset, encrypt the repository-root `.env.ci` first, then each applicable
   workspace `.env.ci`. If a replacement root key does not yet exist, the
   secure process may encrypt the root target without `-fk` so dotenvx creates
   it; otherwise use the repository-root `.env.keys` as the `-fk` source. For
   a data-retaining migration, decrypt the targets before retiring the old key
   source, encrypt the root target without overloads to create the replacement
   root key, then encrypt each workspace target with that root key. The `-f`
   input selects the file being encrypted. Never point `-fk` at a
   workspace-local key source. The agent may
   provide non-secret command guidance, but must not invoke `yarn g:dotenv`,
   `dotenvx`, or `keypair` itself when those commands can load secret-bearing
   files. When a new CI dotenv file is required, use the [CI dotenv
   template](references/.env.ci); include the Chromatic line only when the
   project or workspace supports Chromatic. In that secure process, use the
   repository root for `-fk` when a key source is required:

   ```sh
   yarn g:dotenv encrypt -fk /path/to/repository/.env.keys -f /path/to/repository/.env.ci
   yarn g:dotenv encrypt -fk /path/to/repository/.env.keys -f /path/to/workspace/.env.ci
   ```

   For data-retaining migration, the corresponding secure decrypt operation
   uses the same root key source and target-file selection, for example:

   ```sh
   yarn g:dotenv decrypt -fk /path/to/repository/.env.keys -f /path/to/repository/.env.ci
   yarn g:dotenv decrypt -fk /path/to/repository/.env.keys -f /path/to/workspace/.env.ci
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

- [CI dotenv template](references/.env.ci)
- [dotenvx CLI introduction](https://dotenvx.com/docs/cli/introduction)
- [dotenvx `encrypt -fk` reference](https://dotenvx.com/docs/cli/encrypt-fk)
- [dotenvx `decrypt -fk` reference](https://dotenvx.com/docs/advanced/decrypt-fk)
- [dotenvx keypair reference](https://dotenvx.com/docs/cli/keypair)

Use the repository's `g:dotenv` wrapper in the user-controlled secure process
rather than assuming a globally installed binary. The agent must not invoke it
when it can access secret-bearing environment files.
