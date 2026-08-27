import commonConfig from 'commons/esm/lint-staged.base.config.js';

const format = commonConfig['*'];

/** @type {typeof commonConfig} */
const config = {
  '!(.apm/**/*|apm.yml)': format,
  '{.apm/**/*,apm.yml}': (filenames) => [
    format(filenames),
    'apm install',
    'git add apm.lock.yaml'
  ]
};

export default config;
