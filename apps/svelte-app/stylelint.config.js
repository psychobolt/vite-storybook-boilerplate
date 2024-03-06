import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

function getAbsolutePath(moduleId) {
	return process.env.PROJECT_CWD
		? require.resolve(moduleId)
		: path.join(process.cwd(), 'packages/third-party/node_modules', ...arguments);
}

/** @type {import('stylelint').Config} */

export default {
	extends: [getAbsolutePath('commons/esm/stylelint.config')]
};
