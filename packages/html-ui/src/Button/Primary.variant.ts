import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/plugins/storybook/vite-plugin-storybook-variants.ts";
import {
  type VariantStoryObj,
  generateStories,
} from "commons/.storybook/utils.ts";

import type { Props } from "./Button.ts";

export type Meta = VariantsMeta<Props>;

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  title: "Components/Button/Primary",
  fileName: "./Button.ts",
  importName: "Button",
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
    onClick: { action: "onClick" },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta;

export type Story = StoryObj<Props> & VariantStoryObj<Props>;

const args = {
  label: "Button",
};

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {
  name: "Primary",
  args: {
    ...args,
    primary: true,
  },
};

export enum SizeEnum {
  small,
  medium,
  large,
}

export const stories = (stories = [Primary]) =>
  generateStories<Props, typeof SizeEnum>(stories, "size", SizeEnum);
