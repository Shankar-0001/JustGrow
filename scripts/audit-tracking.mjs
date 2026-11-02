import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100';
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


  const requests=[],responses=[],targets=[]; let sessionRequestId=-1;
  const originalHandler=socket.onmessage;
  socket.onmessage=event=>{
    const message=JSON.parse(event.data);
    if(message.method==='Target.attachedToTarget'){
      targets.push(message.params.targetInfo.type);
      socket.send(JSON.stringify({id:sessionRequestId--,sessionId:message.params.sessionId,method:'Network.enable'}));
      socket.send(JSON.stringify({id:sessionRequestId--,sessionId:message.params.sessionId,method:'Runtime.enable'}));
      socket.send(JSON.stringify({id:sessionRequestId--,sessionId:message.params.sessionId,method:'Target.setAutoAttach',params:{autoAttach:true,waitForDebuggerOnStart:false,flatten:true}}));
    }
    if(message.method==='Network.requestWillBeSent') requests.push({url:message.params.request.url,session:message.sessionId||'main'});
    if(message.method==='Network.responseReceived') responses.push({url:message.params.response.url,status:message.params.response.status,session:message.sessionId||'main'});
    if(message.id<0)return;
    originalHandler(event);
  };
  await send('Network.enable');
  await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:false,flatten:true});
  if(process.env.NO_WORKER==='true')await send('Page.addScriptToEvaluateOnNewDocument',{source:'delete Navigator.prototype.serviceWorker;'});
  await viewport(390);await navigate('/');
  for(let i=0;i<60;i++){await pause(500);if(responses.some(r=>r.url.includes('/g/collect')&&r.status===204))break;}
  const tracking=await evaluate("({workerScripts:[...document.querySelectorAll('script[type^=\"text/partytown\"]')].map(s=>({type:s.type,src:s.src})),controller:!!navigator.serviceWorker?.controller,registrations:null,hasGtmOnMain:!!window.google_tag_manager})");
  const report={targets,tracking,requests:requests.filter(r=>/partytown|googletagmanager|google-analytics/.test(r.url)),responses:responses.filter(r=>/partytown|googletagmanager|google-analytics/.test(r.url)),errors};
  writeFileSync(path.join(output,'tracking.json'),JSON.stringify(report,null,2));
  const hits=requests.filter(r=>r.url.includes('/g/collect')&&new URL(r.url).searchParams.get('en')==='page_view');
  assert.equal(hits.length,1,'Exactly one page-view request');
  assert.ok(responses.some(r=>r.url.includes('/g/collect')&&r.status===204),'Analytics accepted the request');
  assert.equal(tracking.hasGtmOnMain,process.env.NO_WORKER==='true','Worker execution, with standard fallback only when unsupported');
  assert.equal(errors.length,0,'No browser or worker errors');
  console.log(JSON.stringify({targets,tracking,pageViews:requests.filter(r=>r.url.includes('/g/collect')&&new URL(r.url).searchParams.get('en')==='page_view').length,collectStatuses:responses.filter(r=>r.url.includes('/g/collect')).map(r=>r.status),errors},null,2));
} finally {socket?.close();chrome.kill();}
