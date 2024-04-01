import { createRequire } from 'module';
import path from 'path';

const require = createRequire(
  process.env.INIT_CWD ??
    path.join(process.cwd(), 'packages/third-party/node_modules')
);

/** @type {import('stylelint').Config} */
export default {
  extends: [require.resolve('commons/esm/stylelint.config')],
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(--?[a-z0-9]+)*$',
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be kebab-case`
      }
    ]
  }
};
