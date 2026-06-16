import { fn } from 'storybook/test';

import preview from '.storybook/preview';
import { type Props, Button } from './Button';
import style from 'Button/Button.module.scss';

interface Args extends Props {
  /**
   * What background color to use
   */
  backgroundColor?: string;
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction#default-export
const meta = preview.type<{ args: Args }>().meta({
  title: 'Components/Button/Primary',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  excludeStories: ['preview'],
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args#component-args
  args: {
    className: style.storybookButtonPrimary,
    children: 'Button',
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    onClick: fn()
  },
  argTypes: {
    className: {
      table: {
        defaultValue: {
          summary: style.storybookButtonPrimary
        }
      }
    },
    backgroundColor: {
      control: 'color',
      description: 'What background color to use'
    }
  },
  component: Button,
  render: ({ backgroundColor, style, ...props }) => (
    <Button {...props} style={{ ...style, backgroundColor }} />
  )
});

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = meta.story();
