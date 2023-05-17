import type { StorybookConfig } from "@storybook/types";
import type { StorybookConfigVite } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
import turbosnap from "vite-plugin-turbosnap";

export type StorybookViteCommonConfig = StorybookConfig & StorybookConfigVite;

const mainDir = "@(src|stories)";

const config: StorybookViteCommonConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-coverage",
  ],
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins:
        configType === "PRODUCTION"
          ? [turbosnap({ rootDir: config.root ?? process.cwd() })]
          : [],
    });
  },
};

export default config;
