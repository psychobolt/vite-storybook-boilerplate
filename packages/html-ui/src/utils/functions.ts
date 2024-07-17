import { spread } from '@open-wc/lit-helpers';
import type { ArgStateAttrMapper } from 'commons/esm/.storybook/utils/functions';
import { generatePseudoStateStories } from 'commons/esm/.storybook/utils/story-generators';

export const pseudoStateAttrMapper: ArgStateAttrMapper = (attributes) =>
  spread(
    Object.fromEntries(
      Object.entries(attributes).map(([key, value]) => [
        `${typeof value === 'boolean' ? '?' : ''}${key}`,
        value
      ])
    )
  );

export const getPseudoStateArgTypes: typeof generatePseudoStateStories.getArgTypes =
  ({ argStateAttrMapper = pseudoStateAttrMapper, ...options } = {}) =>
    generatePseudoStateStories.getArgTypes({ argStateAttrMapper, ...options });
