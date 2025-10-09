import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { platform } from 'node:process';
import type { StorybookConfig } from 'storybook/internal/types';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import { defineConfig, mergeConfig } from 'vite';

import postcssConfig from './postcss.config.js';

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(
  moduleId: string,
  resolveFn = require.resolve
): string {
  return dirname(resolveFn(join(moduleId, 'package.json')));
}

export const mainDir = '@(src|stories)';

export const stories = [
  `../${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`,
  `../${mainDir}/**/*.mdx`
];

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8'
}).trim();

const addonDocs = getAbsolutePath('@storybook/addon-docs');

export type StorybookViteCommonConfig = StorybookConfig &
  Required<Pick<StorybookConfig, 'addons'>> &
  Required<StorybookConfigVite>;

export const config: StorybookViteCommonConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-mcp'),
    addonDocs,
    ...(new RegExp(`^origin/${gitBranch}$`).test(process.env.BASE_REF ?? '')
      ? []
      : [getAbsolutePath('@chromatic-com/storybook')]),
    ...(platform === 'win32'
      ? []
      : [join(getAbsolutePath('storybook-zeplin'), 'dist/register')])
  ],
  build: {
    test: {
      disabledAddons: [addonDocs]
    }
  },
  viteFinal(config, { configType }) {
    let finalConfig = mergeConfig(
      config,
      defineConfig({
        resolve: {
          conditions: [
            configType === 'DEVELOPMENT' ? 'development' : 'production',
            'browser',
            'module',
            'import',
            'default',
            'require'
          ]
        },
        optimizeDeps: {
          include: ['@storybook/global']
        },
        css: {
          postcss: postcssConfig
        }
      })
    );

    if (configType === 'DEVELOPMENT') {
      process.env.VITE_COVERAGE = 'false';
    }

    if (configType !== 'PRODUCTION') {
      finalConfig = mergeConfig(
        finalConfig,
        defineConfig({
          server: {
            fs: {
              strict: false
            }
          }
        })
      );
    }

    return finalConfig;
  }
};
