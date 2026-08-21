import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import childProcess from 'node:child_process';
import util from 'node:util';
import arg, { type Spec as ArgSpec } from 'arg';
import globToRegExp from 'glob-to-regexp';
import YAML from 'yaml';
import { type PortablePath, npath } from '@yarnpkg/fslib';
import { Configuration, Project } from '@yarnpkg/core';

interface Tester {
  test: (value: string) => boolean;
}

type Matcher =
  ((value: any, options?: any) => Tester) | ((value?: any[]) => Tester);

interface Spec {
  alias?: string;
  key?: string;
  type: any;
}

interface Filter extends Spec {
  value?: string | boolean | string[];
  matcher?: Matcher | RegExp | Tester;
}

type Filters = Record<string, Filter>;

export type Options = Record<string, any>;

export type NodeLinker = 'node-modules' | 'pnpm';

export interface Workspace {
  name: string;
  location: string;
  path: string;
}

type Mapper<T> = (workspaces: Workspace[], result?: unknown) => T;

interface Formatter extends Spec {
  value: string[];
  mapper: <T extends Workspace>(type: string[]) => Mapper<T[]>;
}

type Formatters = Record<string, Formatter>;

const { execSync } = childProcess;
const exec = util.promisify(childProcess.exec);

const globMatcher = (negate?: boolean) => (expressions: string[]) => {
  const matchers = expressions.reduce(
    (list: RegExp[], expression) => [
      ...list,
      globToRegExp(expression, { extended: true })
    ],
    []
  );
  return {
    test: (value: string) => {
      const matches = matchers.some((matcher) => matcher.test(value));
      return negate ? !matches : matches;
    }
  };
};

const storybookMainMatcher = globToRegExp('main.*', { extended: true });

function getFormatter(type: string): Mapper<any> {
  switch (type) {
    case 'semver':
      return (workspaces: Workspace[]) =>
        workspaces.reduce(
          (result, workspace) => ({
            ...result,
            [workspace.name]: execSync(
              `yarn ${[
                'workspace',
                workspace.name,
                'exec',
                "'echo $npm_package_version'"
              ].join(' ')}`
            )
              .toString()
              .trim()
          }),
          {}
        );
    default:
      return (_, result) => result;
  }
}

async function setupProject() {
  const configuration = await Configuration.find(
    npath.toPortablePath(process.cwd()),
    null,
    { strict: false }
  );
  const { project } = await Project.find(
    configuration,
    configuration.startingCwd
  );
  return project;
}

