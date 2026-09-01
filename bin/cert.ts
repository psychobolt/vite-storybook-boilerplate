import { spawnSync } from 'node:child_process';
import { X509Certificate } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { platform } from 'node:os';
import { resolve } from 'node:path';
import arg from 'arg';

const options = arg({
  '--install': Boolean,
  '--remove': Boolean
});
const certificateName = options._[0] ?? 'dev-cert';
const installing = options['--install'];
const removing = options['--remove'];

if (
  installing === removing ||
  options._.length > 1 ||
  !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(certificateName)
) {
  throw new Error(
    'Usage: yarn cert --install [name] | yarn cert --remove [name]'
  );
}

const file = `cert/${certificateName}.pem`;
const certificatePath = resolve(file);
const certificateId = new X509Certificate(
  readFileSync(certificatePath)
).fingerprint.replaceAll(':', '');

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
      installing ? 'add-trusted-cert' : 'delete-certificate',
      ...(installing
        ? [
            '-d',
            '-r',
            'trustRoot',
            '-k',
            '/Library/Keychains/System.keychain',
            certificatePath
          ]
        : ['-Z', certificateId, '/Library/Keychains/System.keychain'])
    ]);
    break;
  case 'win32':
    run('certutil.exe', [
      '-user',
      installing ? '-addstore' : '-delstore',
      'Root',
      installing ? certificatePath : certificateId
    ]);
    break;
  case 'linux':
    if (commandExists('trust')) {
      run('sudo', [
        'trust',
        'anchor',
        ...(installing ? ['--store'] : ['--remove']),
        certificatePath
      ]);
      break;
    }

    if (commandExists('update-ca-certificates')) {
      const installedCertificatePath = `/usr/local/share/ca-certificates/${certificateName}.crt`;

      if (installing) {
        run('sudo', [
          'install',
          '-m',
          '0644',
          certificatePath,
          installedCertificatePath
        ]);
      } else {
        run('sudo', ['rm', '-f', installedCertificatePath]);
      }

      run('sudo', ['update-ca-certificates']);
      break;
    }

    throw new Error(
      `No supported Linux certificate trust command was found (expected trust or update-ca-certificates). Please refer to your OS guide on ${installing ? 'trusting' : 'removing'} ${file}.`
    );
  default:
    throw new Error(
      `Unsupported platform: ${platform()}. Please refer to your OS guide on ${installing ? 'trusting' : 'removing'} ${file}.`
    );
}

console.log(
  `${installing ? 'Trusted' : 'Removed'} ${certificatePath} ${installing ? `on ${platform()}` : `from ${platform()}`}.`
);
