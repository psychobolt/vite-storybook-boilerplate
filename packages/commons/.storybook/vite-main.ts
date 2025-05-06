import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { platform } from 'node:process';
import type { StorybookConfig } from '@storybook/types';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import {
  type ResolveOptions,
  type Alias,
  defineConfig,
  mergeConfig
} from 'vite';

import postcssConfig from './postcss.config.js';

interface ResolveConfig {
  alias?: Alias[];
}

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(
  moduleId: string,
  resolveConfig: NodeJS.Require | ResolveConfig = {}
): string {
  const resolve =
    'resolve' in resolveConfig ? resolveConfig.resolve : require.resolve;
  const absolutePath = dirname(resolve(join(moduleId, 'package.json')));
  const alias = 'alias' in resolveConfig ? resolveConfig.alias : null;
  if (alias) {
    alias.push({ find: moduleId, replacement: absolutePath });
  }
  return absolutePath;
}

export const mainDir = '@(src|stories)';

export const stories = [
  `../${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`,
  `../${mainDir}/**/*.mdx`
];

const resolveConfig: ResolveOptions & ResolveConfig = {
  alias: []
};

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8'
}).trim();

export type StorybookViteCommonConfig = StorybookConfig &
  Required<Pick<StorybookConfig, 'addons'>> &
  Required<StorybookConfigVite>;

export const config: StorybookViteCommonConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-onboarding', resolveConfig),
    getAbsolutePath('@storybook/addon-links', resolveConfig),
    getAbsolutePath('@storybook/addon-essentials'),
    ...(new RegExp(`^origin/${gitBranch}$`).test(process.env.BASE_REF ?? '')
      ? []
      : [getAbsolutePath('@chromatic-com/storybook')]),
    ...(platform === 'win32'
      ? []
      : [join(getAbsolutePath('storybook-zeplin'), 'dist/register')])
  ],
  docs: {
    autodocs: 'tag'
  },
  viteFinal(config, { configType }) {
    let finalConfig = mergeConfig(
      config,
      defineConfig({
        resolve: {
          ...resolveConfig,
          conditions: [
            configType === 'DEVELOPMENT' ? 'development' : 'production',
            'browser',
            'module',
            'import',
            'default',
            'require'
          ]
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
