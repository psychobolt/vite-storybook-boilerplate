import { createRequire } from "module";
import type { Meta } from "@storybook/web-components";
import { defineConfig, mergeConfig } from "vite";
import type { StorybookViteCommonConfig } from "commons/.storybook/vite-main.ts";
import {
  config as commonConfig,
  getAbsolutePath,
  mainDir,
} from "commons/.storybook/vite-main.ts";
import {
  vitePluginStorybookVariants,
  storybookVariantsIndexer,
} from "commons/.storybook/addons/addon-variants.ts";

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
    mergeConfig(
      commonConfig.viteFinal(config, options),
      defineConfig({
        plugins: [vitePluginStorybookVariants<Meta>("lit")],
      }),
    ),
};

export default config;
