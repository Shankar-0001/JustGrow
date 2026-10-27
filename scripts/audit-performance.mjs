// Install audit-only tools with the command documented in docs/AUDIT.md.
import lighthouse from '../.qa/audit-tools/node_modules/lighthouse/core/index.js';
import desktop from '../.qa/audit-tools/node_modules/lighthouse/core/config/desktop-config.js';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const phase = process.argv[2] || 'baseline';
const output = path.resolve('.qa/audit', phase, 'lighthouse');
mkdirSync(output, { recursive: true });
const routeFile = path.resolve('.qa/audit/routes.json');
const inventory = existsSync('dist/build-manifest.json') ? JSON.parse(readFileSync('dist/build-manifest.json', 'utf8')).routes : JSON.parse(readFileSync(routeFile, 'utf8'));
writeFileSync(routeFile, JSON.stringify(inventory, null, 2));
const routes = process.env.AUDIT_ROUTES ? JSON.parse(process.env.AUDIT_ROUTES) : inventory;
const profiles = process.env.AUDIT_PROFILE ? [process.env.AUDIT_PROFILE] : ['mobile', 'desktop'];
const runs = Number(process.env.AUDIT_RUNS || 1);
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9226', `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const results = [];
try {
  for (let i = 0; i < 40; i++) { try { await fetch('http://127.0.0.1:9226/json/version'); break; } catch { await pause(250); } }
  for (const profile of profiles) for (const route of routes) for (let run = 1; run <= runs; run++) {
    const name = `${route === '/' ? 'home' : route.replaceAll('/', '_')}-${profile}${runs > 1 ? '-run' + run : ''}`;
    const file = path.join(output, name + '.json');
    let lhr;
    if (existsSync(file)) lhr = JSON.parse(readFileSync(file, 'utf8'));
    else {
      try {
        const result = await lighthouse('http://127.0.0.1:3100' + route, { port: 9226, logLevel: 'error', output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, profile === 'desktop' ? desktop : undefined);
        lhr = result.lhr;
        writeFileSync(file, JSON.stringify(lhr));
      } catch (error) { results.push({ route, profile, error: String(error) }); console.log(name + ': FAILED ' + error); continue; }
    }
    const metric = id => lhr.audits[id]?.numericValue ?? null;
    results.push({ route, profile, date: lhr.fetchTime, version: lhr.lighthouseVersion, environment: lhr.environment, settings: lhr.configSettings, performance: lhr.categories.performance.score, accessibility: lhr.categories.accessibility.score, seo: lhr.categories.seo.score, lcp: metric('largest-contentful-paint'), cls: metric('cumulative-layout-shift'), fcp: metric('first-contentful-paint'), ttfb: metric('server-response-time'), tbt: metric('total-blocking-time'), bytes: metric('total-byte-weight'), resources: lhr.audits['resource-summary']?.details?.items, issues: Object.entries(lhr.audits).filter(([, a]) => a.score !== null && a.score < 1).map(([id, a]) => ({ id, title: a.title, score: a.score, value: a.displayValue, details: a.details })) });
    writeFileSync(path.join(output, 'summary.json'), JSON.stringify(results, null, 2));
    console.log(`${phase} ${profile} ${route}: performance ${lhr.categories.performance.score * 100}, LCP ${Math.round(metric('largest-contentful-paint'))}ms, TBT ${Math.round(metric('total-blocking-time'))}ms`);
  }
} finally { chrome.kill(); }
