import { createRequire } from 'module';
import path from 'path';

const require = createRequire(
	process.env.INIT_CWD
		? import.meta.url
		: path.join(process.cwd(), 'packages/third-party/node_modules')
);

/** @type {import('stylelint').Config} */
const config = {
	extends: [
		require.resolve('stylelint-config-standard-scss'),
		require.resolve('stylelint-config-prettier-scss')
	],
	allowEmptyInput: true
};

export default config;
