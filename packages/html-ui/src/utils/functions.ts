import { spread } from '@open-wc/lit-helpers';
import type { ArgStateAttrMapper } from 'commons/esm/.storybook/utils/functions';

export const pseudoStateAttrMapper: ArgStateAttrMapper = (attributes) =>
  spread(
    Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => [`?${key}`, value])
    )
  );
