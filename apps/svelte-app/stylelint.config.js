import path from 'path';

function getQualifiedModule(moduleId) {
	return process.env.PROJECT_CWD
		? moduleId
		: path.join(process.cwd(), 'packages/third-party/node_modules', ...arguments);
}

/** @type {import('stylelint').Config} */

export default {
	extends: [getQualifiedModule('commons/esm/stylelint.config')]
};
