import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';

// Negotiate only generated static files. Personal API responses are never compressed here.
export function sendStatic(req: Request, res: Response, file: string, immutable = false) {
  res.vary('Accept-Encoding');
  res.type(path.extname(file));
  res.setHeader('Cache-Control', immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate');
  const supported = ['br', 'gzip'].filter(encoding => existsSync(file + (encoding === 'br' ? '.br' : '.gz')));
  const encoding = req.acceptsEncodings(...supported, 'identity');
  if (!encoding) return res.status(406).end();
  if (encoding === 'br' || encoding === 'gzip') {
    res.setHeader('Content-Encoding', encoding);
    return res.sendFile(file + (encoding === 'br' ? '.br' : '.gz'));
  }
  return res.sendFile(file);
}

export function assertIndexingMode(build: { indexable: boolean }, runtimeIndexable: boolean) {
  if (build.indexable !== runtimeIndexable) {
    throw new Error('SITE_INDEXABLE differs between the build and runtime. Rebuild with the intended setting before starting the server.');
  }
}
