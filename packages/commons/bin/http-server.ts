import { once } from 'node:events';
import {
  createServer as createHttpServer,
  type RequestListener
} from 'node:http';
import {
  createServer as createHttpsServer,
  type ServerOptions as HttpsServerOptions
} from 'node:https';
import { resolve } from 'node:path';
import { styleText } from 'node:util';

import arg from 'arg';
import cors from 'cors';
import sirv from 'sirv';

import { readFileFromCwd } from './utils/functions.js';

const cliArgs = process.argv.slice(2);
const separatorIndex = cliArgs.indexOf('--');

// Workspace scripts can forward their argument separator into this CLI.
if (separatorIndex !== -1) cliArgs.splice(separatorIndex, 1);

const args = arg(
  {
    '--port': Number,
    '-p': '--port',
    '--cors': Boolean,
    '--silent': Boolean,
    '-s': '--silent'
  },
  { argv: cliArgs }
);

interface Options {
  handler?: RequestListener;
  directory?: string;
  port?: number;
  silent?: boolean;
  cors?: boolean;
}

export async function startServer({
  directory = args._[0] ?? '.',
  port = args['--port'] ?? Number(process.env.PORT ?? 8080),
  silent = args['--silent'] ?? false,
  cors: enableCors = args['--cors'] ?? false,
  ...options
}: Options = {}) {
  const certificatePath = process.env.HTTPS_CERT_PATH ?? '';
  const keyPath = process.env.HTTPS_KEY_PATH ?? '';

  let httpsOptions: HttpsServerOptions | undefined;
  if (certificatePath || keyPath) {
    const [cert, key] = await Promise.all([
      readFileFromCwd(certificatePath),
      readFileFromCwd(keyPath)
    ]);
    httpsOptions = { cert, key };
  }

  const handler = options.handler ?? sirv(resolve(directory));

  const corsHandler = enableCors
    ? cors({
        origin: /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        credentials: true,
        methods: ['GET', 'HEAD', 'OPTIONS'],
        maxAge: 600
      })
    : undefined;
  const requestHandler: RequestListener = (req, res) => {
    if (!silent) {
      const requestDate = new Date();
      res.once('finish', () => {
        const request = `"${req.method} ${req.url ?? '/'}"`;

        if (res.statusCode >= 400) {
          console.error(
            `[${requestDate}] ${styleText('red', `${request} Error (${res.statusCode}): "${res.statusMessage}"`, { stream: process.stderr })}`
          );
        } else {
          console.log(
            `[${requestDate}] ${styleText('cyan', request)} "${req.headers['user-agent'] ?? ''}"`
          );
        }
      });
    }

    if (corsHandler) {
      corsHandler(req, res, () => handler(req, res));
    } else {
      handler(req, res);
    }
  };
  const server = httpsOptions
    ? createHttpsServer(httpsOptions, requestHandler)
    : createHttpServer(requestHandler);

  server.listen(port, '0.0.0.0');

  await once(server, 'listening');

  if (!silent) {
    console.log(
      `> Server listening at ${httpsOptions ? 'https' : 'http'}://127.0.0.1:${port}`
    );
  }

  return server;
}

if (import.meta.main) {
  await startServer();
}
