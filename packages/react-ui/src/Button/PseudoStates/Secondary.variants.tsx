import preview from '.storybook/preview';
import { mergeConfig } from '.storybook/utils/functions';
import secondaryMeta from 'Button/Secondary.story';
import primaryMeta from './Primary.variants';

const meta = preview.meta({
  ...mergeConfig(primaryMeta.input, secondaryMeta.input),
  title: 'Components/Button/Secondary/Pseudo States',
  render: primaryMeta.input.render
});

export default meta;

export * from './Primary.variants';
