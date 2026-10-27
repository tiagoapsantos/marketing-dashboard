import { mkdir, readdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normaliseBasePath, staticHtml } from './static-config.mjs';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function build({ basePath = process.env.BASE_PATH ?? '/', outDir = resolve(root, 'dist') } = {}) {
  basePath = normaliseBasePath(basePath);
  const out = resolve(outDir);
  await mkdir(out, { recursive: true });
  for (const file of await readdir(resolve(root, 'src'))) {
    if (file.endsWith('.html')) await writeFile(resolve(out, file), staticHtml(await readFile(resolve(root, 'src', file), 'utf8'), basePath), 'utf8');
    else await copyFile(resolve(root, 'src', file), resolve(out, file));
  }
  const notFound = '<!doctype html><html lang="pt-PT"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página não encontrada — PRISMA</title><link rel="stylesheet" href="/styles.css"></head><body><main><h1>Página não encontrada</h1><p>Este endereço não existe.</p><a href="/">Regressar ao dashboard</a></main></body></html>';
  await writeFile(resolve(out, '404.html'), staticHtml(notFound, basePath), 'utf8');
  await writeFile(resolve(out, '.nojekyll'), '', 'utf8');
  console.log('Build concluído: dashboard estático, módulos, estilos e página 404. Prefixo: ' + basePath);
  return out;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
