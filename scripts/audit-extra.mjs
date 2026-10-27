import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:3100';
const output = path.resolve('.qa/audit/final/extra');
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

const routes=JSON.parse(readFileSync('dist/build-manifest.json','utf8')).routes;
const report={zoom:[],noScript:[],anchor:[],touch:[],errors};
for(const route of routes){
 await send('Emulation.setDeviceMetricsOverride',{width:720,height:500,deviceScaleFactor:2,mobile:false});await navigate(route);await pause(100);
 report.zoom.push({route,overflow:await evaluate("document.documentElement.scrollWidth>innerWidth+1")});
}
for(const route of ['/','/seo/aeo/','/website-development/','/contact/']){
 await send('Emulation.setScriptExecutionDisabled',{value:true});await viewport(390);await navigate(route);
 const state=await evaluate("({h1:document.querySelector('h1').textContent,cta:!!document.querySelector('main a[href*=contact],main a[href*=enquiry]'),text:document.querySelector('main').textContent.length,canvas:document.querySelectorAll('canvas').length,phone:!!document.querySelector('a[href=\"tel:+918252553686\"]')})");
 report.noScript.push({route,...state});assert.ok(state.text>500&&state.phone);
 await send('Emulation.setScriptExecutionDisabled',{value:false});
}
for(const route of routes.filter(r=>/^\/(seo|sem)\/[^/]+\/$/.test(r)).concat(['/sem/','/contact/'])){
 await viewport(390);await navigate(route);await pause(200);
 const selector=route==='/seo/off-page-seo/'?'#off-enquiry':route==='/contact/'?'#contact-enquiry':'#seo-enquiry';
 await evaluate("document.querySelector('main a[href=\""+selector+"\"]').click()");await pause(1600);
 const p=await evaluate("({top:document.querySelector('"+selector+"').getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom})");report.anchor.push({route,...p});console.log('Anchor '+route+' '+JSON.stringify(p));assert.ok(p.top>=p.header-1&&p.top<250,route+' form anchor');
}
await viewport(390);await navigate('/');await send('Emulation.setTouchEmulationEnabled',{enabled:true});
const touch=async selector=>{const r=await evaluate("(()=>{const r=document.querySelector('"+selector+"').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(100)};
await touch('.menu-toggle');assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"),'true');
await touch('[aria-controls=seo-menu]');assert.equal(await evaluate("document.querySelector('[aria-controls=seo-menu]').getAttribute('aria-expanded')"),'true');report.touch.push('Emulated touch opens mobile navigation and SEO services');
await send('Emulation.setTouchEmulationEnabled',{enabled:false});
await viewport(1440);await navigate('/');
const pointer=await evaluate("(()=>{const r=document.querySelector('[aria-controls=sem-menu]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
await send('Input.dispatchMouseEvent',{type:'mousePressed',...pointer,button:'left',clickCount:1});
await send('Input.dispatchMouseEvent',{type:'mouseReleased',...pointer,button:'left',clickCount:1});
assert.equal(await evaluate("document.querySelector('[aria-controls=sem-menu]').getAttribute('aria-expanded')"),'true');
report.touch.push('Desktop pointer opens SEM services; overview remains a separate link');
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
assert.ok(await evaluate("[...document.querySelectorAll('main *')].every(e=>getComputedStyle(e).animationName==='none'&&getComputedStyle(e).transitionDuration.split(',').every(v=>parseFloat(v)===0))"));
writeFileSync(path.join(output,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
assert.equal(report.zoom.filter(r=>r.overflow).length,0,'200% equivalent viewport reflow');assert.equal(errors.length,0);
}finally{socket?.close();chrome.kill();}
