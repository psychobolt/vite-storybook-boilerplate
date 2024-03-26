import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import type { TSESLint } from "@typescript-eslint/utils";
import * as mdx from "eslint-plugin-mdx";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export type Config = TSESLint.FlatConfig.ConfigArray;

export type Plugin = TSESLint.FlatConfig.Plugin;

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

export const compat = new FlatCompat({
  baseDirectory: _filename,
  resolvePluginsRelativeTo: _dirname,
});

const config: Config = [
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    extends: compat.extends("love"),
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
  }),
  ...tseslint.config({
    files: ["**/*.{cj,j}s"],
    extends: compat.extends("standard"),
  }),
  ...tseslint.config({
    files: ["**/*.jsx"],
    extends: [
      ...compat.extends("standard-jsx"),
      ...compat.extends("standard-react"),
    ],
  }),
  mdx.flat,
  mdx.flatCodeBlocks,
  eslintConfigPrettier,
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
