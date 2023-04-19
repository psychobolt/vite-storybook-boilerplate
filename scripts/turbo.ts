import { execa, execaSync } from 'execa';
import arg from 'arg';

import type { Workspace } from './ls-workspaces';

const { _: argv, ...options } = arg({
  '--background': Boolean
}, { permissive: true });

const cmd = async => (async ? execa: execaSync);
const yarnCmd = (async?) => (args = [], config?) => cmd(async)('yarn', args, { stdio: 'inherit', ...config });
const turboCmd = (args = [], config?) => yarnCmd(options['--background'])(['turbo', ...argv, '--no-color', ...args], config);

const { stdout } = await yarnCmd()(['ls-workspaces', '--node-modules'], { stdio: 'pipe' });
const workspaces: Workspace[] = JSON.parse(stdout);

const filters = [];
workspaces.forEach(async workspace => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NODE_OPTIONS: ''
  } ;
  turboCmd([], { stdio: 'inherit', cwd: `${process.cwd()}/${workspace.location}`, env });
  filters.push(`--filter=!${workspace.name}`);
});

turboCmd(filters);