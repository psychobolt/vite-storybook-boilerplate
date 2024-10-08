/** @type {import('stylelint').Config} */
export default {
  extends: ['../stylelint-config/esm/stylelint-scss.config'],
  rules: {
    'no-descending-specificity': [true, { ignore: ['selectors-within-list'] }],
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(--?[a-z0-9]+)*$',
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be kebab-case`
      }
    ]
  }
};
