import fs from "fs";
import { fileURLToPath } from "url";
import process from "process";
import { execa, execaSync } from "execa";
import arg from "arg";
import globToRegExp from "glob-to-regexp";
import YAML from "yaml";

type Options = Record<string, any>;

const invalidFilterExpression = /^[.*]$/g;

const filters: Filters = {
  "--location": {
    alias: "-l",
    type: String,
    value: "",
    matcher: globToRegExp,
  },
  "--name": {
    alias: "-n",
    type: String,
    value: "",
    matcher: RegExp,
  },
  "--filter": {
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
        [],
      );
      return {
        test: (value: string) =>
          matchers.reduce((prev, matcher) => prev && matcher.test(value), true),
      };
    },
  },
  "--node-linker": {
    key: "nodeLinker",
    type: String,
    value: "",
  },
  "--no-private": {
    key: "noPrivate",
    type: Boolean,
    value: "",
  },
};

function getFormatter(type: string): Mapper<any> {
  switch (type) {
    case "semver":
      return (workspaces: Workspace[]) =>
        workspaces.reduce(
          (result, workspace) => ({
            ...result,
            [workspace.name]: execaSync("yarn", [
              "workspace",
              workspace.name,
              "exec",
              "echo $npm_package_version",
            ]).stdout,
          }),
          {},
        );
    default:
      return (_, result) => result;
  }
}

const formatters: Formatters = {
  "--format": {
    key: "format",
    type: [String],
    mapper: (formatters) => (workspaces) =>
      formatters.reduce(
        (result, formatter) => getFormatter(formatter)(workspaces, result),
        workspaces,
      ),
    value: [],
  },
};

const specEntries = Object.entries({ ...filters, ...formatters });

async function getWorkspaces<T>(options?: Options) {
  const { _, ...args } = arg<Args>(
    specEntries.reduce(
      (config, [key, { alias, type }]) => ({
        [key]: type,
        ...(alias ? { [alias]: key } : undefined),
        ...config,
      }),
      {},
    ),
    { permissive: true },
  );

  if (options) {
    function updateArg(key: keyof Args, value: any) {
      if (!(key in args)) {
        args[key] = value;
      }
    }

    Object.entries(options).forEach(([option, value]) => {
      const entry = specEntries.find(([_, { key }]) => key === option);
      if (typeof entry !== "undefined") {
        updateArg(entry[0], value);
      }
    });
  }

  Object.entries(args).forEach(([key, value]) => {
    const filter: Filter = filters[key];
    if (typeof filter !== "undefined") {
      filter.value = value;
      if (filter.matcher) {
        filter.matcher = (filter.matcher as Matcher)(value);
      }
    }
    const formatter: Formatter = formatters[key];
    if (typeof formatter !== "undefined") {
      formatter.value = value;
    }
  });

  const noPrivate = filters["--no-private"].value;

  const passthrough = (
    workspace: Workspace,
    filterKey: string,
    propName?: keyof Workspace,
  ) => {
    const filter = filters[`--${filterKey}`];

    if (typeof filter === "undefined") {
      return true;
    }

    if (filterKey === "node-linker") {
      if (filter.value === "") return true;
      const isPnp = filter.value === "pnp";
      const rcLocation = `${workspace.location}/.yarnrc.yml`;
      if (fs.existsSync(rcLocation)) {
        const doc = YAML.parseDocument(
          fs.readFileSync(`${workspace.location}/.yarnrc.yml`, "utf-8"),
        );
        const value = doc.get("nodeLinker");
        return (
          value === filter.value || (typeof value === "undefined" && isPnp)
        );
      }
      return isPnp;
    }

    return (filter.value ?? false) !== true ||
      (filter.value instanceof Array && filter.value.length === 0)
      ? true
      : filter.matcher &&
          propName &&
          ((filter.matcher as RegExp).test(workspace[propName]) ||
            filter.value === workspace[propName]);
  };

  const format = (workspaces: Workspace[]) => {
    return Object.values(formatters).reduce(
      (result, formatter) =>
        formatter.mapper(formatter.value)(workspaces, result),
      workspaces,
    );
  };

  const listArgs = ["--json"];
  if (noPrivate === true) {
    listArgs.push("--no-private");
  }
  const { stdout } = await execa("yarn", ["workspaces", "list", ...listArgs]);

  const workspaces: Workspace[] =
    stdout === ""
      ? []
      : stdout.split("\n").reduce((list: Workspace[], line) => {
          const workspace: Workspace = JSON.parse(line);
          const keep =
            true &&
            passthrough(workspace, "location", "location") &&
            passthrough(workspace, "name", "name") &&
            passthrough(workspace, "filter", "name") &&
            passthrough(workspace, "node-linker");
          return keep ? [workspace, ...list] : list;
        }, []);

  return format(workspaces) as T;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await getWorkspaces()));
}

export default getWorkspaces;
