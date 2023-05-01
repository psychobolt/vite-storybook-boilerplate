import commonConfig from 'commons/eslint.config.ts';

export default [
  ...commonConfig,
  {
    ignores: [
      '.turbo/',
      '.yarn/',
      'apps/',
      'packages/',
      '.pnp.cjs',
      '.pnp.loader.mjs'
    ]
  }
];
