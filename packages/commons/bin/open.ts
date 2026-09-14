import arg from 'arg';
import open from 'open';
import waitOn from 'wait-on';

async function waitForUrl(url: string, strictSSL: boolean): Promise<void> {
  const parsedUrl = new URL(url);

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error(`Unsupported URL protocol: ${parsedUrl.protocol}`);
  }

  await waitOn({
    resources: [url],
    timeout: 30000,
    httpTimeout: 5000,
    simultaneous: 1,
    strictSSL
  });
}

async function run(url: string, strictSSL: boolean): Promise<void> {
  try {
    await waitForUrl(url, strictSSL);
    await open(url);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`> Unable to open ${url}: ${message}`);
  }
}

if (import.meta.main) {
  const parsedArgs = arg({
    '--strict-ssl': Boolean
  });

  const [url] = parsedArgs._;

  if (!url) {
    throw new Error('A URL is required.');
  }

  await run(url, parsedArgs['--strict-ssl'] === true);
}
