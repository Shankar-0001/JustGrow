// Use the same decision for generated HTML/sitemaps and production HTTP headers.
// NODE_ENV alone is not sufficient: Vercel preview builds also use production mode.
export function isSiteIndexable(env: Record<string, string | undefined> = process.env): boolean {
  const deployment = env.VERCEL_TARGET_ENV || env.VERCEL_ENV;
  if (deployment && deployment !== 'production') return false;
  if (env.SITE_INDEXABLE === 'false') return false;
  if (env.SITE_INDEXABLE === 'true') return true;
  return deployment === 'production';
}
