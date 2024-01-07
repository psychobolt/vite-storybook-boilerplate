#!/usr/bin/env node

import { execSync, spawn } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export default function run(args) {
  if (!process.env.NPM_SCRIPT) {
    process.chdir(dirname(fileURLToPath(import.meta.url)));
  }

  const nodeOptions = execSync("yarn node -p process.env.NODE_OPTIONS")
    .toString()
    .slice(0, -1)
    .replace("--experimental-loader", "--loader");

  const tsNodePath = `file://${execSync("yarn g:ts-node-path")
    .toString()
    .slice(0, -1)}`;

  // IPC is blocked for `yarn node` therefore loader must resolve to a real path (unplugged)
  // https://github.com/yarnpkg/berry/issues/1696
  const child = spawn("node", args, {
    env: {
      ...process.env,
      NODE_OPTIONS: `--loader ${tsNodePath} ${nodeOptions}`,
    },
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  }).on("message", (data) => {
    if (process.send !== undefined) {
      process.send(data);
    }
  });

  process.on("message", (data) => {
    child.send(data);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2));
}
