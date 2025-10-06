import { defineConfig } from 'eslint/config';
import commonConfig from 'commons/esm/eslint.config.js';
import storybookConfig from './.storybook/eslint.config';

const configs: ReturnType<typeof defineConfig> = defineConfig(
  commonConfig,
  storybookConfig
);

export default configs;
