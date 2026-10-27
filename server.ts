import express from 'express';
import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { handleLead } from './api/lead-handler';
import { sendStatic, assertIndexingMode } from './api/static-delivery';
import { canonicalPagePath } from './api/page-routing';
import { isSiteIndexable } from './api/indexing';
config({ path: '.env.local', quiet: true });
config({ quiet: true });
async function startServer() {
  const app = express();
  const production = process.env.NODE_ENV === 'production';
  const indexable = isSiteIndexable();
  const port = Number(process.env.PORT || 3000);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '20kb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (!production || !indexable || req.path.replace(/\/+$/, '') === '/thank-you') res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  });
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post('/api/submit-lead', async (req, res) => {
    const result = await handleLead(req.body);
    res.setHeader('Cache-Control', 'no-store');
    res.status(result.status).json(result.body);
  });
  app.all('/api/submit-lead', (_req, res) => res.status(405).set('Allow', 'POST').json({ success: false, error: 'Method not allowed.' }));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
  if (!production) {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve('dist');
    const manifest = JSON.parse(readFileSync(path.join(dist, 'build-manifest.json'), 'utf8'));
    assertIndexingMode(manifest, indexable);
    const pageRoutes = new Set<string>(manifest.routes);
    app.get('/robots.txt', (_req, res) => res.type('text').send(indexable ? 'User-agent: *\nAllow: /\nSitemap: https://www.justgrow.in/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n'));
    app.get('/assets/:file', (req, res, next) => {
      if (!/^[a-zA-Z0-9_-]+\.(js|css)$/.test(req.params.file)) return next();
      const file = path.join(dist, 'assets', req.params.file);
      return existsSync(file) ? sendStatic(req, res, file, true) : next();
    });
    for (const file of ['sitemap.xml', 'favicon.svg', 'share-card.svg', 'share-card.png']) app.get('/' + file, (req, res) => sendStatic(req, res, path.join(dist, file)));
    app.get('*', (req, res) => {
      const route = canonicalPagePath(req.path, pageRoutes);
      if (!route) return sendStatic(req, res.status(404).set('X-Robots-Tag', 'noindex, nofollow'), path.join(dist, '404.html'));
      const file = path.join(dist, route, 'index.html');
      if (existsSync(file)) {
        if (req.path !== route) return res.redirect(308, route + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''));
        return sendStatic(req, res, file);
      }
      return sendStatic(req, res.status(404).set('X-Robots-Tag', 'noindex, nofollow'), path.join(dist, '404.html'));
    });
  }
  app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => res.status(error.status === 413 ? 413 : 400).json({ success: false, error: 'Unable to accept this request.' }));
  app.listen(port, '0.0.0.0', () => console.log('JustGrow: http://localhost:' + port));
}
startServer();
