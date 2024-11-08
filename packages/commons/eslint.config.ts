/// <reference path="./modules.d.ts" preserve="true" />
import * as mdx from 'eslint-plugin-mdx';
import neostandard from 'neostandard';
import tseslint from 'typescript-eslint';

export { default as tseslint } from 'typescript-eslint';
const tsFiles = ['**/*.{ts,tsx}'];

export default tseslint.config(
  ...neostandard({
    files: ['**/*.{cj,j}s', '**/*.jsx'],
    filesTs: tsFiles,
    noStyle: true,
    ts: true
  }),
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: process.env.PROJECT_CWD,
        warnOnUnsupportedTypeScriptVersion: false
      }
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableBoolean: true,
          allowNullableString: true,
          allowAny: true
        }
      ]
    }
  },
  mdx.flat,
  mdx.flatCodeBlocks,
  {
    ignores: [
      '.turbo/',
      '.yarn/**/*',
      '!.yarn/plugins/*',
      'dist/',
      'esm/',
      'cjs/',
      'coverage/',
      'node_modules/',
      'storybook-static/',
      'temp/',
      'tmp/',
      '.temp/',
      '.tmp',
      '.pnp.cjs',
      '.pnp.loader.mjs',
      'vite.config.*.timestamp-*'
    ]
  }
);
