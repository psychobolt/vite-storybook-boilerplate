/** @type {import('stylelint').Config} */
export default {
  extends: ['../commons/esm/stylelint.config'],
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(--?[a-z0-9]+)*$',
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be kebab-case`
      }
    ]
  }
};