async function getWorkspaces<T = Workspace[]>(options?: Options) {
  const filters: Filters = {
    '--name': {
      key: 'name',
      alias: '-n',
      type: String,
      value: '',
      matcher: RegExp
    },
    '--include': {
      key: 'include',
      type: [String],
      value: [],
      matcher: globMatcher()
    },
    '--exclude': {
      key: 'exclude',
      type: [String],
      value: [],
      matcher: globMatcher(true)
    },
    '--node-linker': {
      key: 'nodeLinker',
      type: [String],
      value: []
    },
    '--turbo-only': {
      key: 'turboOnly',
      type: Boolean,
      value: false
    },
    '--storybook': {
      key: 'storybook',
      type: Boolean,
      value: false
    },
    '--no-private': {
      key: 'noPrivate',
      type: Boolean
    },
    '--since': {
      key: 'since',
      type: Boolean,
      value: false
    }
  };

  const formatters: Formatters = {
    '--format': {
      key: 'format',
      type: [String],
      mapper: (formatters) => (workspaces) =>
        formatters.reduce<any>(
          (result, formatter) => getFormatter(formatter)(workspaces, result),
          workspaces
        ),
      value: []
    }
  };

  const specEntries = Object.entries({ ...filters, ...formatters });

  const { _ = [], ...args } = arg<ArgSpec>(
    specEntries.reduce(
      (config, [key, { alias, type }]) => ({
        [key]: type,
        ...(alias ? { [alias]: key } : {}),
        ...config
      }),
      {}
    ),
    { permissive: true }
  );

  if (options) {
    function updateArg(key: string, value: any) {
      if (!(key in args)) {
        (args as Record<string, any>)[key] = value;
      }
    }

    Object.entries(options).forEach(([option, value]) => {
      const entry = specEntries.find(([_, { key }]) => key === option);
      if (typeof entry !== 'undefined') {
        updateArg(entry[0], value);
      }
    });
  }

  Object.entries(args).forEach(([key, value]) => {
    const filter: Filter = filters[key];
    if (typeof filter !== 'undefined') {
      if (filter.value instanceof Array && typeof value === 'string') {
        filter.value.push(value);
      } else {
        filter.value = value;
      }
      if (filter.matcher) {
        filter.matcher = (filter.matcher as Matcher)(value);
      }
    }
    const formatter: Formatter = formatters[key];
    if (typeof formatter !== 'undefined') {
      formatter.value = value ?? [];
    }
  });

  _.forEach((argKey) => {
    const filter: Filter = filters[argKey];
    const index = _.indexOf(argKey);
    const value = _[index + 1];
    if (typeof filter !== 'undefined' && value && !value.startsWith('--')) {
      filter.value = value;
    }
  });

  const noPrivate = filters['--no-private'].value;
  const since = filters['--since'].value;
  const project = await setupProject();
  const projectCwd = npath.fromPortablePath(project.cwd);

  function passthrough(
    workspace: Workspace,
    filterKey: string,
    propName?: keyof Workspace
  ) {
    const filter = filters[`--${filterKey}`];
    const workspacePath = workspace.path;
    const { manifest } = project.getWorkspaceByCwd(
      npath.toPortablePath(workspacePath) as PortablePath
    );

    if (typeof filter === 'undefined') {
      return true;
    }

    if (filterKey === 'node-linker') {
      const filterValue = filter.value as string[];
      if (!filterValue.length) return true;
      const isPnp = filterValue.includes('pnp');
      const rcLocation = path.join(workspacePath, '.yarnrc.yml');
      if (fs.existsSync(rcLocation)) {
        const doc = YAML.parseDocument(fs.readFileSync(rcLocation, 'utf-8'));
        const value = doc.get('nodeLinker') as string;
        return (
          filterValue.includes(value) || (typeof value === 'undefined' && isPnp)
        );
      }
      return isPnp;
    }

    if (filterKey === 'turbo-only') {
      if (filter.value === false) return true;
      const { devDependencies } = manifest;
      const dependencies = devDependencies.values();
      for (const dependency of dependencies) {
        if (dependency.name === 'turbo') {
          return true;
        }
      }
      return false;
    }

    if (filterKey === 'storybook') {
      if (filter.value === false) return true;
      const storybookPath = path.join(workspacePath, '.storybook');
      if (!fs.existsSync(storybookPath)) return false;
      return fs
        .readdirSync(storybookPath, { withFileTypes: true })
        .some(
          (entry) => entry.isFile() && storybookMainMatcher.test(entry.name)
        );
    }

    if (
      filter.value === '' ||
      typeof filter.value === 'undefined' ||
      (filter.value instanceof Array && filter.value.length === 0)
    ) {
      return true;
    }

    if (typeof propName === 'undefined') return false;

    if (typeof filter.matcher !== 'undefined') {
      return (filter.matcher as Tester).test(workspace[propName]);
    }

    return filter.value === workspace[propName];
  }

  function format<T>(workspaces: Workspace[]): T | Workspace[] {
    let result;
    for (const formatter of Object.values(formatters)) {
      result = formatter.mapper(formatter.value)(result ?? workspaces);
    }
    return result ?? workspaces;
  }

  const listArgs = ['--json'];
  if (noPrivate === true) {
    listArgs.push('--no-private');
  }
  if (since === true) {
    listArgs.push('--since');
  }
  const { stdout } = await exec(`yarn workspaces list ${listArgs.join(' ')}`);

  const workspaces: Workspace[] =
    stdout === ''
      ? []
      : stdout
          .trim()
          .split('\n')
          .reduce((list: Workspace[], line) => {
            const { location, ...rest }: Pick<Workspace, 'location' | 'name'> =
              JSON.parse(line);
            const workspace: Workspace = {
              ...rest,
              location,
              path: path.resolve(projectCwd, location)
            };
            const keep =
              true &&
              passthrough(workspace, 'include', 'location') &&
              passthrough(workspace, 'exclude', 'location') &&
              passthrough(workspace, 'name', 'name') &&
              passthrough(workspace, 'node-linker') &&
              passthrough(workspace, 'turbo-only') &&
              passthrough(workspace, 'storybook');
            return keep ? [workspace, ...list] : list;
          }, []);

  return format<T>(workspaces);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await getWorkspaces()));
}

export default getWorkspaces;
