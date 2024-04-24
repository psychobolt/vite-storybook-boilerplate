const { execSync } = require('node:child_process');
const { join } = require('node:path');

const stdout = execSync(
  'yarn ls-workspaces --node-linker=pnpm --node-linker=node-modules'
);

const workspaces = JSON.parse(stdout);

module.exports = {
  platform: 'bitbucket',
  repositories: ['psychobolt/vite-storybook-boilerplate'],
  allowedPostUpgradeCommands: ['^.+$'],
  packageRules: [
    {
      matchFileNames: [
        'packages/commons/package.json',
        ...workspaces.map(({ location }) => join(location, 'package.json'))
      ],
      postUpgradeTasks: {
        commands: [
          'YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && yarn bootstrap'
        ],
        fileFilters: ['**/yarn.lock', 'bitbucket-pipelines.yml']
      }
    }
  ]
};
