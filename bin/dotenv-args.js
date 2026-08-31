import { existsSync } from 'node:fs';

const {
  DOTENV_PRIVATE_KEY_CI,
  INIT_CWD = process.cwd(),
  PROJECT_CWD = process.cwd()
} = process.env;

const file = (directory, name) => `${directory}/${name}`;
const envKeysFile = file(PROJECT_CWD, '.env.keys');
const args = [
  '--ignore=MISSING_ENV_FILE',
  '--ignore=MISSING_PRIVATE_KEY',
  '-fk',
  PROJECT_CWD,
  '-f',
  file(PROJECT_CWD, '.env.defaults'),
  '-f',
  file(PROJECT_CWD, '.env'),
  '-f',
  file(INIT_CWD, '.env.defaults')
];

if (DOTENV_PRIVATE_KEY_CI || existsSync(envKeysFile)) {
  args.push('-f', file(INIT_CWD, '.env.ci'));
}

args.push('-f', file(INIT_CWD, '.env'), '--overload');
console.log(args.join(' '));
