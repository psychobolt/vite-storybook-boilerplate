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

const installCommand =
  'env YARN_ENABLE_IMMUTABLE_INSTALLS=false YARN_AFTER_INSTALL="" yarn install';

const npmRule: PackageRule = {
  matchManagers: ['npm'],
  postUpgradeTasks: {
    commands: [installCommand, ...dedupeCommands],
    fileFilters: lockfiles,
    executionMode: 'branch'
  }
};

const postPackageTasks: PostPackageTasks = [
  {
    matchPackageNames: ['prettier**'],
    postUpgradeTasks: {
      commands: [installCommand, ...dedupeCommands, 'yarn turbo run format'],
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
  packageRules: [npmRule, ...postPackageTasks]
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(config));
}

export default config;
