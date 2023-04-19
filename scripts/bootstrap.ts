import { execa } from 'execa';
import type { Workspace } from './ls-workspaces';

const yarnCmd = (args, options?) => execa('yarn', args, { stdio: 'inherit', ...options });

console.log('Verifying main project dependencies....');
await yarnCmd(['install']);
console.log();

console.log('Verifying workspaces dependencies....');
await yarnCmd(['workspaces', 'focus', '-A']);
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