/// <reference path="./modules.d.ts" preserve="true" />
import { defineConfig } from 'eslint/config';
import * as mdx from 'eslint-plugin-mdx';
import neostandard from 'neostandard';

const tsFiles = ['**/*.{ts,tsx}'];
const tsCodeBlocks = ['**/*.md'].map((pattern) => `${pattern}/*.ts`);

export default defineConfig(
  ...neostandard({
    files: ['**/*.{cj,j}s', '**/*.jsx'],
    noStyle: true,
    ts: true
  }),
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        warnOnUnsupportedTypeScriptVersion: false
      }
    }
  },
  {
    files: tsFiles,
    ignores: tsCodeBlocks,
    languageOptions: {
      parserOptions: {
        projectService: true
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
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true
    }),
    plugins: {
      mdx
    }
  },
  mdx.flatCodeBlocks,
  {
    ignores: [
      '.github/**/*.md',
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
