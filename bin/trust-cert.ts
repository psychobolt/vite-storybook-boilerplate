import { spawnSync } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

const file = 'cert/dev-cert.pem';
const certificatePath = resolve(file);

const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
};

const commandExists = (command: string) =>
  spawnSync(platform() === 'win32' ? 'where.exe' : 'which', [command], {
    stdio: 'ignore'
  }).status === 0;

switch (platform()) {
  case 'darwin':
    run('sudo', [
      'security',
      'add-trusted-cert',
      '-d',
      '-r',
      'trustRoot',
      '-k',
      '/Library/Keychains/System.keychain',
      certificatePath
    ]);
    break;
  case 'win32':
    run('certutil.exe', ['-user', '-addstore', 'Root', certificatePath]);
    break;
  case 'linux':
    if (commandExists('trust')) {
      run('sudo', ['trust', 'anchor', certificatePath]);
      break;
    }

    if (commandExists('update-ca-certificates')) {
      run('sudo', [
        'install',
        '-m',
        '0644',
        certificatePath,
        '/usr/local/share/ca-certificates/storybook-dev.crt'
      ]);
      run('sudo', ['update-ca-certificates']);
      break;
    }

    throw new Error(
      `No supported Linux certificate trust command was found (expected trust or update-ca-certificates). Please refer to your OS guide on trusting ${file}.`
    );
  default:
    throw new Error(
      `Unsupported platform: ${platform()}. Please refer to your OS guide on trusting ${file}.`
    );
}

console.log(`Trusted ${certificatePath} on ${platform()}.`);
