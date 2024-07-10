import primaryMeta, { type Story, Default as Primary } from './Primary.story';

const meta = {
  ...primaryMeta,
  title: 'Components/Button/Secondary',
  tags: ['autodocs']
} satisfies typeof primaryMeta;

export default meta;

export const Default: Story = {
  ...Primary,
  args: {
    ...Primary.args,
    primary: false
  }
};
