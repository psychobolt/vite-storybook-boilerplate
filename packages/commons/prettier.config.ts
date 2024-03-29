import type { Options } from 'prettier';
import standardConfig from 'prettier-config-standard' assert { type: 'json' };

export type Config = Options;

const config: Options = {
  ...standardConfig,
  semi: true
};

export default config;
