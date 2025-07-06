import crypto from 'node:crypto';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

if (process.env.NODE_TRANSFORM === 'typescript') {
  process.features.typescript = 'transform';
}

if (!crypto.hash) {
  crypto.hash = (algorthm, data, outputEncoding) =>
    crypto.createHash(algorthm).update(data).digest(outputEncoding);
}

register(process.env.ESM_REGISTER, pathToFileURL('./').toString());
