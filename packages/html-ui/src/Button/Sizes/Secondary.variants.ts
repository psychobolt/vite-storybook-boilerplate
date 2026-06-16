import { mergeConfig } from 'commons/esm/.storybook/utils/functions.js';

import preview from '.storybook/preview';
import secondaryMeta from 'Button/Secondary.story';
import primaryMeta from './Primary.variants';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...mergeConfig(primaryMeta.input, secondaryMeta.input),
  title: 'Components/Button/Secondary/Sizes'
});

export default meta;

export * from './Primary.variants';
