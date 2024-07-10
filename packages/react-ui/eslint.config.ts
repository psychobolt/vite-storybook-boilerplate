import commonConfig, { tseslint, jsxRuntime } from 'commons/esm/eslint.config';

export default tseslint.config(...commonConfig, jsxRuntime);
