import { execaSync } from 'execa';
import type { SyncOptions } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const argv = process.argv.slice(2);
const yarnCmd = (args: string[], options?: SyncOptions) => execaSync('yarn', args, { stdio: 'inherit', ...options });
const install = (options?: SyncOptions) => yarnCmd(['install', ...argv], options);

console.log('Verifying main project dependencies....');
install();
console.log();

console.log('Verify workspaces using node-modules...');
const workspaces = await getWorkspaces({ nodeLinker: 'node-modules' });
workspaces.forEach(workspace => {
  console.log(`Verifying ${workspace.name}...`);
  install({ cwd: workspace.location });
});
console.log();

console.log('Verifying workspaces dependencies....');
yarnCmd(['workspaces', 'focus', '-A']);
console.log();
