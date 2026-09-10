import path from 'path';
import type { NextConfig } from 'next';

const nextConfig = async (): Promise<NextConfig> => ({
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve('../../'),
  turbopack: {
    resolveAlias: {
      // turbopack doesn't detect symlink modules, related to Yarn/pnpm limitation: https://github.com/vercel/next.js/issues/93556
      'prop-types': './node_modules/prop-types'
    }
  }
});

export default nextConfig;
