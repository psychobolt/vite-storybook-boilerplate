const { INIT_CWD = process.cwd(), PROJECT_CWD = process.cwd() } = process.env;

const file = (directory, name) => `${directory}/${name}`;
const environmentFiles = Object.keys(process.env)
  .filter((name) => name.startsWith('DOTENV_PRIVATE_KEY_'))
  .map((name) => name.slice('DOTENV_PRIVATE_KEY_'.length).toLowerCase())
  .filter(Boolean)
  .sort();
const args = [
  '--ignore=MISSING_ENV_FILE',
  '--ignore=MISSING_PRIVATE_KEY',
  '-f',
  file(PROJECT_CWD, '.env.defaults'),
  '-f',
  file(PROJECT_CWD, '.env'),
  '-f',
  file(INIT_CWD, '.env.defaults')
];

for (const environment of environmentFiles) {
  args.push('-f', file(INIT_CWD, `.env.${environment}`));
}

args.push('-f', file(INIT_CWD, '.env'), '--overload');
console.log(args.join(' '));
