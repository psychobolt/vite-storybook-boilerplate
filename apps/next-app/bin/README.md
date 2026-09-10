# Bin

Collection of scripts for Next app development and server workflows.

## Start Server

`start.ts` ([Source](start.ts))

Starts the production Next server over HTTPS and waits for it to listen.

```sh
yarn run-script bin/start.ts
```

Uses these non-secret environment values:

| Variable          | Default                     |
| ----------------- | --------------------------- |
| `PORT`            | `3000`                      |
| `APP_URL`         | `https://localhost:${PORT}` |
| `HTTPS_CERT_PATH` | `../../cert/dev-cert.pem`   |
| `HTTPS_KEY_PATH`  | `../../cert/dev-key.pem`    |
