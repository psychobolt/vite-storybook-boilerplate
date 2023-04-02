import { execa } from 'execa';

console.log('Installing main project dependencies....');
try {
  await execa('yarn', ['install'], { stdio: 'inherit' });
} catch (e) {
  console.log(e);
}
console.log();

console.log('Installing workspaces dependencies....');
try {
  await execa('yarn', ['workspaces', 'focus', '-A'], { stdio: 'inherit' });
} catch (e) {
  console.log(e);
}
console.log();