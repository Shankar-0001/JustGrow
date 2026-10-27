import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:3100';
const output = path.resolve('.qa/thank-you');
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
  const requests = [];
  const events = [];
  let responseMode = 'success';
  socket.onclose = event => { for (const task of pending.values()) task.reject(new Error('Chrome socket closed: ' + event.code + ' ' + event.reason)); };
  socket.onerror = event => console.log('Chrome socket error', event.message);
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const handler = pending.get(message.id); pending.delete(message.id);
      if (message.error) handler.reject(new Error(JSON.stringify(message.error))); else handler.resolve(message.result);
    } else if (message.method === 'Fetch.requestPaused') {
      const request = message.params;
      requests.push(JSON.parse(request.request.postData));
      const response = responseMode === 'error' ? { success: false, error: 'Mocked rejection' } : { success: true, syncedToSheet: responseMode !== 'unconfirmed' };
      pause(150).then(() => send('Fetch.fulfillRequest', { requestId: request.requestId, responseCode: responseMode === 'error' ? 502 : 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(response)).toString('base64') })).catch(error => errors.push(String(error)));
    } else if (message.method === 'Runtime.bindingCalled' && message.params.name === 'qaEvent') events.push(JSON.parse(message.params.payload));
    else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + message.params.exceptionDetails.exception?.description);
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

  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*googletagmanager.com/*', '*google-analytics.com/*'] });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*://*/api/submit-lead', requestStage: 'Request' }] });
  await send('Runtime.addBinding', { name: 'qaEvent' });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.addEventListener('justgrow:analytics', event => { if(event.detail.event === 'enquiry_confirmed') window.qaEvent(JSON.stringify(event.detail)); });` });
  const waitFor = async expression => {
    for (let i = 0; i < 100; i++) {
      await pause(80);
      try { if (await evaluate(expression)) return; } catch { /* navigation replaces the execution context */ }
    }
    throw new Error('Timed out: ' + expression);
  };
  const submit = async (phone = '+91 99999 00000') => evaluate(`(() => {
    document.querySelector('#fullName').value = 'QA Mock';
    document.querySelector('#email').value = 'qa@example.com';
    document.querySelector('#phone').value = ${JSON.stringify(phone)};
    document.querySelector('#message').value = 'Local mocked confirmation test only';
    document.querySelector('[name=privacy]').checked = true;
    const form = document.querySelector('form');
    if (!form.checkValidity()) throw new Error('Fixture failed form validation');
    form.requestSubmit();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  })()`);
  const report = { date: new Date().toISOString(), forms: [], checks: [], errors };
  const routes = JSON.parse(readFileSync('dist/build-manifest.json', 'utf8')).routes;
  const formRoutes = routes.filter(route => readFileSync(path.join('dist', route, 'index.html'), 'utf8').includes('<form '));
  assert.equal(formRoutes.length, 13);
  await viewport(390);
  for (const route of formRoutes) {
    await navigate(route);
    await waitFor(`!!document.querySelector('form')`);
    const initialService = await evaluate(`document.querySelector('#service').value`);
    const beforeRequests = requests.length;
    const beforeEvents = events.length;
    await submit();
    await waitFor(`location.pathname === '/thank-you/' && !!document.querySelector('.thank-you-dialog[open]')`);
    assert.equal(requests.length - beforeRequests, 1, route + ': triple submit sends once');
    assert.equal(events.length - beforeEvents, 1, route + ': one acknowledged enquiry event');
    assert.equal(events.at(-1).page_path, route);
    assert.equal(events.at(-1).service_slug, initialService);
    assert.match(await evaluate(`document.querySelector('#thank-you-popup-message').textContent`), /call/);
    assert.equal(await evaluate(`document.querySelector('dialog').contains(document.activeElement)`), true);
    assert.equal(await evaluate(`location.search + location.hash`), '');
    const receipt = await evaluate('history.state.justgrowEnquiry');
    assert.deepEqual(Object.keys(receipt).sort(), ['phoneProvided', 'popupShown', 'receivedAt']);
    assert.equal(receipt.popupShown, true);
    if (route === '/contact/') {
      for (const width of [360, 1440]) {
        await viewport(width);
        const bounds = await evaluate(`(()=>{const r=document.querySelector('dialog').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};})()`);
        assert.ok(bounds.left >= 0 && bounds.right <= bounds.width && bounds.top >= 0 && bounds.bottom <= bounds.height && !bounds.overflow);
        await screenshot('popup-' + width);
      }
      await viewport(390);
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
      assert.equal(await evaluate(`document.querySelector('dialog').contains(document.activeElement) || document.activeElement === document.body`), true);
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    } else {
      await evaluate(`document.querySelector('dialog button').click()`);
      await waitFor(`location.pathname === '/' && document.readyState === 'complete' && !!document.querySelector('main h1')`);
      assert.equal(await evaluate(`history.state?.justgrowEnquiry ?? null`), null);
    }
    await waitFor(`!document.querySelector('dialog[open]')`);
    if (route === '/contact/') assert.equal(await evaluate(`document.activeElement.textContent`), 'Back to Home');
    await send('Page.reload');
    if (route === '/contact/') await waitFor(`document.readyState === 'complete' && document.querySelector('main h1')?.textContent === 'Thank you for submitting your form.'`);
    else await waitFor(`location.pathname === '/' && document.readyState === 'complete' && !!document.querySelector('main h1')`);
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false, 'Refresh does not replay the popup');
    assert.equal(requests.length - beforeRequests, 1, 'Refresh does not resend');
    assert.equal(events.length - beforeEvents, 1, 'Refresh does not repeat conversion');
    report.forms.push({ route, service: initialService, singleRequest: true, popup: true, refreshSafe: true, dismissal: route === '/contact/' ? 'Escape' : 'OK to home' });
    console.log('Confirmed redirect and popup: ' + route);
  }
  for (const mode of ['error', 'unconfirmed']) {
    responseMode = mode;
    await navigate('/contact/');
    const beforeEvents = events.length;
    await submit();
    await waitFor(`!!document.querySelector('.form-error')`);
    assert.equal(await evaluate('location.pathname'), '/contact/');
    assert.equal(await evaluate(`document.querySelector('#message').value`), 'Local mocked confirmation test only');
    assert.equal(events.length, beforeEvents);
    assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false);
  }
  report.checks.push('Failed and unconfirmed responses preserve the form and never redirect');
  responseMode = 'success';
  const disabledStorage = await send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage unavailable for fixture'); } });` });
  await navigate('/contact/');
  await submit('');
  await waitFor(`!!document.querySelector('dialog[open]')`);
  assert.match(await evaluate(`document.querySelector('#thank-you-popup-message').textContent`), /email/);
  await evaluate(`document.querySelector('dialog button').click()`);
  await waitFor(`location.pathname === '/' && document.readyState === 'complete' && !!document.querySelector('main h1')`);
  report.checks.push('Contact popup OK returns directly to home');
  report.checks.push('No-phone submission promises email follow-up; redirect works with session storage disabled');
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: disabledStorage.identifier });
  await navigate('/');
  const beforeDirectEvents = events.length;
  await navigate('/thank-you/?submitted=1');
  assert.equal(await evaluate(`!!document.querySelector('dialog[open]')`), false);
  assert.equal(await evaluate(`document.querySelector('main h1').textContent`), 'Thank you for your interest.');
  assert.equal(events.length, beforeDirectEvents);
  report.checks.push('Direct URL/query visits do not claim receipt or trigger enquiry events');
  assert.deepEqual(errors, []);
  writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { socket?.close(); chrome.kill(); }
