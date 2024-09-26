import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { platform } from 'node:process';
import type { StorybookConfig } from '@storybook/types';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import type { ResolveOptions } from 'vite';
import { defineConfig, mergeConfig } from 'vite';

import postcssConfig from './postcss.config.mjs';

type AliasOptions = Record<string, string>;

interface ResolveConfig {
  alias?: AliasOptions;
}

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(
  moduleId: string,
  resolveConfig: NodeRequire | ResolveConfig = {}
): string {
  const resolve =
    'resolve' in resolveConfig ? resolveConfig.resolve : require.resolve;
  const absolutePath = dirname(resolve(join(moduleId, 'package.json')));
  const alias = 'alias' in resolveConfig ? resolveConfig.alias : null;
  if (alias) {
    alias[moduleId] = absolutePath;
  }
  return absolutePath;
}

export const mainDir = '@(src|stories)';

export const stories = [
  `../${mainDir}/**/*.mdx`,
  `../${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`
];

export type StorybookViteCommonConfig = StorybookConfig &
  Required<StorybookConfigVite>;

const resolveConfig: ResolveOptions & ResolveConfig = {
  alias: {}
};

export const config: StorybookViteCommonConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-links', resolveConfig),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions', resolveConfig),
    getAbsolutePath('@storybook/addon-coverage'),
    getAbsolutePath('@chromatic-com/storybook'),
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
