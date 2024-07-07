import { spread } from '@open-wc/lit-helpers';
import type { ArgStateAttrMapper } from 'commons/esm/.storybook/utils/functions.js';

export const pseudoStateAttrMapper: ArgStateAttrMapper = (key, value) => {
  let newVal = value;
  if (typeof value === 'object') {
    debugger;
    newVal = value[key];
    if (newVal) {
      newVal = spread({ [`?${key}`]: newVal });
    }
  }
  return [key, newVal];
};
