import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageName = process.env.npm_package_name || '';
const entry = resolve(__dirname, '/src/index.ts');

export default {
  resolve: {
    alias: {
      [packageName]: entry
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry,
      name: packageName,
      // the proper extensions will be added
      fileName: 'index'
    }
  }
};
