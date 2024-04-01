declare module '@eslint/eslintrc';

declare module 'eslint-plugin-react/configs/jsx-runtime.js' {
  import type { TSESLint } from '@typescript-eslint/utils';
  const _default: TSESLint.FlatConfig.Config;
  export default _default;
}

declare module 'stylelint-config-standard-scss';

declare module 'prettier-config-standard';
