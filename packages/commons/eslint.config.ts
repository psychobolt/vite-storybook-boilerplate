import path from "path";
import { fileURLToPath } from "url";
import type { Linter } from "eslint";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";

type Config = Linter.FlatConfig;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __filename,
  resolvePluginsRelativeTo: __dirname,
});

const config: Config[] = [
  ...compat.extends("standard-with-typescript"),
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
      "@typescript-eslint/semi": ["error", "always"],
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/no-confusing-void-expression": 0, // TODO: remove when https://github.com/storybookjs/testing-library/issues/10 is resolved
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
      ".yarn/",
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
