import { join, dirname } from "path";
import type { StorybookConfig } from "@storybook/types";
import type { StorybookConfigVite } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
import turbosnap from "vite-plugin-turbosnap";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(value: string, { resolve } = require): any {
  return dirname(resolve(join(value, "package.json")));
}

export type StorybookViteCommonConfig = StorybookConfig & StorybookConfigVite;

const mainDir = "@(src|stories)";

export const config: StorybookViteCommonConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: [
    require.resolve("@storybook/addon-links/manager"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-onboarding"),
    require.resolve("@storybook/addon-interactions/manager"),
    require.resolve("@storybook/addon-coverage/preset"),
  ],
  docs: {
    autodocs: "tag",
  },
  viteFinal(config, { configType }) {
    return mergeConfig(config, {
      server: {
        fs: {
          strict: configType === "PRODUCTION",
        },
      },
      plugins:
        configType === "PRODUCTION"
          ? // @ts-expect-error https://github.com/IanVS/vite-plugin-turbosnap/issues/8
            [turbosnap({ rootDir: config.root ?? process.cwd() })]
          : [],
    });
  },
};
