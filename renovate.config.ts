import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  AllConfig,
  PackageRule,
  PackageRuleInputConfig
} from 'renovate/dist/config/types.d.ts';
import getWorkspaces from 'commons/esm/bin/ls-workspaces.js';

const workspaces = await getWorkspaces({
  nodeLinker: ['node-modules', 'pnpm']
});

type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

type PostPackageTasks = Array<RequiredKeys<PackageRule, 'postUpgradeTasks'>>;

const lockfiles = ['**/yarn.lock'];

const dedupeCommand =
  'yarn dedupe {{#each (distinct (lookupArray upgrades "packageName"))}}{{{.}}} {{/each}}';

const workspaceDedupeCommands = workspaces.map(
  ({ location }) =>
    `yarn ${location} dedupe {{#each (distinct (lookupArray upgrades "packageName"))}}{{{.}}} {{/each}}`
);

const dedupeCommands = [dedupeCommand, ...workspaceDedupeCommands];

const dedupeRule: PackageRule = {
  matchManagers: ['npm'],
  postUpgradeTasks: {
    commands: dedupeCommands,
    fileFilters: lockfiles,
    executionMode: 'branch'
  }
};

const bootstrapCommand =
  'env YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn bootstrap';

const bootstrapRule: PackageRule = {
  matchFileNames: [
    'packages/commons/package.json',
    'packages/stylelint-config/package.json',
    ...workspaces.map(({ location }) => join(location, 'package.json'))
  ],
  postUpgradeTasks: {
    commands: [bootstrapCommand, ...dedupeCommands],
    fileFilters: lockfiles,
    executionMode: 'branch'
  }
};

const postPackageTasks: PostPackageTasks = [
  {
    matchPackageNames: ['prettier**'],
    postUpgradeTasks: {
      commands: [bootstrapCommand, ...dedupeCommands, 'yarn turbo run format'],
      fileFilters: [...lockfiles, '**/*'],
      executionMode: 'branch'
    }
  }
];

const config: AllConfig & {
  apm: PackageRuleInputConfig;
  nvm: PackageRuleInputConfig;
} = {
  extends: ['config:best-practices', ':prHourlyLimitNone'],
  ignorePresets: ['security:minimumReleaseAgeNpm'],
  apm: {
    enabled: true
  },
  nvm: {
    enabled: false
  },
  automerge: true,
  allowedCommands: ['^.+$'],
  baseBranchPatterns: ['main'],
  packageRules: [dedupeRule, bootstrapRule, ...postPackageTasks]
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(config));
}

export default config;
