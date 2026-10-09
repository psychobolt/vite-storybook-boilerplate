import next from 'next';
import { startServer } from 'commons/esm/bin/http-server.js';

const app = next({ dev: false });
const handle = app.getRequestHandler();

await app.prepare();

await startServer({ handler: (req, res) => handle(req, res) });
