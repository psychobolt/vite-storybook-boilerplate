import { createRequire } from 'node:module';
import type { Meta } from '@storybook/web-components';
import { mergeConfig } from 'vite';
import type { StorybookViteCommonConfig } from 'commons/esm/.storybook/vite-main';
import {
  config as commonConfig,
  stories,
  getAbsolutePath,
  mainDir
} from 'commons/esm/.storybook/vite-main';
import { storybookVariantsIndexer } from 'commons/esm/.storybook/addons/addon-variants';

import viteConfig from './vite.config';

const require = createRequire(import.meta.url);

const config: StorybookViteCommonConfig = {
  ...commonConfig,
  addons: [
    ...commonConfig.addons,
    getAbsolutePath('@storybook/addon-interactions', require),
    getAbsolutePath('@storybook/addon-coverage', require)
  ],
  stories: [...stories, `../${mainDir}/**/*.variant{s,}.@(js|jsx|ts|tsx)`],
  framework: {
    name: getAbsolutePath('@storybook/web-components-vite', require),
    options: {}
  },
  experimental_indexers: (existingIndexers = []) => [
    ...existingIndexers,
    storybookVariantsIndexer<Meta>()
  ],
  viteFinal: (config, options) =>
    mergeConfig(commonConfig.viteFinal(config, options), viteConfig)
};

export default config;
