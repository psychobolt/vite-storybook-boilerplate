import 'react-syntax-highlighter';

import { definePreview } from '@storybook/web-components-vite';
import { SyntaxHighlighter } from 'storybook/internal/components';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import { withDefaults } from 'commons/esm/.storybook/preview';

SyntaxHighlighter.registerLanguage('scss', scss);

export default {
  ...withDefaults((defaults) =>
    definePreview({
      ...defaults,
      addons: [...defaults.addons],
      parameters: {
        ...defaults.parameters,
        options: {
          ...(defaults.parameters?.options as object),
          storySort: {
            order: ['Configure your project', 'Readme']
          }
        }
      }
    })
  )
};
