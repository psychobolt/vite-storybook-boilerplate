/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.env.PROJECT_CWD,
  },
};

module.exports = nextConfig;
