import type { StorybookConfig } from "@storybook/react-vite";

const mainDir = '@(src|stories)';

const config: StorybookConfig = {
  stories: [
    `../${mainDir}/**/*.mdx`,
    `../${mainDir}/**/*.stories.@(js|jsx|ts|tsx)`
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
