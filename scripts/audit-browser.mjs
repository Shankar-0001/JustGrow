import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:3100';
const output = path.resolve('.qa/audit', process.argv[2] || 'baseline');
mkdirSync(output, { recursive: true });
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-allow-origins=*', '--remote-debugging-port=9223', `--user-data-dir=${path.join(output, 'chrome-profile')}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
chrome.stderr.on('data', data => { if (/ERROR|DevTools/.test(String(data))) console.log(String(data).slice(0, 500)); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let target;
  for (let i = 0; i < 40; i++) {
    try { target = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json(); break; } catch { await pause(250); }
  }
  assert.ok(target, 'Chrome debugging endpoint');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 1;
  const pending = new Map();
  const errors = [];
  socket.onclose = event => { for (const task of pending.values()) task.reject(new Error('Chrome socket closed: ' + event.code + ' ' + event.reason)); };
  socket.onerror = event => console.log('Chrome socket error', event.message);
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const handler = pending.get(message.id); pending.delete(message.id);
      if (message.error) handler.reject(new Error(JSON.stringify(message.error))); else handler.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value || a.description).join(' '));
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; const timeout = setTimeout(() => reject(new Error('CDP timeout: ' + method)), 15000); pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Evaluation failed'); return result.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  const navigate = async route => {
    await send('Page.navigate', { url: origin + route });
    for (let i = 0; i < 80; i++) { await pause(80); if (await evaluate(`location.pathname === ${JSON.stringify(route.split('?')[0])} && document.readyState === 'complete' && !!document.querySelector('main h1')`)) break; }
    await pause(100);
  };
  const viewport = async width => send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  const screenshot = async name => { const data = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); writeFileSync(path.join(output, name + '.png'), Buffer.from(data.data, 'base64')); };

  const routes = JSON.parse(readFileSync('dist/build-manifest.json', 'utf8')).routes;
  const report={date:new Date().toISOString(),browser:await send('Browser.getVersion'),routes:[],axe:[],errors};
  const axePath=path.resolve('.qa/audit-tools/node_modules/axe-core/axe.min.js');
  for(const route of routes){
    const start=errors.length;await viewport(1440);await navigate(route);await pause(700);
    const response=await fetch(origin+route);const html=await response.text();
    const record=await evaluate("({path:location.pathname,title:document.title,description:document.querySelector('meta[name=description]').content,canonical:document.querySelector('link[rel=canonical]').href,h1:document.querySelector('h1').textContent,headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(e=>[e.tagName,e.textContent]),links:[...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')),mainText:document.querySelector('main').innerText,canvas:document.querySelectorAll('canvas').length})");
    record.status=response.status;record.headers=Object.fromEntries(response.headers);record.initialMain=/<main[^>]*>[\s\S]+<\/main>/.test(html);record.initialH1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    await send('Page.reload',{ignoreCache:true});await pause(700);record.refresh=await evaluate("location.pathname === "+JSON.stringify(route)+" && !!document.querySelector('main h1')");
    const destination=route==='/about/'?'/contact/':'/about/';
    await evaluate(`document.querySelector('.site-footer a[href="${destination}"]').click()`);await pause(700);
    let h=await send('Page.getNavigationHistory');await send('Page.navigateToHistoryEntry',{entryId:h.entries[h.currentIndex-1].id});await pause(700);record.back=await evaluate('location.pathname')===route;
    h=await send('Page.getNavigationHistory');await send('Page.navigateToHistoryEntry',{entryId:h.entries[h.currentIndex+1].id});await pause(700);record.forward=await evaluate('location.pathname')===destination;await navigate(route);await pause(400);
    record.browserErrors=errors.slice(start);
    assert.equal(record.status,200,route);
    assert.ok(record.initialMain && record.refresh && record.back && record.forward,route+' initial HTML and navigation');
    for(const width of [390,1440]){
      await viewport(width);await evaluate("window.scrollTo({top:0,behavior:'instant'})");await pause(200);await screenshot((route==='/'?'home':route.replaceAll('/','-'))+'-'+width);
      if (await import('node:fs').then(m=>m.existsSync(axePath))) {
        await evaluate(readFileSync(axePath,'utf8'));const a=await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']},rules:{'label-content-name-mismatch':{enabled:true}}}).then(r=>({violations:r.violations,incomplete:r.incomplete.map(i=>({id:i.id,nodes:i.nodes.length}))}))");report.axe.push({route,width,...a});
      }
    }
    const faqCount=await evaluate("document.querySelectorAll('main details').length");
    for(let i=0;i<faqCount;i++){
      await evaluate("document.querySelectorAll('main details')["+i+"].open=false;document.querySelectorAll('main details summary')["+i+"].focus()");
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
      assert.ok(await evaluate("document.querySelectorAll('main details')["+i+"].open"),route+' FAQ keyboard');
      await evaluate("document.querySelectorAll('main details')["+i+"].open=false");
    }
    record.keyboardFaqs=faqCount;
    report.routes.push(record);console.log(route+' errors:'+record.browserErrors.length);writeFileSync(path.join(output,'route-audit.json'),JSON.stringify(report,null,2));
  }
  assert.equal(errors.length,0,'No hydration or browser errors');
  assert.equal(report.axe.reduce((n,a)=>n+a.violations.length,0),0,'No automated axe violations');
} finally {socket?.close();chrome.kill();}
