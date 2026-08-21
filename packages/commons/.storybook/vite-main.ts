import {
  type ExecSyncOptionsWithStringEncoding,
  execSync
} from 'node:child_process';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
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

import getWorkspaces from '../bin/ls-workspaces.ts';
import { getDependentTasks } from '../bin/utils/functions.ts';
import postcssConfig from './postcss.config.ts';
import {
  storybookVariantsIndexer,
  vitePluginStorybookVariants
} from './addons/addon-variants.ts';
import type { ExtractPlainObject } from './types.ts';

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

const includes = (await getDependentTasks('build', { cwd: process.cwd() })).map(
  (task) => task.directory
);
const storybookPackages = await getWorkspaces({
  storybook: true,
  include: includes
});

const execOptions: ExecSyncOptionsWithStringEncoding = { encoding: 'utf8' };
const getGitRevision = (args: string[] = []) =>
  execSync(`git rev-parse ${[...args, 'HEAD'].join(' ')}`, execOptions).trim();
const gitBranch = getGitRevision(['--abbrev-ref']);
const gitHash = getGitRevision(['--short']);

const addonDocs = getAbsolutePath('@storybook/addon-docs');

type Core = Pick<StorybookConfig, 'core'>['core'];
type CoreConfig = Omit<NonNullable<Exclude<Core, Function>>, 'builder'>;
type Refs = ExtractPlainObject<StorybookConfig['refs']>;

export type StorybookViteCommonConfig = Omit<StorybookConfig, 'core'> &
  Required<Pick<StorybookConfig, 'addons'>> & {
    core?: CoreConfig | Exclude<Core, CoreConfig>;
  } & Required<StorybookConfigVite>;

export default {
  stories: [...stories, `../${mainDir}/**/*.mdx`],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding', resolveConfig),
    getAbsolutePath('@storybook/addon-links', resolveConfig),
    addonDocs,
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
  refs: (_, { configType }) =>
    storybookPackages.reduce<Refs>((refs, { name, path }) => {
      const config = require(join(path, 'chromatic.config.json'));
      const [, appId] = config.projectId?.split(':') ?? [];
      const localhost = execSync(`yarn g:dotenv-get SB_URL`, {
        ...execOptions,
        cwd: path
      }).trim();
      const url =
        gitHash && appId && configType === 'PRODUCTION'
          ? `https://${gitHash}--${appId}.chromatic.com`
          : localhost;
      if (!url) return refs;
      return {
        ...refs,
        [name]: {
          title: name,
          url,
          expanded: false
        }
      };
    }, {}),
  viteFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      process.env.VITE_COVERAGE = 'false';
    }

    let finalConfig = mergeConfig(
      config,
      defineConfig({
        plugins: [vitePluginStorybookVariants()],
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
          minify: false,
          cssMinify: configType !== 'DEVELOPMENT',
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
