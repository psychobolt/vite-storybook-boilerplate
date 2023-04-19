import { execaSync } from 'execa';
import type { Workspace } from './ls-workspaces';

const yarnCmd = (args, options?) => execaSync('yarn', args, { stdio: 'inherit', ...options });

console.log('Verifying main project dependencies....');
yarnCmd(['install']);
console.log();

console.log('Verifying workspaces dependencies....');
yarnCmd(['workspaces', 'focus', '-A']);
console.log();

console.log('Verify workspaces using node-modules...')
const { stdout } = await yarnCmd(['ls-workspaces', '--node-modules'], { stdio: 'pipe' });
if (stdout !== '[]') {
  const workspaces: Workspace[] = JSON.parse(stdout);
  workspaces.forEach(workspace => {
    console.log(`Verifying ${workspace.name}...`);
    yarnCmd(['install'], { cwd: workspace.location });
  });
}