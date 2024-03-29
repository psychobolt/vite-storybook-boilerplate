import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import * as mdx from 'eslint-plugin-mdx';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export { default as tseslint } from 'typescript-eslint';

export { default as jsxRuntime } from 'eslint-plugin-react/configs/jsx-runtime.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: _filename,
  resolvePluginsRelativeTo: _dirname
});

export default tseslint.config(
  {
    files: ['**/*.{ts,tsx}'],
    extends: compat.extends('love'),
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: process.env.INIT_CWD,
        project: './tsconfig.json'
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
  {
    files: ['**/*.{cj,j}s'],
    extends: compat.extends('standard')
  },
  {
    files: ['**/*.jsx'],
    extends: [
      ...compat.extends('standard-jsx'),
      ...compat.extends('standard-react')
    ]
  },
  mdx.flat,
  mdx.flatCodeBlocks,
  eslintConfigPrettier,
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
      '.pnp.cjs',
      '.pnp.loader.mjs',
      'vite.config.*.timestamp-*'
    ]
  }
);
