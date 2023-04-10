import type { StorybookConfig } from "@storybook/html-vite";
import type { StorybookViteCommonConfig } from 'commons/.storybook/vite-main';
import commonConfig from 'commons/.storybook/vite-main';

const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
};

export default config;
