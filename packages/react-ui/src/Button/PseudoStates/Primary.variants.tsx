import preview from '.storybook/preview';
import {
  type StoryPseudoStateProps,
  generatePseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';
import { getPseudoStateArgTypes } from 'commons/esm/.storybook/utils/functions.js';

import { type Props, Button } from 'Button';
import primaryMeta from 'Button/Primary.story';

type Args = Props & StoryPseudoStateProps;

const meta = preview.type<{ args: Args }>().meta({
  ...primaryMeta.input,
  title: 'Components/Button/Primary/Pseudo States',
  argTypes: getPseudoStateArgTypes(),
  render: ({ storyPseudo, storyAttr, ...props }) => (
    <Button {...props} {...storyAttr} className={storyPseudo} />
  )
});

export default meta;

export const stories = generatePseudoStateStories({}, { showDefault: false });
