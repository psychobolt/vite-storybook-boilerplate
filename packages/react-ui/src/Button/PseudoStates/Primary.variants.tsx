import preview from '.storybook/preview';
import {
  type StoryPseudoStateProps,
  type StoryPseudoStateArgs,
  generatePseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';
import { getPseudoStateArgTypes } from 'commons/esm/.storybook/utils/functions.js';
import classNames from 'classnames';

import { type Props, Button } from 'Button';
import primaryMeta from 'Button/Primary.story';

const styles = { padding: '3px' };

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.type<{ args: Props & StoryPseudoStateProps }>().meta({
  ...primaryMeta.extend({
    argTypes: getPseudoStateArgTypes(),
    decorators: [
      (Story) => (
        <div style={styles}>
          <Story />
        </div>
      )
    ]
  }),
  title: 'Components/Button/Primary/Pseudo States',
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  render: ({ className, storyPseudo, storyAttr, ...props }) => (
    <Button
      {...props}
      {...storyAttr}
      className={classNames(className, storyPseudo)}
    />
  )
});

export default meta;

const Template = meta.type<{ args: Props & StoryPseudoStateArgs }>().story();

export const stories = generatePseudoStateStories(Template, {
  showDefault: false
});
