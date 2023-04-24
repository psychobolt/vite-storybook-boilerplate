import fs from 'fs';
import { fileURLToPath } from 'url';
import process from 'process';
import { execa } from 'execa';
import arg from 'arg';
import globToRegExp from 'glob-to-regexp';

type Workspace = {
  name: string,
  location: string
};

const invalidFilterExpression = /^[.*]$/g;

async function getWorkspaces(options?) {
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
      matcher: (expressions: []) => {
        const matchers = expressions.reduce((list, expression) => {
          if (invalidFilterExpression.test(expression)) {
            return list;
          }
          return [...list, globToRegExp(expression)];
        }, []);
        return {
          test: value => matchers.reduce((prev, matcher) => prev && matcher.test(value), true)
        };
      },
    },
    '--node-modules': {
      type: Boolean,
      value: false
    }
  };
  
  const { _, ...args } = arg(
    Object.entries(filters).reduce(
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
    function updateArg(key, value) {
      if (!args[key]) {
        args[key] = value;
      }
    };

    Object.entries(options).forEach(([option, value]) => {
      if (option === 'nodeLinker') {
        updateArg('--node-modules', value === 'node-modules');
      }
    });
  }
  
  Object.entries(args as Args).forEach(([key, value]) => {
    const filter = filters[key];
    if (filter) {
      filter.value = value;
      if (filter.matcher) {
        filter.matcher = (filter.matcher as Matcher)(value);
      }
    }
  });
  
  const passthrough = (workspace: Workspace, filterKey: string, propName?: string) => {
    const filter = filters[`--${filterKey}`];
  
    if (!filter) {
      return true;
    }
  
    if (filter.value && filterKey === 'node-modules') {
      const rcLocation = `${workspace.location}/.yarnrc.yml`;
      if (fs.existsSync(rcLocation)) {
        const contents = fs.readFileSync(`${workspace.location}/.yarnrc.yml`, 'utf-8').split('\n');
        const re = /^nodeLinker: node-modules$/;
        return contents.find(line => re.test(line)) ? true : false;
      }
      return false;
    }
    
    return !filter.value || (filter.value instanceof Array && filter.value.length === 0)
      ? true
      : (filter.matcher && (filter.matcher as RegExp).test(workspace[propName])) || filter.value === workspace[propName];
  };
  
  const { stdout } = await execa('yarn', ['workspaces', 'list', '--json']);
  
  const workspaces: Workspace[] = stdout.split('\n')
    .reduce((list, line) => {
      const workspace: Workspace = JSON.parse(line);
      const keep = true
        && passthrough(workspace, 'location', 'location')
        && passthrough(workspace, 'name', 'name')
        && passthrough(workspace, 'filter', 'name')
        && passthrough(workspace, 'node-modules');
      return keep ? [
        workspace,
        ...list
      ] : list;
    }, []);
  
  return workspaces;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await getWorkspaces()));
}

export default getWorkspaces;
