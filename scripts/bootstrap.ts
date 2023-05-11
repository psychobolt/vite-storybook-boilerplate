import { execaSync } from 'execa';
import type { SyncOptions } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const argv = process.argv.slice(2);
const yarnCmd = (args: string[], options?: SyncOptions) => execaSync('yarn', args, { stdio: 'inherit', ...options });
const install = (options?: SyncOptions) => yarnCmd(['install', ...argv], options);

const workspaces = await getWorkspaces({ nodeLinker: 'node-modules' });
if (workspaces.length) {
  console.log('Verify workspaces using node-modules...');
  workspaces.forEach(workspace => {
    console.log(`Verifying ${workspace.name}...`);
    install({ cwd: workspace.location });
  });
}
