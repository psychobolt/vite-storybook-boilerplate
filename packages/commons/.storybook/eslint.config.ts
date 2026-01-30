import * as tseslint from '@typescript-eslint/utils/ts-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';

const configs = storybook.configs['flat/recommended'];

// See issue https://github.com/storybookjs/storybook/issues/32405
type Config = Exclude<
  (typeof configs)[0],
  // @ts-ignore
  { plugins: { storybook: { [key: string]: tseslint.RuleModule } } }
>;

export default defineConfig(
  ...(configs as Config[]),
  globalIgnores(['!.storybook'])
);
