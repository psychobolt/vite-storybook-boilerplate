import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  defineConfig,
  globalIgnores,
  includeIgnoreFile as _includeIgnoreFile
} from 'eslint/config';
import * as mdx from 'eslint-plugin-mdx';
import json from 'eslint-plugin-jsonc';
import packageJson from 'eslint-plugin-package-json';
import neostandard from 'neostandard';

const gitignoreUrl = import.meta.resolve('commons/.gitignore');
const jsFiles = ['**/*.{js,jsx,cjs,mjs}'];
const tsFiles = ['**/*.{ts,tsx}'];
const tsCodeBlocks = ['**/*.{md,mdx}'].map(
  (pattern) => `${pattern}/*.{ts,tsx}`
);

function includeIgnoreFile(path: string) {
  return existsSync(path)
    ? _includeIgnoreFile(path, { gitignoreResolution: true })
    : [];
}

export default defineConfig(
  neostandard({
    files: jsFiles,
    ignores: ['!**/*.md/**'],
    noStyle: true,
    ts: true
  }),
  {
    files: tsFiles,
    ignores: tsCodeBlocks, // project service does not support virtual files
    languageOptions: {
      parserOptions: {
        projectService: true,
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
    files: [...jsFiles, ...tsFiles, ...tsCodeBlocks],
    rules: {
      yoda: ['error', 'never', { exceptRange: true }]
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
  json.configs['recommended-with-json'],
  json.configs['recommended-with-jsonc'],
  json.configs['recommended-with-json5'],
  {
    files: ['**/tsconfig.json', '**/tsconfig.*.json'],
    plugins: {
      jsonc: json
    },
    rules: {
      'jsonc/no-comments': 0
    }
  },
  json.configs.prettier,
  packageJson.configs.recommended,
  {
    settings: {
      packageJson: {
        enforceForPrivate: false
      }
    }
  },
  includeIgnoreFile(fileURLToPath(new URL('../../.gitignore', gitignoreUrl))),
  includeIgnoreFile(fileURLToPath(gitignoreUrl)),
  includeIgnoreFile(join(process.cwd(), '.gitignore')),
  globalIgnores(['.github/**/*.md', '.yarn/**/*', '!.yarn/plugins/*'])
);
