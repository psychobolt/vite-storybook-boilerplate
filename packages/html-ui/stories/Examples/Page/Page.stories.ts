import type { Meta, StoryObj } from "@storybook/html";
import { within, userEvent } from "@storybook/testing-library";
import { createPage } from "./Page";

const meta = {
  title: "Examples/Page",
  render: () => createPage(),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/html/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

export const LoggedOut: StoryObj = {};

// More on interaction testing: https://storybook.js.org/docs/7.0/html/writing-tests/interaction-testing
export const LoggedIn: StoryObj = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = await Promise.resolve(
      canvas.getByRole("button", {
        name: /Log in/i,
      }),
    );
    await Promise.resolve(userEvent.click(loginButton));
  },
};
