/// <reference path="./bin/index.d.ts" />
import { join } from 'node:path';
import type {
  AllConfig,
  RenovateConfig
} from 'renovate/dist/config/types.d.ts';

const workspaces: Workspace[] = process.env.RENOVATE_POST_UPGRADE_WORKSPACES
  ? JSON.parse(process.env.RENOVATE_POST_UPGRADE_WORKSPACES)
  : [];

type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

type PackageRule = NonNullable<RenovateConfig['packageRules']>[number] & {
  minimumGroupSize?: number;
};

type PostUpgradeTask = RequiredKeys<
  NonNullable<RenovateConfig['postUpgradeTasks']>,
  'commands' | 'fileFilters'
>;

type PostUpgradeTaskRule = Omit<
  NonNullable<RenovateConfig['packageRules']>[number],
  'postUpgradeTasks'
> & { postUpgradeTasks: PostUpgradeTask };

type PostPackageTasks = Array<
  RequiredKeys<PostUpgradeTaskRule, 'postUpgradeTasks'>
>;

const bootstrapRule: PostUpgradeTaskRule = {
  matchFileNames: [
    'packages/commons/package.json',
    'packages/stylelint-config/package.json',
    ...workspaces.map(({ location }) => join(location, 'package.json'))
  ],
  postUpgradeTasks: {
    commands: ['yarn bootstrap'],
    fileFilters: ['**/yarn.lock'],
    executionMode: 'branch'
  }
};

const postPackageTasks: PostPackageTasks = [
  {
    matchPackageNames: ['prettier**'],
    postUpgradeTasks: {
      commands: ['yarn turbo run format'],
      fileFilters: ['**/*'],
      executionMode: 'branch'
    }
  }
];

const config: Omit<AllConfig, 'packageRules'> & {
  packageRules: PackageRule[];
} = {
  extends: ['config:best-practices'],
  automerge: true,
  allowedCommands: ['^.+$'],
  packageRules: [
    {
      matchPackageNames: ['renovate*'],
      matchBaseBranches: ['main'],
      matchUpdateTypes: ['major'],
      groupName: 'Renovate',
      minimumGroupSize: 2
    },
    bootstrapRule,
    ...postPackageTasks,
    ...postPackageTasks.map(({ postUpgradeTasks, ...rule }) => ({
      ...rule,
      postUpgradeTasks: {
        ...postUpgradeTasks,
        commands: [
          ...bootstrapRule.postUpgradeTasks.commands,
          ...postUpgradeTasks.commands
        ],
        fileFilters: [
          ...bootstrapRule.postUpgradeTasks.fileFilters,
          ...postUpgradeTasks.fileFilters
        ]
      }
    }))
  ]
};

export default config;
