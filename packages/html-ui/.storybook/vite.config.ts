import { defineConfig } from "vite";
import type { Meta } from "@storybook/web-components";
import { vitePluginStorybookVariants } from "commons/esm/.storybook/addons/addon-variants.js";

export default defineConfig({
  plugins: [vitePluginStorybookVariants<Meta>("lit")],
});
