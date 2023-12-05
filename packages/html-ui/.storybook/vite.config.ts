import { defineConfig } from "vite";
import type { Meta } from "@storybook/web-components";
import { vitePluginStorybookVariants } from "commons/.storybook/addons/addon-variants.ts";

export default defineConfig({
  plugins: [vitePluginStorybookVariants<Meta>("lit")],
});
