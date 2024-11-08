import type { Config } from 'stylelint';

import { require } from './utils/functions.js';
import orderPlugins from './plugins/order.js';
import orderRules from './rules/order.js';

const config: Config = {
  extends: [
    require.resolve('stylelint-config-standard-scss'),
    require.resolve('stylelint-config-prettier-scss')
  ],
  plugins: [...orderPlugins],
  rules: {
    ...orderRules,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ]
  },
  allowEmptyInput: true
};

export default config;
