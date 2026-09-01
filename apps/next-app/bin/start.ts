import { readFileSync } from 'node:fs';
import { createServer } from 'node:https';
import { resolve } from 'node:path';
import next from 'next';

const port = Number(process.env.PORT ?? 3000);
const certificatePath = resolve(
	process.cwd(),
	process.env.HTTPS_CERT_PATH ?? '../../cert/dev-cert.pem'
);
const keyPath = resolve(
	process.cwd(),
	process.env.HTTPS_KEY_PATH ?? '../../cert/dev-key.pem'
);
const app = next({ dev: false });
const handle = app.getRequestHandler();

await app.prepare();

createServer(
	{
		key: readFileSync(keyPath),
		cert: readFileSync(certificatePath)
	},
	(req, res) => handle(req, res)
).listen(port, () => {
	console.log(
		`> Server listening at ${process.env.APP_URL ?? `https://localhost:${port}`}`
	);
});
