import commonConfig, {
  tseslint,
  jsxRuntime
} from 'commons/esm/eslint.config.js';

export default tseslint.config(...commonConfig, jsxRuntime);
