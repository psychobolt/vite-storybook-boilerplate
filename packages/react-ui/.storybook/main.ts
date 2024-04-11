import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-vite';
import type { StorybookViteCommonConfig } from 'commons/esm/.storybook/vite-main.js';
import {
  config as commonConfig,
  getAbsolutePath
} from 'commons/esm/.storybook/vite-main.js';

const require = createRequire(import.meta.url);

export const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: getAbsolutePath('@storybook/react-vite', require),
    options: {}
  }
};

export default config;
