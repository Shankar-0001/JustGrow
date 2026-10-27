import { spawn } from 'node:child_process';
import path from 'node:path';
const child = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', '--screenshot=' + path.resolve('public/share-card.png'), '--user-data-dir=' + path.resolve('.qa/share-profile'), 'http://127.0.0.1:3100/share-card.svg'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
child.stderr.on('data', data => { if (String(data).includes('bytes written')) console.log(String(data).trim()); });
child.on('exit', code => { process.exitCode = code || 0; });
