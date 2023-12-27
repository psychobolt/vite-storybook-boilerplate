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
    stdio: [process.stdin, process.stdout, process.stderr],
    ...config,
  });

/* eslint-disable-next-line @typescript-eslint/promise-function-async */
const turboCmd = (args: string[] = [], config?: SyncOptions) =>
  yarnCmd(["exec", "turbo", ...args], config);

const filters = [];
const tasks = [];

if (
  argv.includes("run") &&
  argv.findIndex((arg) => arg.startsWith("//#")) === -1
) {
  const { stdout } = await turboCmd(
    [...argv.filter((arg) => !arg.startsWith("--dry-run")), "--dry-run=json"],
    { stdio: "pipe" },
  );
  const { packages }: { packages: string[] } = JSON.parse(stdout);

  const workspaces = await getWorkspaces<Workspace[]>({
    nodeLinker: "node-modules",
  });
  for (const workspace of workspaces) {
    const name = workspace.name === "." ? "//" : workspace.name;
    if (!packages.includes(name)) continue;
    tasks.push(
      turboCmd([...argv.filter((arg) => !arg.startsWith("--filter"))], {
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

if (filters.length && argv.findIndex((arg) => arg === "--filter=!//") === -1) {
  tasks.push(turboCmd([...argv, "--filter=//"]));
}

tasks.push(turboCmd([...argv, ...filters]));

await Promise.all(tasks);
