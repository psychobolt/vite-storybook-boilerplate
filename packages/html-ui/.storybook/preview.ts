import 'react-syntax-highlighter';
import {
  type WebComponentsRenderer,
  definePreview as _definePreview
} from '@storybook/web-components-vite';
import { definePreview } from 'commons/esm/.storybook/preview';
import { SyntaxHighlighter } from 'storybook/internal/components';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';

SyntaxHighlighter.registerLanguage('scss', scss);

const addons: never[] = [];

const preview = definePreview<WebComponentsRenderer, typeof addons>({
  addons,
  parameters: {
    options: {
      storySort: {
        order: ['Configure your project', 'Readme']
      }
    }
  }
});

preview.meta({
  parameters: {
    layout: 'centered'
  }
});

_definePreview({
  addons: []
}).meta({
  parameters: {
    layout: 'centered'
  }
});

export default preview;
