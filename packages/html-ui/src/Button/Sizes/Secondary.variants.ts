import type { Meta, Story } from './Primary.variants.ts';
import {
  meta as primaryMeta,
  Primary,
  stories as getStories
} from './Primary.variants.ts';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  ...primaryMeta,
  title: 'Components/Button/Secondary/Sizes'
} satisfies Meta;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Secondary: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    primary: false
  }
};

export const stories = () => getStories(Secondary);
