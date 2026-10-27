import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

let count = 0;
function compress(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { compress(file); continue; }
    if (!/\.(html|css|js|svg|xml)$/.test(file)) continue;
    const source = readFileSync(file);
    if (source.length < 1024) continue;
    writeFileSync(file + '.br', brotliCompressSync(source, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }));
    writeFileSync(file + '.gz', gzipSync(source, { level: 9 }));
    count++;
  }
}
compress('dist');
console.log(`Prepared Brotli and gzip alternatives for ${count} static files.`);
