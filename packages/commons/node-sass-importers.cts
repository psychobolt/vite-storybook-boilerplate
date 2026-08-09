import pnpImporter from 'pnp-sass-importer';
import type { Importer } from 'sass';

const importers: Importer[] = [pnpImporter(process.cwd())];

export default importers;
