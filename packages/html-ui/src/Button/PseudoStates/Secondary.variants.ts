import preview from '.storybook/preview';
import primaryMeta, {
  Primary,
  stories as getStories
} from './Primary.variants';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.input,
  title: 'Components/Button/Secondary/Pseudo States'
});

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const Secondary = Primary.extend({
  args: {
    primary: false
  }
});

export const stories = getStories(Secondary.input);
