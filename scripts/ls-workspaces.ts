import fs from 'fs';
import { execa } from 'execa';
import arg from 'arg';
import globToRegExp from 'glob-to-regexp';

export type Workspace = {
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

  if (!filter) {
    return true;
  }

  if (filter.value && key === 'node-modules') {
    const rcLocation = `${workspace.location}/.yarnrc.yml`;
    if (fs.existsSync(rcLocation)) {
      const contents = fs.readFileSync(`${workspace.location}/.yarnrc.yml`, 'utf-8').split('\n');
      const re = /^nodeLinker: node-modules$/;
      return contents.find(line => re.test(line)) ? true : false;
    }
    return false;
  }
  
  return filter.value
    ? (filter.matcher && (filter.matcher as RegExp).test(workspace[key])) || filter.value === workspace[key]
    : true;
};

const workspaces = stdout.split('\n')
  .reduce((list, line) => {
    const workspace: Workspace = JSON.parse(line);
    const keep = true
      && passthrough(workspace, 'location')
      && passthrough(workspace, 'name')
      && passthrough(workspace, 'node-modules');
    return keep ? [
      workspace,
      ...list
    ] : list;
  }, []);

console.log(JSON.stringify(workspaces));
