import path from 'node:path';
import type { Config } from 'stylelint';

import { require } from '../utils/functions.js';

const { flatten, unflatten } = await import(
  path.join('file://', require.resolve('flat'))
);

const { rules = {} }: Config = require('stylelint-config-hudochenkov/order');
type Rules = NonNullable<typeof rules>;

const rulesFlattened: Record<keyof Rules, Rules[keyof Rules]> = flatten(rules);

const updatedRules: Rules = unflatten(
  {
    ...rulesFlattened,
    'order/order.0': [
      'dollar-variables',
      {
        type: 'at-rule',
        name: 'include',
        parameter: 'reset'
      },
      'custom-properties',
      'declarations',
      {
        type: 'at-rule',
        name: 'include'
      },
      'rules',
      'at-rules'
    ],
    'order/order.1.severity': 'error',
    'order/properties-order.1.severity': 'error'
  },
  { overwrite: true }
);

export default updatedRules;
