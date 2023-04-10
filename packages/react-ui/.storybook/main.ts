import type { StorybookConfig } from "@storybook/react-vite";
import type { StorybookViteCommonConfig } from 'commons/.storybook/vite-main';
import commonConfig from 'commons/.storybook/vite-main';

export const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: "@storybook/react-vite",
    options: {},
  }
};

export default config;
