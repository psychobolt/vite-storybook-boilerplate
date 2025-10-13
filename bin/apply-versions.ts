import arg from 'arg';
import semver from 'semver';

import {
  $,
  EXIT_SUCCESS,
  EXIT_INVALID_USAGE
} from 'commons/esm/bin/utils/functions.js';
import getWorkspaces from './ls-workspaces.ts';

enum Strategy {
  build,
  launch,
  stable,
  minor,
  patch
}

const args = arg({
  '--strategy': String,
  '--force': Boolean
});

const type = args['--strategy'] || Strategy[Strategy.build];
const force = args['--force'] === true;
const execOptions = { silent: true };

switch (type) {
  case Strategy[Strategy.minor]:
  // fall through
  case Strategy[Strategy.patch]:
    await $(
      `yarn workspaces foreach --since --no-private version ${type} --deferred`,
      execOptions
    );
    break;
}

async function* getTagAnnotation() {
  await $('git fetch --tags --force', execOptions);
  const tags = await $('git tag', execOptions);
  for await (const tag of tags.split('\n')) {
    const stdout = await $(
      `git tag -l --format="%(contents:subject)" ${tag}`,
      execOptions
    );
    yield stdout;
  }
}

type SemVer = Record<string, undefined | string>;

const buildTag = 'build';
const latest: SemVer = {};

for await (const annotation of getTagAnnotation()) {
  let versions: SemVer;
  try {
    versions = JSON.parse(annotation);
  } catch (e) {
    continue;
  }

  for (const pkg in versions) {
    const target = versions[pkg] ?? '0.0.0';
    if (target.includes(`-${buildTag}.`)) continue;
    const highest = latest[pkg] ?? '0.0.0';
    if (semver.gt(target, highest)) {
      latest[pkg] = target;
    }
  }
}

const getVersions = async (options?: Options): Promise<SemVer> =>
  await getWorkspaces({
    format: ['semver'],
    noPrivate: true,
    ...options
  });

let current = await getVersions({
  since: !force && type !== Strategy[Strategy.launch]
});
const prev = { ...current };
const changed: string[] = [];

async function applyAll() {
  const stdout = await $('yarn version apply --all --json', execOptions);
  if (stdout === '') {
    console.log('{}');
    process.exit(EXIT_SUCCESS);
  }
  for (const line of stdout.split('\n')) {
    try {
      const { ident, newVersion }: Record<string, string> = JSON.parse(line);
      current[ident] = newVersion;
      if (!changed.includes(ident)) {
        changed.push(ident);
      }
    } catch (e) {
      continue;
    }
  }
}

await applyAll();

interface TaskInfo {
  task: string;
  package: string;
  hash: string;
}

interface BuildInfo {
  tasks: TaskInfo[];
}

const hashIds: Record<string, string> = {};
switch (type) {
  case Strategy[Strategy.minor]:
  // falls through
  case Strategy[Strategy.patch]:
    await $(
      `yarn workspaces foreach --since --no-private --exclude ${changed.join(
        ' --exclude '
      )} version ${type} --deferred`,
      execOptions
    );
    await applyAll();
    break;
  case Strategy[Strategy.build]: {
    const stdout = await $('yarn turbo run build --dry-run=json', execOptions);
    const { tasks = [] }: BuildInfo = JSON.parse(stdout);
    for (const { task, package: name, hash } of tasks) {
      if (task === 'build') {
        hashIds[name] = hash;
      }
    }
    // fall through
  }
  default:
    for (const name in current) {
      const highest = latest[name] ?? '0.0.0';
      const oldVersion = prev[name] ?? '0.0.0';
      const version = current[name] ?? '0.0.0';
      let bump = null;

      if (!force && version === oldVersion) continue;

      switch (type) {
        case Strategy[Strategy.build]: {
          const hashId = hashIds[name];
          if (!hashId) {
            console.error(
              `Build task was not found for workspace "${name}". Did you configure it in turbo config?`
            );
            process.exit(EXIT_INVALID_USAGE);
          }
          bump = `${semver.major(version)}.${semver.minor(
            version
          )}.${semver.patch(version)}-${buildTag}-${hashId.substring(0, 7)}`;
          break;
        }
        case Strategy[Strategy.launch]:
          if (semver.lt(version, '1.0.0')) {
            bump = 'major';
          } else if (semver.lte(version, highest)) {
            bump = 'minor';
          }
          break;
        case Strategy[Strategy.stable]: {
          if (
            oldVersion === highest ||
            !(semver.lt(oldVersion, highest) && semver.lte(version, highest))
          ) {
            break;
          }
          const prerelease = semver.prerelease(oldVersion);
          let release;
          if (prerelease != null) {
            release = 'prerelease';
          } else {
            const diff: string = semver.diff(version, oldVersion) ?? 'prepatch';
            release = diff.startsWith('pre') ? diff : `pre${diff}`;
          }
          bump = semver.inc(
            oldVersion,
            release as semver.ReleaseType,
            'rc',
            '1'
          );
        }
      }

      const prerelease = bump == null ? null : semver.prerelease(bump);

      if (bump) {
        for (
          let i = 0;
          i < (prerelease == null ? 1 : 2);
          i += 1 // https://github.com/yarnpkg/berry/issues/3868
        ) {
          await $(`yarn workspace ${name} version ${bump}`, execOptions);
        }
      }
    }
}

current = await getVersions();
console.log(JSON.stringify(current));
