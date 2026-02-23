import 'react-syntax-highlighter';

import {
  type Preview,
  type WebComponentsTypes,
  definePreview
} from '@storybook/web-components-vite';
import { SyntaxHighlighter } from 'storybook/internal/components';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import { withDefaults } from 'commons/esm/.storybook/preview';

SyntaxHighlighter.registerLanguage('scss', scss);

// See issue: https://github.com/storybookjs/storybook/issues/33798
const parameters: Preview['parameters'] = {
  options: {
    storySort: {
      order: ['Configure your project', 'Readme']
    }
  }
};

export default {
  parameters,
  ...withDefaults<WebComponentsTypes>((defaults) =>
    definePreview({
      ...defaults,
      parameters: {
        ...defaults.parameters,
        ...parameters,
        docs: {
          source: {
            async transform(code) {
              const prettier = await import('prettier/standalone');
              const prettierPluginHtml = await import('prettier/plugins/html');
              return prettier.format(code, {
                parser: 'html',
                plugins: [prettierPluginHtml]
              });
            }
          }
        }
      }
    })
  )
};
