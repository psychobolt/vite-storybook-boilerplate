import type { Args, ArgTypes } from '@storybook/types';
import { $enum } from 'ts-enum-util';

import type { EnumLike, PseudoStateOptions } from './story-generators.js';
import {
  DefaultPseudoClsEnum,
  DefaultStateAttrEnum
} from './story-generators.js';

export type ArgStateAttrMapper = (key: string, value: any) => [string, any];

export interface PseudoStateArgTypeOptions<
  P extends EnumLike<P>,
  A extends EnumLike<A>
> extends PseudoStateOptions<P, A> {
  argStateAttrMapper?: ArgStateAttrMapper;
}

export interface StoryPseudoStateArgs extends Args {
  storyPseudo: string;
  storyAttr: string;
}

export const getPseudoStateArgTypes = <
  P extends EnumLike<P>,
  A extends EnumLike<A>
>({
  pseudoClasses,
  stateAttributes,
  argStateAttrMapper = (key, value) => [key, value]
}: PseudoStateArgTypeOptions<P, A> = {}): ArgTypes<StoryPseudoStateArgs> => ({
  storyPseudo: {
    control: 'select',
    options: [
      'none',
      ...$enum(pseudoClasses || DefaultPseudoClsEnum).getKeys()
    ],
    mapping: DefaultPseudoClsEnum,
    description: 'Render story with a pseudo class e.g. `:hover`'
  },
  storyAttr: {
    control: 'select',
    options: [
      'none',
      ...$enum(stateAttributes || DefaultStateAttrEnum).getKeys()
    ],
    mapping: Object.fromEntries(
      $enum(stateAttributes || DefaultStateAttrEnum)
        .getEntries()
        .map(([key, value]) => {
          let newEntry;
          if (typeof value === 'string') {
            try {
              newEntry = argStateAttrMapper(key, JSON.parse(value));
            } catch (e) {}
          } else if (typeof value === 'number') {
            newEntry = argStateAttrMapper(key, { [key]: true });
          }
          return newEntry ?? argStateAttrMapper(key, value) ?? [key, value];
        })
    ),
    description: 'Render story with a attribute e.g. `&[disabled]`'
  }
});
