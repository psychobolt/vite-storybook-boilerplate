import prettierPluginSvelte from 'prettier-plugin-svelte';

/** @type {import('prettier').Options} */
export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: [prettierPluginSvelte],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
