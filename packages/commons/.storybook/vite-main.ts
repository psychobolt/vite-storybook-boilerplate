import { createRequire } from "module";
import { join, dirname } from "path";
import type { StorybookConfig } from "@storybook/types";
import type { StorybookConfigVite } from "@storybook/builder-vite";
import type { ResolveOptions } from "vite";
import { defineConfig, mergeConfig } from "vite";
import turbosnap from "vite-plugin-turbosnap";

type AliasOptions = Record<string, string>;

interface ResolveConfig {
  alias?: AliasOptions;
}

const require = createRequire(import.meta.url);
const resolveConfig: ResolveOptions & ResolveConfig = {
  alias: {},
};

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(
  moduleId: string,
  resolveConfig: NodeRequire | ResolveConfig | unknown = {},
): string {
  const { resolve = require.resolve } = resolveConfig as NodeRequire;
  const absolutePath = dirname(resolve(join(moduleId, "package.json")));
  const { alias } = resolveConfig as ResolveConfig;
  if (alias) {
    alias[moduleId] = absolutePath;
  }
  return absolutePath;
}

export const mainDir = "@(src|stories)";

export type StorybookViteCommonConfig = StorybookConfig &
  Required<StorybookConfigVite>;

export const config: StorybookViteCommonConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`,
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links", resolveConfig),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-interactions", resolveConfig),
    getAbsolutePath("@storybook/addon-coverage"),
  ],
  docs: {
    autodocs: "tag",
  },
  viteFinal(config, { configType }) {
    let finalConfig = mergeConfig(
      config,
      defineConfig({
        resolve: resolveConfig,
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
