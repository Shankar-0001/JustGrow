// Resolve only published pages. Unknown paths must remain 404 rather than
// redirecting arbitrary URLs to the homepage or exposing a build directory.
export function canonicalPagePath(requestPath: string, routes: ReadonlySet<string>): string | null {
  if (!requestPath.startsWith('/')) return null;
  const normalized = requestPath.toLowerCase().replace(/\/{2,}/g, '/').replace(/\/index\.html\/?$/, '/');
  if (!/^\/[a-z0-9/-]*$/.test(normalized)) return null;
  const candidate = normalized === '/' ? '/' : normalized.replace(/\/+$/, '') + '/';
  return routes.has(candidate) ? candidate : null;
}
