import { createRequire } from 'node:module';
import path from 'node:path';
import type { Config } from 'stylelint';

const require = createRequire(
  process.env.INIT_CWD
    ? import.meta.url
    : path.join(process.cwd(), 'packages/unplugged/node_modules')
);

const config: Config = {
  extends: [
    require.resolve('stylelint-config-standard-scss'),
    require.resolve('stylelint-config-prettier-scss')
  ],
  allowEmptyInput: true
};

export default config;
// @ts-expect-error: allow for CommonJS target
export = config;
