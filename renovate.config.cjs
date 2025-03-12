const { join } = require('node:path');

const workspaces = process.env.RENOVATE_POST_UPGRADE_WORKSPACES
  ? JSON.parse(process.env.RENOVATE_POST_UPGRADE_WORKSPACES)
  : [];

module.exports = {
  extends: ['config:best-practices'],
  automerge: true,
  nvm: {
    enabled: false
  },
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
