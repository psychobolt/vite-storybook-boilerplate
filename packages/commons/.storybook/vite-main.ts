import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { StorybookConfig } from 'storybook/internal/types';
import type { StorybookConfigVite } from '@storybook/builder-vite';
import {
  type CompareResult,
  configureSort as _configureSort
} from 'storybook-multilevel-sort';
import {
  type ResolveOptions,
  type Alias,
  defineConfig,
  mergeConfig
} from 'vite';

import postcssConfig from './postcss.config.js';
import {
  storybookVariantsIndexer,
  vitePluginStorybookVariants
} from './addons/addon-variants.js';

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

export const configureSort: typeof _configureSort = (config) =>
  _configureSort({
    compareNames(name1, name2, context) {
      if (context.path1.pop() === name1 && context.path2.pop() === name2) {
        return 0;
      }
      return name1.localeCompare(name2, undefined, {
        numeric: true
      }) as CompareResult;
    },
    typeOrder: [],
    ...config
  });

export const mainDir = '@(src|stories)';

export const stories = [
  `../${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`,
  `../${mainDir}/**/*.variant{s,}.@(js|jsx|ts|tsx)`
];

const resolveConfig: ResolveOptions & ResolveConfig = {
  alias: [
    {
      find: '@storybook/global',
      replacement: require.resolve('@storybook/global')
    }
  ]
};

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8'
}).trim();

type Core = Pick<StorybookConfig, 'core'>['core'];
type CoreConfig = Omit<NonNullable<Exclude<Core, Function>>, 'builder'>;

export type StorybookViteCommonConfig = Omit<StorybookConfig, 'core'> &
  Required<Pick<StorybookConfig, 'addons'>> & {
    core?: CoreConfig | Exclude<Core, CoreConfig>;
  } & Required<StorybookConfigVite>;

export default {
  stories: [...stories, `../${mainDir}/**/*.mdx`],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links', resolveConfig),
    getAbsolutePath('@storybook/addon-docs'),
    ...(new RegExp(`^origin/${gitBranch}$`).test(process.env.BASE_REF ?? '')
      ? []
      : [getAbsolutePath('@chromatic-com/storybook')]),
    getAbsolutePath('storybook-zeplin')
  ],
  experimental_indexers: (existingIndexers = []) => [
    ...existingIndexers,
    storybookVariantsIndexer()
  ],
  build: {
    test: {
      disableAutoDocs: true
    }
  },
  viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      process.env.VITE_COVERAGE = 'false';
    }

    if (config.resolve?.tsconfigPaths) {
      // Workaround since Vite's resolver doesn't know about '.' paths
      resolveConfig.alias?.push({
        find: '.storybook/',
        replacement: fileURLToPath(new URL('./', import.meta.url))
      });
    }

    let finalConfig = mergeConfig(
      config,
      defineConfig({
        plugins: [
          // See issue: https://github.com/vitest-dev/vitest/issues/8572
          config.resolve?.tsconfigPaths
            ? null
            : tsconfigPaths({ root: process.cwd() }),
          vitePluginStorybookVariants()
        ],
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
        optimizeDeps: {
          include: ['@storybook/global']
        },
        css: {
          postcss: postcssConfig
        },
        build: {
          rolldownOptions: {
            checks: {
              // TODO optimize build
              invalidAnnotation: process.env.VITE_COVERAGE === 'false'
            }
          }
        }
      })
    );

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
} satisfies StorybookViteCommonConfig;
