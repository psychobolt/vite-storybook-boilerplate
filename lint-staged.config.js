import defaultConfig from 'commons/esm/lint-staged.config.js';

/** @type {import('lint-staged').Config} */
export default {
  './bitbucket-pipelines.yml': () => 'yarn exec turbo run //#config-ci',
  '!(bitbucket-pipelines.yml)': defaultConfig['*']
};
