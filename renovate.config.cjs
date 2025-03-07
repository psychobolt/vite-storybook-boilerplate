const { execSync } = require('node:child_process');
const { join } = require('node:path');

const workspaces = JSON.parse(
  execSync('yarn ls-workspaces --node-linker=pnpm --node-linker=node-modules')
);

const commands = [];
if (/^renovate\/(?:vite|postcss)-/.test(process.env.BITBUCKET_BRANCH)) {
  commands.push('rm yarn.lock');
}

module.exports = {
  platform: 'bitbucket',
  repositories: ['psychobolt/vite-storybook-boilerplate'],
  allowedCommands: ['^.+$'],
  packageRules: [
    {
      matchFileNames: [
        'packages/commons/package.json',
        ...workspaces.map(({ location }) => join(location, 'package.json'))
      ],
      postUpgradeTasks: {
        commands: [
          ...commands,
          'YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install && yarn bootstrap'
        ],
        fileFilters: ['**/yarn.lock']
      }
    }
  ]
};
