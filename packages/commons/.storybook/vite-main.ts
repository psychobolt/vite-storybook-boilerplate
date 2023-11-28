import { join, dirname } from "path";
import type { StorybookConfig, Preset } from "@storybook/types";
import type { StorybookConfigVite } from "@storybook/builder-vite";
import type { AliasOptions } from "vite";
import { defineConfig, mergeConfig } from "vite";
import turbosnap from "vite-plugin-turbosnap";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(value: string, { resolve } = require): any {
  return dirname(resolve(join(value, "package.json")));
}

const addons: Preset[] = [
  getAbsolutePath("@storybook/addon-essentials"),
  getAbsolutePath("@storybook/addon-onboarding"),
  getAbsolutePath("@storybook/addon-coverage"),
];
const resolvePaths: AliasOptions = {};

for (const addon of [
  "@storybook/addon-links",
  "@storybook/addon-interactions",
]) {
  const absolutePath = dirname(require.resolve(addon));
  addons.push(join(absolutePath, "package.json"));
  resolvePaths[addon] = absolutePath;
}

const mainDir = "@(src|stories)";

export type StorybookViteCommonConfig = StorybookConfig & StorybookConfigVite;

export const config: StorybookViteCommonConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons,
  docs: {
    autodocs: "tag",
  },
  viteFinal(config, { configType }) {
    let finalConfig = mergeConfig(
      config,
      defineConfig({
        resolve: {
          alias: resolvePaths,
        },
      }),
    );

    if (configType === "PRODUCTION") {
      finalConfig = mergeConfig(
        finalConfig,
        defineConfig({
          plugins: [
            // @ts-expect-error https://github.com/IanVS/vite-plugin-turbosnap/issues/8
            turbosnap({ rootDir: config.root ?? process.cwd() }),
          ],
        }),
      );
    } else {
      finalConfig = mergeConfig(
        finalConfig,
        defineConfig({
          server: {
            fs: {
              strict: false,
            },
          },
        }),
      );
    }

    return finalConfig;
  },
};
