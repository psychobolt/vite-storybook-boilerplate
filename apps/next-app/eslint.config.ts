import { resolve } from 'node:path';
import { defineConfig, globalIgnores, includeIgnoreFile } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const eslintConfig = defineConfig(
  nextVitals,
  typescript,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        warnOnUnsupportedTypeScriptVersion: false
      }
    }
  },
  {
    settings: {
      react: { version: '19' } // Avoids auto-detection crash. See https://github.com/vercel/next.js/issues/89764
    }
  },
  includeIgnoreFile(
    [
      resolve(import.meta.dirname, '../../.gitignore'),
      resolve(import.meta.dirname, '.gitignore')
    ],
    { gitignoreResolution: true }
  ),
  globalIgnores([
    '.next/**',
    '.vinext/**',
    '.wrangler/**',
    'dist/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
);

export default eslintConfig;
