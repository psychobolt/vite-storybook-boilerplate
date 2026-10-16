import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import commonConfig from 'commons/esm/eslint.config.js';

const tsFiles = ['src/**/*.ts'];
const svelteFiles = ['**/*.svelte'];

export default defineConfig(
	commonConfig,
	{
		files: [...tsFiles, ...svelteFiles],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020,
				extraFileExtensions: ['.svelte'],
				warnOnUnsupportedTypeScriptVersion: false
			},
			globals: {
				...globals.browser,
				...globals.es2017,
				...globals.node
			}
		}
	},
	{
		files: svelteFiles,
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
		plugins: {
			'@typescript-eslint': tseslint.plugin
		},
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				warnOnUnsupportedTypeScriptVersion: false
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_$' }]
		}
	},
	eslintPluginSvelte.configs.recommended,
	eslintPluginSvelte.configs.prettier,
	{
		rules: {
			'package-json/valid-devDependencies': 0
		}
	},
	globalIgnores(['.svelte-kit/', '.vercel/', '.wrangler/'])
);
