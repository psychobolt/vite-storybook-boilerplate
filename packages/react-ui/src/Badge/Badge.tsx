import { Markdown } from '@storybook/addon-docs/blocks';
import { convert, ThemeProvider, themes } from 'storybook/theming';

export interface Props {
  children: string;
}

export const Badge = (props: Props) => (
  <ThemeProvider theme={convert(themes.normal)}>
    {Markdown(props)}
  </ThemeProvider>
);
