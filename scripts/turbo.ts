import { execa } from "execa";
import type { SyncOptions } from "execa";
import arg from "arg";

import getWorkspaces from "./ls-workspaces.ts";

process.env.FORCE_COLOR = "0";

const { _: argv } = arg(
  {
    "--no-color": Boolean,
  },
  { permissive: true },
);

/* eslint-disable-next-line @typescript-eslint/promise-function-async */
const yarnCmd = (args: string[] = [], config?: SyncOptions) =>
  execa("yarn", args, {
    stdio: "inherit",
    ...config,
  });

/* eslint-disable-next-line @typescript-eslint/promise-function-async */
const turboCmd = (args: string[] = [], config?: SyncOptions) =>
  yarnCmd(["exec", "turbo", ...args], config);

const filters = [];
const tasks = [];

if (
  !argv.includes("link") &&
  !argv.includes("login") &&
  argv.findIndex((arg) => arg.startsWith("//#")) === -1
) {
  const { stdout } = await turboCmd(
    [...argv.filter((arg) => !arg.startsWith("--dry-run")), "--dry-run=json"],
    { stdio: "pipe" },
  );
  const { packages }: { packages: string[] } = JSON.parse(stdout);

  const workspaces = await getWorkspaces({ nodeLinker: "node-modules" });
  for (const workspace of workspaces) {
    if (!packages.includes(workspace.name)) continue;
    tasks.push(
      turboCmd([...argv.filter((arg) => !arg.startsWith("--filter"))], {
        stdio: "inherit",
        cwd: `${process.cwd()}/${workspace.location}`,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          NODE_OPTIONS: "",
        },
      }),
    );
    filters.push(`--filter=!${workspace.name}`);
  }
}

tasks.push(turboCmd([...argv, ...filters]));

await Promise.all(tasks);
