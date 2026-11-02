import { readFileSync, writeFileSync } from 'node:fs';

// Partytown 1.0.3 skips HTMLFencedFrameElement, but still reads window.fence
// while discovering browser interfaces. Chrome deprecates that getter too.
// Extend the existing exclusion list rather than changing browser globals.
// Revisit this narrow compatibility patch when updating the pinned package.
const original = '"setAttributionReporting","HTMLFencedFrameElement"]';
const replacement = '"setAttributionReporting","HTMLFencedFrameElement","fence","Fence","FencedFrameConfig"]';
for (const name of ['partytown-sw.js', 'partytown-atomics.js', 'partytown-sandbox-sw.html']) {
  const file = `dist/~partytown/${name}`;
  const source = readFileSync(file, 'utf8');
  if (source.split(original).length !== 2) {
    throw new Error(`Review the Partytown compatibility patch: unexpected exclusions in ${name}`);
  }
  writeFileSync(file, source.replace(original, replacement));
}
