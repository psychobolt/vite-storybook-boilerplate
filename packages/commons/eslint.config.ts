import path from 'path';
import { fileURLToPath } from 'url';
import type { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';

type Config = Linter.FlatConfig;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __filename,
  resolvePluginsRelativeTo: __dirname
});

const tsConfig: Config[] = [
  ...compat.extends('standard-with-typescript'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.env.INIT_CWD,
        project: './tsconfig.json',
      }
    },
    rules: {
      '@typescript-eslint/semi': ['error', 'always'],
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/strict-boolean-expressions': ['error', { 
        allowNullableBoolean: true,
        allowNullableString: true,
        allowAny: true,
      }]
    }
  },
  {
    rules: {
      semi: ['error', 'always']
    }
  },
  {
    ignores: [
      '.turbo/',
      '.yarn/',
      'dist/',
      'node_modules/',
      'storybook-static/',
      '.pnp.cjs',
      '.pnp.loader.mjs'
    ]
  }
]

const config = [
  ...tsConfig
];

export default config
