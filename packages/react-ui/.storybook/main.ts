import { createRequire } from "module";
import type { StorybookConfig } from "@storybook/react-vite";
import type { StorybookViteCommonConfig } from "commons/.storybook/vite-main";
import {
  config as commonConfig,
  getAbsolutePath,
} from "commons/.storybook/vite-main";

const require = createRequire(import.meta.url);

export const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: getAbsolutePath("@storybook/react-vite", require),
    options: {},
  },
};

export default config;
