import { html } from 'lit';

import preview from '.storybook/preview';
import { Icon } from './Icon';
import styles from './Icons.module.scss';

interface Args {
  icons: string[];
}

const meta = preview.type<{ args: Args }>().meta({
  title: 'Examples/Icons',
  tags: ['autodocs'],
  render: ({ icons }) => html`${icons.map((icon) => Icon({ icon }))}`,
  args: {
    icons: []
  }
});

export default meta;

export const FontAwesome = meta.story({
  args: {
    icons: [styles.faFontAwesome, styles.faWebAwesome].map(
      (icon) => `${styles.faBrands} ${icon}`
    )
  }
});
