import arg from 'arg';
import open from 'open';
import waitOn from 'wait-on';

if (import.meta.main) {
  const { _, ...flags } = arg({
    '--strict-ssl': Boolean
  });
  const [target = `http://127.0.0.1:${process.env.PORT ?? 80}`] = _;

  await waitOn({
    resources: [target],
    timeout: 30000,
    httpTimeout: 5000,
    simultaneous: 1,
    strictSSL: flags['--strict-ssl']
  });

  if (!process.env.CI) await open(target);
}
