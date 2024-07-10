/// <reference path="./modules.d.ts" preserve="true" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import love from 'eslint-config-love';
import * as mdx from 'eslint-plugin-mdx';
import eslintConfigPrettier from 'eslint-config-prettier';
import type { CompilerOptions } from 'typescript';
import { parse } from 'tsconfck';
import tseslint from 'typescript-eslint';

export { default as tseslint } from 'typescript-eslint';

export { default as jsxRuntime } from 'eslint-plugin-react/configs/jsx-runtime.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: _filename,
  resolvePluginsRelativeTo: _dirname
});

function banImportExtension(extension: string) {
  const message = `Unexpected use of file extension (.${extension}) in import. Use without extension or with .js extension`;
  const literalAttributeMatcher = `Literal[value=/\\.${extension}$/]`;
  return [
    {
      // import foo from 'bar.js';
      selector: `ImportDeclaration > ${literalAttributeMatcher}.source`,
      message
    },
    {
      // const foo = import('bar.js');
      selector: `ImportExpression > ${literalAttributeMatcher}.source`,
      message
    },
    {
      // type Foo = typeof import('bar.js');
      selector: `TSImportType > TSLiteralType > ${literalAttributeMatcher}`,
      message
    },
    {
      // const foo = require('foo.js');
      selector: `CallExpression[callee.name = "require"] > ${literalAttributeMatcher}.arguments`,
      message
    }
  ];
}

type TSConfig = { compilerOptions: CompilerOptions };
const tsconfigParseResult = await parse(
  path.resolve(process.env.INIT_CWD ?? '.', 'eslint.config.ts')
);
const tsconfigFile = tsconfigParseResult.tsconfigFile;
const tsconfig: TSConfig = tsconfigParseResult.tsconfig;

export default tseslint.config(
  {
    ...love,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: tsconfigFile
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
  tsconfig.compilerOptions.allowImportingTsExtensions
    ? {}
    : {
        rules: {
          'no-restricted-syntax': [
            'error',
            ...banImportExtension('ts'),
            ...banImportExtension('tsx'),
            ...banImportExtension('mts')
          ]
        }
      },
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
