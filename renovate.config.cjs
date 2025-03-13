const { join } = require('node:path');

const workspaces = process.env.RENOVATE_POST_UPGRADE_WORKSPACES
  ? JSON.parse(process.env.RENOVATE_POST_UPGRADE_WORKSPACES)
  : [];

/* Renovate Global Config */
module.exports = {
  extends: ['config:best-practices'],
  automerge: true,
  nvm: {
    enabled: false
  },
  username: 'renovate[bot]',
  gitAuthor: 'renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>',
  allowedCommands: ['^.+$'],
  packageRules: [
    {
      matchFileNames: [
        'packages/commons/package.json',
        ...workspaces.map(({ location }) => join(location, 'package.json'))
      ],
      postUpgradeTasks: {
        commands: ['YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn bootstrap'],
        fileFilters: ['**/yarn.lock']
      }
    }
  ]
};
