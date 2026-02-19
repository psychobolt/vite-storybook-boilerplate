import preview from '.storybook/preview';
import primaryMeta from './Primary.variants';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.input,
  title: 'Components/Button/Secondary/Sizes',
  // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
  args: {
    ...primaryMeta.input.args,
    primary: false
  }
});

export default meta;

export * from './Primary.variants';
