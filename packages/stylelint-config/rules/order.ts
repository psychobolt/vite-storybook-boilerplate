import path from 'node:path';
import type { Config } from 'stylelint';

import { require } from '../utils/functions.js';

const { flatten, unflatten } = await import(
  path.join('file://', require.resolve('flat'))
);

const { rules = {} }: Config = require('stylelint-config-hudochenkov/order');
type Rules = NonNullable<typeof rules>;

const rulesFlattened: Record<keyof Rules, Rules[keyof Rules]> = flatten(rules);
const order = rules['order/order'][0].slice(0, -1);

const updatedRules: Rules = unflatten(
  {
    ...rulesFlattened,
    'order/order.0': [
      {
        type: 'at-rule',
        name: 'include',
        parameter: 'reset'
      },
      ...order,
      {
        type: 'at-rule',
        name: 'include'
      },
      {
        type: 'rule',
        selector: '/^&/'
      },
      'rules'
    ],
    'order/order.1.severity': 'error',
    'order/properties-order.1.severity': 'error'
  },
  { overwrite: true }
);

export default updatedRules;
