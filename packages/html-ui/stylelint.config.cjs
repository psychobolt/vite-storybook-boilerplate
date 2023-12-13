module.exports = {
  extends: ["commons/cjs/stylelint.config"],
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
