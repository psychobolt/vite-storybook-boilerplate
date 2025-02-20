import type { Config } from 'lint-staged';

const config: Config = {
  '*': (filenames) => `yarn format -- ${filenames.join(' ')}`
};

export default config;
