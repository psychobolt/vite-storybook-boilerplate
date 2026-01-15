import path from "path";
import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => ({
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "prop-types": "./node_modules/prop-types",
    },
  },
});

console.log(path.resolve());

export default nextConfig;
