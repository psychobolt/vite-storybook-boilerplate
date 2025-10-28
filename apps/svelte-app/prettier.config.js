/** @type {import('prettier').Options} */
export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-sh', 'prettier-plugin-packagejson'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			files: ['.*', '*.sh'],
			excludeFiles: ['.*.yml'],
			options: {
				parser: 'sh'
			}
		}
	]
};
