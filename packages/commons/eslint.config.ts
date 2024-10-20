/// <reference path="./modules.d.ts" preserve="true" />
import path from 'node:path';
import * as mdx from 'eslint-plugin-mdx';
import eslintConfigPrettier from 'eslint-config-prettier';
import neostandard from 'neostandard';
import type { CompilerOptions } from 'typescript';
import { parse } from 'tsconfck';
import tseslint from 'typescript-eslint';

export { default as tseslint } from 'typescript-eslint';

export { default as jsxRuntime } from 'eslint-plugin-react/configs/jsx-runtime.js';

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
const tsconfigParseResult = await parse(path.resolve('eslint.config.ts'));
const tsconfig: TSConfig = tsconfigParseResult.tsconfig;
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
