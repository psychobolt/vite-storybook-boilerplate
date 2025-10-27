import prettierPluginSvelte from 'prettier-plugin-svelte';
import prettierPluginPackagejson from 'prettier-plugin-packagejson';

/** @type {import('prettier').Options} */
export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [prettierPluginSvelte, prettierPluginPackagejson],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
