import { generateStoriesByEnum } from 'commons/esm/.storybook/utils/story-generators.js';

import preview from '.storybook/preview';
import { SizeEnum } from 'Button';
import primaryMeta from 'Button/Primary.story';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.extend(),
  title: 'Components/Button/Primary/Sizes'
});

export default meta;

const Primary = meta.story();

export const stories = (template = Primary) =>
  generateStoriesByEnum([template], 'size', SizeEnum);
