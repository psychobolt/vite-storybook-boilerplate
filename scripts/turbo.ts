import { execa, execaSync } from 'execa';
import arg from 'arg';

import getWorkspaces from './ls-workspaces.ts';

const { _: argv, ...options } = arg({
  '--background': Boolean
}, { permissive: true });

const cmd = async => (async ? execa: execaSync);
const yarnCmd = (async?) => (args = [], config?) => cmd(async)('yarn', args, { stdio: 'inherit', ...config });
const turboCmd = (args = [], config?) => yarnCmd(options['--background'])(['exec', 'turbo', ...argv, '--no-color', ...args], config);

const workspaces = await getWorkspaces({ nodeLinker: 'node-modules' });
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