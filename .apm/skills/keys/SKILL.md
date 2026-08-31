---
name: keys
description: Gate repository dotenvx workflows that create or rotate encrypted environment files without exposing environment files or secret values to the agent.
---

# Keys

Gate repository dotenvx key workflows before encrypted environment files are
created or rotated. The agent may read a workspace's non-secret `.env.defaults`
for development metadata and the authored static template at
`.apm/skills/**/references/.env.ci`. It must not open, read, write, or execute
commands that load `.env`, any workspace-local `.env.ci`, or any secret-bearing
environment variable.
Secret-dependent work must be performed by a user-controlled secure process
outside the agent's filesystem and tool context. Do not expose key values in
output, commits, or status reports.

## Procedure

1. **Identify the non-secret scope.** Determine from package documentation,
   scripts, and file names whether the requested workflow needs encrypted
   environment handling. `.env.defaults` may be read for non-secret metadata.
   The authored static template at `.apm/skills/**/references/.env.ci` may be
   read as documentation. Do not open, read, or modify `.env`, any
   workspace-local `.env.ci`, or any other live or secret-bearing environment
   file. Do not inspect process environment variables.
2. **Require a secure handoff.** Explain that the agent cannot validate,
   decrypt, encrypt, rotate, or generate project keys because any tool with
   workspace or process access could read the secret. Require a user-controlled
   secret manager, privileged helper, CI operation, or manually run trusted
   terminal process to perform the secret-dependent operation. Never request a
   private key in chat or ordinary tool input.
3. **Stop when no secure process exists.** If an approved secure process is not
   available, report that the workflow stopped because the agent cannot safely
   access the required key or environment files. Do not fall back to the
   ignored root `.env`, a workspace `.env.ci`, inherited environment variables,
   or a shell command run by the agent.
4. **Provide the secure process requirements.** The user-controlled process
   must validate the shared project key against every applicable workspace,
   confirm decryption and re-encryption without exposing values, and preserve
   comma-separated transition keys when the dotenv workflow supports them. It
   must ask the user before rotation. The agent may provide non-secret command
   guidance, but must not invoke `yarn g:dotenv`, `dotenvx`, `keypair`, or
   `rotate` itself when those commands can load secret-bearing files. When a
   new CI dotenv file is required, use the [CI dotenv
   template](references/.env.ci); include the Chromatic line only
   when the project or workspace supports Chromatic.
5. **Handle rotation or recovery externally.** If validation fails, the secure
   process must warn that existing encrypted values cannot be recovered with a
   replacement key unless another valid private key or plaintext recovery source
   exists. Generate a new key only after explicit user approval, and update
   public-key sections and encrypted values through that secure process. Do not
   ask the agent to copy, inspect, or verify the resulting environment files.
6. **Accept only a non-secret result.** Continue only after the user-controlled
   process reports a non-secret result, such as success or failure, the affected
   workspace names, and any required public configuration changes. Do not ask
   for key values, decrypted values, ciphertext, or environment-file contents.
7. **Clean up agent-visible state.** Do not retain secret values because the
   agent must never receive them. Do not retain secure-process output that
   contains secrets in task notes, logs, generated artifacts, commits, or the
   final response. Do not claim that conversation context can be erased; avoid
   repeating any sensitive value if one is accidentally exposed.

## References

- [CI dotenv template](references/.env.ci)
- [dotenvx CLI introduction](https://dotenvx.com/docs/cli/introduction)
- [dotenvx keypair reference](https://dotenvx.com/docs/cli/keypair)
- [dotenvx rotation reference](https://dotenvx.com/docs/advanced/rotate-f)

Use the repository's `g:dotenv` wrapper in the user-controlled secure process
rather than assuming a globally installed binary. The agent must not invoke it
when it can access secret-bearing environment files.
