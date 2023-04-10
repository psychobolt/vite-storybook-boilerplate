import { execa } from 'execa';

console.log('Verifying main project dependencies....');
await execa('yarn', ['install'], { stdio: 'inherit' });
console.log();

console.log('Verifying workspaces dependencies....');
await execa('yarn', ['workspaces', 'focus', '-A'], { stdio: 'inherit' });
console.log();