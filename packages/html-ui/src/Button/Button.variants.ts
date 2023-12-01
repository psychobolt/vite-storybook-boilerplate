import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/plugins/storybook/vite-plugin-storybook-variants.ts";
import {
  type VariantStoryObj,
  generateStories,
} from "commons/.storybook/utils.ts";

import type { Props } from "./Button.ts";

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  title: "Components/Button",
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
} satisfies VariantsMeta<Props>;

type Story = StoryObj<Props> & VariantStoryObj<Props>;

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

export const Secondary: Story = {
  name: "Secondary",
  args,
};

export enum SizeEnum {
  small,
  medium,
  large,
}

export const stories = generateStories<Props, typeof SizeEnum>(
  [Primary, Secondary],
  "size",
  SizeEnum,
);
