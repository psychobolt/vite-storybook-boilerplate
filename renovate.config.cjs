const { execSync } = require('node:child_process');
const { join } = require('node:path');

const workspaces = JSON.parse(
  execSync('yarn ls-workspaces --node-linker=pnpm --node-linker=node-modules')
);

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString();

const commands = [];
if (/^renovate\/(?:vite|postcss)-/.test(branch)) {
  commands.push('rm yarn.lock');
}

module.exports = {
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
