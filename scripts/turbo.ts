import { execa, execaSync } from "execa";
import type { SyncOptions } from "execa";
import arg from "arg";

import getWorkspaces from "./ls-workspaces.ts";

const { _: argv, ...options } = arg(
  {
    "--background": Boolean,
    "--no-color": Boolean,
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
    ["exec", "turbo", ...args, "--no-color"],
    config,
  );

const filters = [];

if (!argv.includes("link") && !argv.includes("login")) {
  const { stdout } = await turboCmd(
    [...argv.filter((arg) => !arg.startsWith("--dry-run")), "--dry-run=json"],
    { stdio: "pipe" },
  );
  const { packages }: { packages: string[] } = JSON.parse(stdout);

  const workspaces = await getWorkspaces({ nodeLinker: "node-modules" });
  for (const workspace of workspaces) {
    if (!packages.includes(workspace.name)) continue;
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NODE_OPTIONS: "",
    };
    await turboCmd([...argv.filter((arg) => !arg.startsWith("--filter"))], {
      stdio: "inherit",
      cwd: `${process.cwd()}/${workspace.location}`,
      env,
    });
    filters.push(`--filter=!${workspace.name}`);
  }
}

await turboCmd([...argv, ...filters]);
