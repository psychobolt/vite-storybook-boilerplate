import { createRequire } from "module";
import type { StorybookConfig } from "@storybook/types";
import type { StorybookConfigVite } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
import turbosnap from "vite-plugin-turbosnap";

const require = createRequire(import.meta.url);

export type StorybookViteCommonConfig = StorybookConfig & StorybookConfigVite;

const mainDir = "@(src|stories)";

const config: StorybookViteCommonConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: [
    require.resolve("@storybook/addon-links/manager"),
    require.resolve("@storybook/addon-essentials"),
    require.resolve("@storybook/addon-interactions/manager"),
    require.resolve("@storybook/addon-coverage/preset"),
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
