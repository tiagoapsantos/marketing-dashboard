export function normaliseBasePath(value = '/') {
  if (typeof value !== 'string' || (value !== '/' && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\/?$/.test(value))) throw new Error('BASE_PATH deve ser / ou um caminho como /marketing-dashboard/.');
  return value.endsWith('/') ? value : value + '/';
}

export const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'";

export function staticHtml(html, basePath = '/') {
  const base = normaliseBasePath(basePath);
  return html.replace(/<meta charset="UTF-8">/, '<meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="' + contentSecurityPolicy + '">')
    .replace(/\b(href|src|action)="\/([^"]*)"/g, (_, attribute, suffix) => attribute + '="' + base + suffix + '"');
}
