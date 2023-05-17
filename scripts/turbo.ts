import { execa, execaSync } from "execa";
import type { SyncOptions } from "execa";
import arg from "arg";

import getWorkspaces from "./ls-workspaces.ts";

const { _: argv, ...options } = arg(
  {
    "--background": Boolean,
  },
  { permissive: true },
);

const cmd = (async?: boolean) => (async ? execa : execaSync);
const yarnCmd =
  (async?: boolean) =>
  async (args: string[] = [], config?: SyncOptions) =>
    await cmd(async)("yarn", args, { stdio: "inherit", ...config });
const turboCmd = async (args: string[] = [], config?: SyncOptions) =>
  await yarnCmd(options["--background"])(
    ["exec", "turbo", ...argv, "--no-color", ...args],
    config,
  );

const workspaces = await getWorkspaces({ nodeLinker: "node-modules" });
const filters = [];
for (const workspace of workspaces) {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NODE_OPTIONS: "",
  };
  await turboCmd([], {
    stdio: "inherit",
    cwd: `${process.cwd()}/${workspace.location}`,
    env,
  });
  filters.push(`--filter=!${workspace.name}`);
}

await turboCmd(filters);
