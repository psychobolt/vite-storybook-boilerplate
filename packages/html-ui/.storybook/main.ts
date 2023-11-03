import { createRequire } from "module";
import type { StorybookConfig } from "@storybook/web-components-vite";
import type { StorybookViteCommonConfig } from "commons/.storybook/vite-main";
import {
  config as commonConfig,
  getAbsolutePath,
} from "commons/.storybook/vite-main";

const require = createRequire(import.meta.url);

const config: StorybookConfig | StorybookViteCommonConfig = {
  ...commonConfig,
  framework: {
    name: getAbsolutePath("@storybook/web-components-vite", require),
    options: {},
  },
};

export default config;
