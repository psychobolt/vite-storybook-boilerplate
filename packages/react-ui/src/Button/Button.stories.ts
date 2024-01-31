import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button.tsx";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
    onClick: { action: "onClick" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const args = {
  label: "Button",
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    ...args,
    primary: true,
  },
};

export const Secondary: Story = {
  args,
};

export const Large: Story = {
  args: {
    ...args,
    size: "large",
  },
};

export const Small: Story = {
  args: {
    ...args,
    size: "small",
  },
};
