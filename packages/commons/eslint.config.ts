/// <reference path="./modules.d.ts" preserve="true" />
import { defineConfig } from 'eslint/config';
import * as mdx from 'eslint-plugin-mdx';
import neostandard from 'neostandard';

const tsFiles = ['**/*.{ts,tsx}'];

export default defineConfig(
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
    ...mdx.flat,
    plugins: {
      mdx
    }
  },
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
