import { mergeConfig } from 'commons/esm/.storybook/utils/functions.js';

import preview from '.storybook/preview';
import secondaryMeta from 'Button/Secondary.story';
import primaryMeta, {
  type Args,
  Primary,
  stories as getStories
} from './Primary.variants';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.type<{ args: Args }>().meta({
  ...mergeConfig(primaryMeta.input, secondaryMeta.input),
  title: 'Components/Button/Secondary/Pseudo States'
});

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Secondary = meta.story(Primary.input);

export const stories = getStories(Secondary);
