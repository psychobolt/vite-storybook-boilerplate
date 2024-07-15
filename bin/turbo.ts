import { type ExecOptions } from 'node:child_process';
import arg from 'arg';

import { $ } from './utils/functions.ts';
import getWorkspaces from './ls-workspaces.ts';

process.env.FORCE_COLOR = '0';

let { _: argv } = arg(
  {
    '--no-color': Boolean
  },
  { permissive: true }
);

let taskArgs: string[] = [];
const start = 2;
const end = process.argv.indexOf('--');
if (end > start) {
  taskArgs = process.argv.slice(end);
  argv = argv.slice(0, end - start);
}

/* eslint-disable-next-line @typescript-eslint/promise-function-async */
const yarnCmd = (args: string[] = [], config?: ExecOptions) =>
  $(['yarn', ...args].join(' '), config);

/* eslint-disable-next-line @typescript-eslint/promise-function-async */
const turboCmd = (args: string[] = [], config?: ExecOptions) =>
  yarnCmd(['exec', 'turbo', ...args, ...taskArgs], config);

const filters = [];

if (
  argv.includes('run') &&
  argv.findIndex((arg) => arg.startsWith('//#')) === -1
) {
  const { stdout } = await turboCmd([
    ...argv.filter((arg) => !arg.startsWith('--dry-run')),
    '--dry-run=json'
  ]);
  const { packages }: { packages: string[] } = JSON.parse(stdout);

  const workspaces = await getWorkspaces<Workspace[]>({
    nodeLinker: ['pnpm', 'node-modules'],
    turboOnly: true
  });

  for await (const workspace of workspaces) {
    const name = workspace.name === '.' ? '//' : workspace.name;
    if (!packages.includes(name)) continue;
    await turboCmd([...argv.filter((arg) => !arg.startsWith('--filter'))], {
      cwd: `${process.cwd()}/${workspace.location}`,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        NODE_OPTIONS: ''
      }
    });
    filters.push(`--filter=!${workspace.name}`);
  }
}

const tasks = [];

if (filters.length && argv.findIndex((arg) => arg === '--filter=!//') === -1) {
  tasks.push(turboCmd([...argv, '--filter=//']));
}

tasks.push(turboCmd([...argv, ...filters]));

await Promise.all(tasks);
