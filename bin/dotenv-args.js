import path from 'node:path';

const { INIT_CWD = process.cwd(), PROJECT_CWD = process.cwd() } = process.env;

const environmentFiles = Object.keys(process.env)
  .filter((name) => name.startsWith('DOTENV_PRIVATE_KEY_'))
  .map((name) => name.slice('DOTENV_PRIVATE_KEY_'.length).toLowerCase())
  .filter(Boolean)
  .sort();
const args = [
  '--ignore=MISSING_ENV_FILE',
  '--ignore=MISSING_PRIVATE_KEY',
  '-f',
  path.join(PROJECT_CWD, '.env.defaults'),
  '-f',
  path.join(PROJECT_CWD, '.env'),
  '-f',
  path.join(INIT_CWD, '.env.defaults')
];

for (const environment of environmentFiles) {
  args.push('-f', path.join(INIT_CWD, `.env.${environment}`));
}

args.push('-f', path.join(INIT_CWD, '.env'), '--overload');
console.log(args.join(' '));
