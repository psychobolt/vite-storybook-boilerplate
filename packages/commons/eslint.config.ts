import path from "path";
import { fileURLToPath } from "url";
import type { Linter } from "eslint";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";

type Config = Linter.FlatConfig;

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: _filename,
  resolvePluginsRelativeTo: _dirname,
});

const tsConfigs: Config[] = compat.extends("standard-with-typescript");

const config: Config[] = [
  ...tsConfigs.map((tsConfig) => ({
    files: ["**/*.ts", "**/*.tsx"],
    ...tsConfig,
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: process.env.INIT_CWD,
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNullableBoolean: true,
          allowNullableString: true,
          allowAny: true,
        },
      ],
    },
  },
  ...compat.extends("standard-jsx"),
  ...compat.extends("standard-react"),
  ...compat.extends("plugin:mdx/recommended"),
  {
    files: ["**/*.mdx"],
    rules: {
      "react/self-closing-comp": 0,
      "no-unused-expressions": 0,
    },
  },
  ...compat.extends("prettier"),
  {
    ignores: [
      ".turbo/",
      ".yarn/**/*",
      "!.yarn/plugins/*",
      "dist/",
      "esm/",
      "cjs/",
      "coverage/",
      "node_modules/",
      "storybook-static/",
      ".pnp.cjs",
      ".pnp.loader.mjs",
    ],
  },
];

export default config;
