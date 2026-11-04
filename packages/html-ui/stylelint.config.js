/** @type {import('stylelint').Config} */
export default {
  extends: ['../stylelint-config/esm/stylelint-scss.config.js'],
  rules: {
    'no-descending-specificity': [true, { ignore: ['selectors-within-list'] }]
  }
};
