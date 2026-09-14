import { resolveConfig } from 'commons/esm/lint-staged.config.js';

export default resolveConfig(import.meta.dirname)();
