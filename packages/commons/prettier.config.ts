import { createRequire } from 'node:module';
import _ from 'lodash';
import type { Config as _Config } from 'prettier';
import standardConfig from 'prettier-config-standard' assert { type: 'json' };

const require = createRequire(import.meta.url);

export type Config = _Config;

const config: Config = _.merge<Config, Config, Config>({}, standardConfig, {
  plugins: [require.resolve('prettier-plugin-sh')],
  semi: true,
  overrides: [
    {
      files: ['.*', '*.sh'],
      excludeFiles: ['.*.yml'],
      options: {
        parser: 'sh'
      }
    }
  ]
});

export default config;
