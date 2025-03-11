const { execSync } = require('node:child_process');
const { join } = require('node:path');

const workspaces = JSON.parse(process.env.NM_WORKSPACES);

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString();

const commands = [];
if (/^renovate\/(?:vite|postcss)-/.test(branch)) {
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
          'YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn bootstrap'
        ],
        fileFilters: ['**/yarn.lock']
      }
    }
  ]
};
