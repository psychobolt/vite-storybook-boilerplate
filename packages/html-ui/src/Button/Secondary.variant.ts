import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/plugins/storybook/vite-plugin-storybook-variants.ts";
import {
  type VariantStoryObj,
  generateStories,
} from "commons/.storybook/utils.ts";

import type { Meta, Story } from "./Primary.variant.ts";
import {
  meta as primaryMeta,
  Primary,
  stories as getStories,
} from "./Primary.variant.ts";

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  ...primaryMeta,
  title: "Components/Button/Secondary",
} satisfies Meta;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Secondary: Story = {
  ...Primary,
  name: "Secondary",
  args: {
    ...Primary.args,
    primary: false,
  },
};

export const stories = () => getStories([Secondary]);
