import { createRequire } from 'module';
import path from 'path';
import type { Config } from 'stylelint';

const require = createRequire(
  process.env.INIT_CWD
    ? import.meta.url
    : path.join(process.cwd(), 'packages/third-party/node_modules')
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
