import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import child_process from 'node:child_process';
import util from 'node:util';
import arg from 'arg';
import globToRegExp from 'glob-to-regexp';
import YAML from 'yaml';
import { type PortablePath, npath } from '@yarnpkg/fslib';
import { Configuration, Project } from '@yarnpkg/core';

const { execSync } = child_process;
const exec = util.promisify(child_process.exec);
const invalidFilterExpression = /^[.*]$/g;

const filters: Filters = {
  '--location': {
    alias: '-l',
    type: String,
    value: '',
    matcher: globToRegExp
  },
  '--name': {
    alias: '-n',
    type: String,
    value: '',
    matcher: RegExp
  },
  '--filter': {
    type: [String],
    value: [],
    matcher: (expressions = []) => {
      const matchers = (expressions as string[]).reduce(
        (list: RegExp[], expression) => {
          if (invalidFilterExpression.test(expression)) {
            return list;
          }
          return [...list, globToRegExp(expression)];
        },
        []
      );
      return {
        test: (value: string) =>
          matchers.reduce((prev, matcher) => prev && matcher.test(value), true)
      };
    }
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

const formatters: Formatters = {
  '--format': {
    key: 'format',
    type: [String],
    mapper: (formatters) => (workspaces) =>
      formatters.reduce(
        (result, formatter) => getFormatter(formatter)(workspaces, result),
        workspaces
      ),
    value: []
  }
};

const specEntries = Object.entries({ ...filters, ...formatters });

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

async function getWorkspaces<T>(options?: Options) {
  const { _ = [], ...args } = arg<Args>(
    specEntries.reduce(
      (config, [key, { alias, type }]) => ({
        [key]: type,
        ...(alias ? { [alias]: key } : undefined),
        ...config
      }),
      {}
    ),
    { permissive: true }
  );

  if (options) {
    function updateArg(key: keyof Args, value: any) {
      if (!(key in args)) {
        args[key] = value;
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
      formatter.value = value;
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
  const PROJECT = await setupProject();

  function passthrough(
    workspace: Workspace,
    filterKey: string,
    propName?: keyof Workspace
  ) {
    const filter = filters[`--${filterKey}`];
    const { manifest } = PROJECT.getWorkspaceByCwd(
      workspace.location as PortablePath
    );

    if (typeof filter === 'undefined') {
      return true;
    }

    if (filterKey === 'node-linker') {
      const filterValue = filter.value as string[];
      if (!filterValue.length) return true;
      const isPnp = filterValue.includes('pnp');
      const rcLocation = `${workspace.location}/.yarnrc.yml`;
      if (fs.existsSync(rcLocation)) {
        const doc = YAML.parseDocument(
          fs.readFileSync(`${workspace.location}/.yarnrc.yml`, 'utf-8')
        );
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

  const format = (workspaces: Workspace[]) => {
    return Object.values(formatters).reduce(
      (result, formatter) =>
        formatter.mapper(formatter.value)(workspaces, result),
      workspaces
    );
  };

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
            const workspace: Workspace = JSON.parse(line);
            const keep =
              true &&
              passthrough(workspace, 'location', 'location') &&
              passthrough(workspace, 'name', 'name') &&
              passthrough(workspace, 'filter', 'name') &&
              passthrough(workspace, 'node-linker') &&
              passthrough(workspace, 'turbo-only');
            return keep ? [workspace, ...list] : list;
          }, []);

  return format(workspaces) as T;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await getWorkspaces()));
}

export default getWorkspaces;
