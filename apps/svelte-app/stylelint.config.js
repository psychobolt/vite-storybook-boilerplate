import path from 'path';

function getQualifiedModule(moduleId) {
	return process.env.PROJECT_CWD
		? moduleId
		: path.join(process.cwd(), 'packages/third-party/node_modules', moduleId);
}

/** @type {import('stylelint').Config} */
const config = {
	extends: [getQualifiedModule('commons/esm/stylelint.config')]
};

export default config;
