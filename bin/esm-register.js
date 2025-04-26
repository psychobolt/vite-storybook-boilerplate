import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

if (process.env.NODE_TRANSFORM === 'typescript') {
  process.features.typescript = 'transform';
}

register(process.env.ESM_REGISTER, pathToFileURL('./').toString());
