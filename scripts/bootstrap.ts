import { execaSync } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const yarnCmd = (args, options?) => execaSync('yarn', args, { stdio: 'inherit', ...options });

console.log('Verifying main project dependencies....');
yarnCmd(['install']);
console.log();

console.log('Verifying workspaces dependencies....');
yarnCmd(['workspaces', 'focus', '-A']);
console.log();

console.log('Verify workspaces using node-modules...');
const workspaces = await getWorkspaces({ nodeLinker: 'node-modules' });
workspaces.forEach(workspace => {
  console.log(`Verifying ${workspace.name}...`);
  yarnCmd(['install'], { cwd: workspace.location });
});