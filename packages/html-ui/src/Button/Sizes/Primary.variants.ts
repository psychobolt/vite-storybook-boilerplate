import { generateStoriesByEnum } from 'commons/esm/.storybook/utils/story-generators.js';

import preview from '.storybook/preview';
import { SizeEnum } from 'Button';
import primaryMeta from 'Button/Primary.story';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.extend({
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large']
      }
    }
  }),
  title: 'Components/Button/Primary/Sizes'
});

export default meta;

const Template = meta.story();

export const stories = (template = Template) =>
  generateStoriesByEnum([template], 'size', SizeEnum);
