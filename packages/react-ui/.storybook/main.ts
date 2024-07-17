import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import type { StorybookViteCommonConfig } from 'commons/esm/.storybook/vite-main';
import {
  config as commonConfig,
  getAbsolutePath
} from 'commons/esm/.storybook/vite-main';

import viteConfig from './vite.config.ts';

const require = createRequire(import.meta.url);

export const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: getAbsolutePath('@storybook/react-vite', require),
    options: {}
  },
  viteFinal: (config, options) =>
    mergeConfig(commonConfig.viteFinal(config, options), viteConfig)
};

export default config;
