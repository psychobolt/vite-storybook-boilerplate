import path from "path";

function getQualifiedModule(moduleId) {
  return process.env.PROJECT_CWD
    ? moduleId
    : path.join(
        process.cwd(),
        "packages/third-party/node_modules",
        ...arguments,
      );
}

/** @type {import('stylelint').Config} */
export default {
  extends: [getQualifiedModule("commons/esm/stylelint.config")],
  rules: {
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)(--?[a-z0-9]+)*$",
      {
        message: (selector) =>
          `Expected class selector "${selector}" to be kebab-case`,
      },
    ],
  },
};
