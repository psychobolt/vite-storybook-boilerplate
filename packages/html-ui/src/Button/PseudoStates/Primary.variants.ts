import type { StoryObj } from '@storybook/web-components';
import type { VariantsMeta } from 'commons/esm/.storybook/addons/addon-variants.js';
import {
  type VariantStoryObj,
  generateDefaultPseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';

import { defaultPseudoStateAttrMapper } from 'utils/functions.ts';
import type { Props } from '../Button.ts';

export type Meta = VariantsMeta<Props>;

export const meta = {
  title: 'Components/Button/Primary/Pseudo States',
  fileName: '../Button.ts',
  importName: 'Button',
  tags: ['autodocs'],
  argTypes: generateDefaultPseudoStateStories.getArgTypes({
    argStateAttrMapper: defaultPseudoStateAttrMapper
  })
} satisfies Meta;

export type Story = StoryObj<Props> & VariantStoryObj<Props>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true
  }
};

export const stories = (template = Primary) =>
  generateDefaultPseudoStateStories(template, { showDefault: false });
