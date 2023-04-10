import { execa } from 'execa';
import arg from 'arg';
import globToRegExp from 'glob-to-regexp';

type Args = {
  [key: string]: string
};

type Filters = {
  [key: string]: Filter
};

type Matcher = (value: string) => RegExp;

type Filter = {
  alias: string,
  type: any,
  value: string,
  matcher?: RegExp | Matcher
};

type Workspace = {
  name: string,
  location: string
};

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
};

const { _, ...args } = arg(
  Object.entries(filters).reduce(
    (config, [key, { alias, type }]) => ({
      [key]: type,
      [alias]: key,
      ...config
    }),
    {}
  )
);

Object.entries(args as Args).forEach(([key, value]) => {
  const filter = filters[key];
  if (filter) {
    filter.value = value;
    if (filter.matcher) {
      filter.matcher = (filter.matcher as Matcher)(value); 
    }
  }
});

const { stdout } = await execa('yarn', ['workspaces', 'list', '--json']);

const passthrough = (workspace: Workspace, key) => {
  const filter = filters[`--${key}`];
  return filter && filter.value
  ? (filter.matcher && (filter.matcher as RegExp).test(workspace[key])) || filter.value === workspace[key]
  : true;
};

const workspaces = stdout.split('\n')
  .reduce((list, line) => {
    const workspace: Workspace = JSON.parse(line);
    const keep = true
      && passthrough(workspace, 'location') 
      && passthrough(workspace, 'name');
    return keep ? [
      workspace,
      ...list
    ] : list;
  }, []);

console.log(workspaces);
