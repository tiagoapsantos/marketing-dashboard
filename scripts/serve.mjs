import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, root } from './build.mjs';
import { normaliseBasePath, contentSecurityPolicy } from './static-config.mjs';
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
export function createServer(directory = resolve(root, 'dist'), { basePath = '/' } = {}) {
  directory = resolve(directory);
  basePath = normaliseBasePath(basePath);
  return http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', contentSecurityPolicy + "; frame-ancestors 'none'");
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); res.end('Method not allowed'); return; }
    try {
      const url = new URL(req.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (basePath !== '/' && pathname === basePath.slice(0, -1)) { res.writeHead(308, {Location:basePath + url.search}); res.end(); return; }
      let target = resolve(directory, pathname.slice(basePath.length));
      if (target !== directory && !target.startsWith(directory + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
      let info;
      if (pathname.startsWith(basePath)) try { info = await stat(target); } catch {}
      if (info?.isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(308, {Location:pathname + '/' + url.search}); res.end(); return; }
        target = resolve(target, 'index.html');
      }
      let body;
      try { if (!pathname.startsWith(basePath)) throw new Error('Outside prefix'); body = await readFile(target); }
      catch { res.statusCode = 404; target = '404.html'; body = await readFile(resolve(directory, '404.html')); }
      res.setHeader('Content-Type', mime[extname(target)] ?? 'application/octet-stream');
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(400); res.end('Bad request'); }
  });
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.includes('--dev')) await build();
  else try { await stat(resolve(root, 'dist/index.html')); } catch { console.error('Execute npm run build primeiro.'); process.exit(1); }
  const port = Number(process.env.PORT || 4174);
  const basePath = normaliseBasePath(process.env.BASE_PATH ?? '/');
  const server = createServer(undefined, { basePath });
  server.on('error', e => { console.error(e.code === 'EADDRINUSE' ? 'Porta ' + port + ' ocupada; defina PORT para usar outra porta.' : e.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log('Local: http://127.0.0.1:' + port + basePath));
}
