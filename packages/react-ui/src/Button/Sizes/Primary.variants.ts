import {
  type VariantStoryObj,
  generateStoriesByEnum
} from 'commons/esm/.storybook/utils/story-generators.js';

import preview from '.storybook/preview';
import primaryMeta from 'Button/Primary.story';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.input,
  title: 'Components/Button/Primary/Sizes'
});

export default meta;

const Primary = meta.story();

export enum SizeEnum {
  small,
  medium,
  large
}

export const stories = (template: VariantStoryObj = Primary.input) =>
  generateStoriesByEnum([template], 'size', SizeEnum);
