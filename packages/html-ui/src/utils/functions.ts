import { spread } from '@open-wc/lit-helpers';
import type { ArgStateAttrMapper } from 'commons/esm/.storybook/utils/functions';
import * as functions from 'commons/esm/.storybook/utils/functions';

export const pseudoStateAttrMapper: ArgStateAttrMapper = (attributes) =>
  spread(
    Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => [
        `${typeof value === 'boolean' ? '?' : ''}${key}`,
        value
      ])
    )
  );

export const getPseudoStateArgTypes: typeof functions.getPseudoStateArgTypes =
  ({ argStateAttrMapper = pseudoStateAttrMapper, ...options } = {}) =>
    functions.getPseudoStateArgTypes({ argStateAttrMapper, ...options });
