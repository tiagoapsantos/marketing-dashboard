import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import { createServer } from '../scripts/serve.mjs';
import { root, build } from '../scripts/build.mjs';
import { normaliseBasePath } from '../scripts/static-config.mjs';
let server, base, projectServer, projectBase, testRoot;
before(async () => {
  testRoot = await mkdtemp(join(tmpdir(), 'prisma-static-test-'));
  const directory = await build({ basePath:'/', outDir:resolve(testRoot, 'root') });
  const project = await build({ basePath:'/marketing-dashboard/', outDir:resolve(testRoot, 'project/marketing-dashboard') });
  await copyFile(resolve(project, '404.html'), resolve(testRoot, 'project/404.html'));
  server = createServer(directory);
  // Subpasta física, servida sem reescritas específicas do dashboard.
  projectServer = createServer(resolve(testRoot, 'project'));
  for (const instance of [server, projectServer]) await new Promise(r => instance.listen(0, '127.0.0.1', r));
  base = 'http://127.0.0.1:' + server.address().port;
  projectBase = 'http://127.0.0.1:' + projectServer.address().port;
});
after(async () => {
  for (const instance of [server, projectServer]) if (instance) { instance.closeAllConnections(); await new Promise(r => instance.close(r)); }
  if (testRoot && resolve(testRoot).startsWith(resolve(tmpdir()) + sep) && testRoot.split(sep).at(-1).startsWith('prisma-static-test-')) await rm(testRoot, {recursive:true});
});

test('dashboard e módulos importados estão acessíveis com MIME correcto', async () => {
  for (const site of [base + '/', projectBase + '/marketing-dashboard/']) {
    const r = await fetch(site); assert.equal(r.status, 200);
    const html = await r.text(); assert.match(html, /lang="pt-PT"/); assert.equal((html.match(/<h1/g) || []).length, 1);
    assert.match(html, /http-equiv="Content-Security-Policy"/); assert.match(html, /connect-src 'none'/);
    for (const file of ['app.js','data.js','metrics.js','format.js','csv.js','charts.js','view.js']) {
      const response = await fetch(site + file); assert.equal(response.status, 200); assert.match(response.headers.get('content-type'), /javascript/);
      const js = await response.text();
      for (const [, imported] of js.matchAll(/from ['"]([^'"]+)['"]/g)) { const dependency = new URL(imported, site + file); assert.ok(dependency.href.startsWith(site)); assert.equal((await fetch(dependency)).status, 200); }
    }
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) if (!href.startsWith('#')) {
      const url = new URL(href, site); assert.ok(url.href.startsWith(site), href); assert.equal((await fetch(url)).status, 200, href);
    }
    assert.equal((await fetch(site + '.nojekyll')).status, 200);
  }
});

test('404, bloqueio de caminhos e recusa de envio', async () => {
  assert.equal((await fetch(base + '/unknown')).status, 404);
  assert.equal((await fetch(base + '/package.json')).status, 404);
  const traversal = await fetch(base + '/%2e%2e%5cpackage.json');
  assert.ok([403,404].includes(traversal.status));
  assert.doesNotMatch(await traversal.text(), /"name"\s*:\s*"prisma-marketing-dashboard"/);
  assert.equal((await fetch(base + '/', {method:'POST'})).status, 405);
  const head = await fetch(base + '/', {method:'HEAD'}); assert.equal(await head.text(), ''); assert.match(head.headers.get('content-security-policy'), /connect-src 'none'/);
  const missing = await fetch(projectBase + '/marketing-dashboard/inexistente/profundo/'); assert.equal(missing.status, 404);
  const html = await missing.text(); assert.match(html, /href="\/marketing-dashboard\/"/);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) assert.equal((await fetch(projectBase + href)).status, 200);
  assert.equal(normaliseBasePath('/marketing-dashboard'), '/marketing-dashboard/');
  for (const value of ['https://example.com/','//example.com/','/../','/x?y=1','/x#hash','/x"/>']) assert.throws(() => normaliseBasePath(value));
});

test('cliente sem recolha, envio ou armazenamento e formulário com labels', async () => {
  const js = await readFile(resolve(root, 'src/app.js'), 'utf8'); assert.doesNotMatch(js, /\bfetch\(|XMLHttpRequest|localStorage|sessionStorage/);
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  for (const field of ['start','end','channel','campaign','status']) assert.ok(html.includes('for="' + field + '"'));
  assert.match(html, /role="alert"/); assert.match(html, /aria-live="polite"/); assert.match(html, /Dados fictícios/);
});
