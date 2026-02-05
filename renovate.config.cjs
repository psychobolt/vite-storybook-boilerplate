const { join } = require('node:path');

const workspaces = process.env.RENOVATE_POST_UPGRADE_WORKSPACES
  ? JSON.parse(process.env.RENOVATE_POST_UPGRADE_WORKSPACES)
  : [];

/** @typedef {import('renovate/dist/config/types').PackageRule} PackageRule */

/** @type {PackageRule} */
const bootstrapRule = {
  matchFileNames: [
    'packages/commons/package.json',
    'packages/stylelint-config/package.json',
    ...workspaces.map(({ location }) => join(location, 'package.json'))
  ],
  postUpgradeTasks: {
    commands: ['YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn bootstrap'],
    fileFilters: ['**/yarn.lock']
  }
};

/** @type {PackageRule[]} */
const postPackageTasks = [
  {
    matchPackageNames: ['prettier**'],
    postUpgradeTasks: {
      commands: ['yarn turbo run format'],
      fileFilters: ['**/*']
    }
  }
];

/** @type {import('renovate/dist/config/types').AllConfig} */
module.exports = {
  extends: ['config:best-practices'],
  automerge: true,
  nvm: {
    enabled: false
  },
  allowedCommands: ['^.+$'],
  packageRules: [
    {
      matchPackageNames: ['renovate', 'renovatebot/github-action'],
      groupName: 'Renovate'
    },
    bootstrapRule,
    ...postPackageTasks,
    ...postPackageTasks.map(({ postUpgradeTasks, ...rule }) => {
      if (postUpgradeTasks) {
        return {
          ...rule,
          postUpgradeTasks: {
            commands: [
              ...bootstrapRule.postUpgradeTasks.commands,
              ...postUpgradeTasks.commands
            ],
            fileFilters: [
              ...bootstrapRule.postUpgradeTasks.fileFilters,
              ...postUpgradeTasks.fileFilters
            ]
          }
        };
      }
      return rule;
    })
  ]
};
