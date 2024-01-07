import { createRequire } from "module";
import type { Meta } from "@storybook/web-components";
import { mergeConfig } from "vite";
import type { StorybookViteCommonConfig } from "commons/esm/.storybook/vite-main.js";
import {
  config as commonConfig,
  getAbsolutePath,
  mainDir,
} from "commons/esm/.storybook/vite-main.ts";
import { storybookVariantsIndexer } from "commons/esm/.storybook/addons/addon-variants.js";

import viteConfig from "./vite.config.ts";

const require = createRequire(import.meta.url);

const config: StorybookViteCommonConfig = {
  ...commonConfig,
  stories: [
    ...commonConfig.stories,
    `../${mainDir}/**/*.variant{s,}.@(js|jsx|ts|tsx)`,
  ],
  framework: {
    name: getAbsolutePath("@storybook/web-components-vite", require),
    options: {},
  },
  experimental_indexers: (existingIndexers) => [
    ...existingIndexers,
    storybookVariantsIndexer<Meta>(),
  ],
  viteFinal: (config, options) =>
    mergeConfig(commonConfig.viteFinal(config, options), viteConfig),
};

export default config;
