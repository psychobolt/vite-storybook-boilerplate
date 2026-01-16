import 'react-syntax-highlighter';
import type { Preview } from '@storybook/web-components-vite';
import commonConfig from 'commons/esm/.storybook/preview';
import { SyntaxHighlighter } from 'storybook/internal/components';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';

SyntaxHighlighter.registerLanguage('scss', scss);

const preview: Preview = {
  ...commonConfig,
  parameters: {
    ...commonConfig.parameters,
    options: {
      ...commonConfig.parameters?.options,
      storySort: {
        order: ['Configure your project', 'Readme']
      }
    }
  }
};

export default preview;
