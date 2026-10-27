import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:3100';
const output = path.resolve('.qa');
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
  // Preserve only mocked fixture results across the successful form redirect.
  await send('Page.addScriptToEvaluateOnNewDocument', { source: "window.addEventListener('beforeunload',()=>{if(window.__posts!==undefined)sessionStorage.setItem('qa-last-submission',JSON.stringify({posts:window.__posts,lead:window.__lead,eventPath:window.__eventPath}));});" });
  const waitForThankYou = async () => {
    for (let i = 0; i < 80; i++) {
      await pause(100);
      try { if (await evaluate("location.pathname==='/thank-you/' && !!document.querySelector('.thank-you-dialog[open]')")) return; } catch { /* navigation changes context */ }
    }
    throw new Error('Thank-you confirmation did not appear');
  };
  const navigate = async route => {
    await send('Page.navigate', { url: origin + route });
    for (let i = 0; i < 80; i++) { await pause(80); if (await evaluate(`location.pathname === ${JSON.stringify(route.split('?')[0])} && document.readyState === 'complete' && !!document.querySelector('main h1')`)) break; }
    await pause(100);
  };
  const viewport = async width => send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  const screenshot = async name => { const data = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); writeFileSync(path.join(output, name + '.png'), Buffer.from(data.data, 'base64')); };
  const routes = JSON.parse(readFileSync('dist/build-manifest.json', 'utf8')).routes;
  const report = { routes: routes.length, widths: [360, 390, 768, 1024, 1440], layoutChecks: [], interactions: [], errors };
  const designedServices = [
    ['aeo', 'AEO'],
    ['geo', 'GEO'],
    ['search-engine-optimization', 'Search Engine Optimization'],
    ['hire-seo-expert', 'Hire an SEO Expert'],
    ['local-seo', 'Local SEO'],
    ['on-page-seo', 'On-page SEO'],
    ['google-ads', 'Google Ads', '/sem/google-ads/'],
    ['social-media-ads', 'Social Media Ads', '/sem/social-media-ads/'],
    ['bing-ads', 'Bing Ads', '/sem/bing-ads/'],
    ['chatgpt-ads', 'ChatGPT Ads', '/sem/chatgpt-ads/'],
    ['general', 'General enquiry', '/sem/'],
  ].map(([slug, name, route]) => [slug, name, route || '/seo/' + slug + '/']);
  for (const width of report.widths) {
    await viewport(width);
    for (const route of routes) {
      await navigate(route);
      const layout = await evaluate(`({path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2 && !e.closest('.table-scroll,.honeypot') && getComputedStyle(e).position!=='absolute').slice(0,4).map(e=>e.className)})`);
      report.layoutChecks.push(layout);
      assert.equal(layout.h1, 1, route + ' has one h1');
      if (designedServices.some(([, , serviceRoute]) => route === serviceRoute)) {
        assert.equal(await evaluate(`document.querySelectorAll('.seo-service-page').length`), 1, 'Shared service design');
        assert.equal(await evaluate(`document.querySelectorAll('.off-benefit-grid article').length`), 6, 'Six service-specific benefits');
        assert.equal(await evaluate(`document.querySelectorAll('#seo-enquiry form').length`), 1, 'CTA target contains one native form');
      }
      if (route.startsWith('/sem/')) {
        assert.equal(await evaluate(`document.querySelectorAll('.sem-journey-grid article').length`), 3, 'SEM explains traffic, enquiry and follow-up');
        assert.equal(await evaluate(`document.querySelectorAll('.sem-visual').length`), 1, 'SEM has a service visual');
        if (route === '/sem/') assert.equal(await evaluate(`document.querySelectorAll('.sem-channel-grid>a').length`), 4, 'SEM hub links to all four channels');
      }
      if (['/about/', '/contact/'].includes(route)) {
        assert.equal(await evaluate(`document.querySelectorAll('.company-page .off-hero').length`), 1, 'Company page shares service hero design');
        assert.equal(await evaluate(`document.querySelectorAll('.company-visual').length`), 1, 'Company page has a readable hero visual');
        if (route === '/contact/') assert.equal(await evaluate(`document.querySelectorAll('.off-benefit-grid article').length`), 3, 'Contact page uses matching benefit cards');
        if (route === '/about/') {
          assert.equal(await evaluate(`document.querySelectorAll('.about-values-grid article').length`), 4, 'About has four values');
          assert.equal(await evaluate(`document.querySelectorAll('.about-advantage-grid article').length`), 8, 'About has eight business advantages');
          assert.equal(await evaluate(`document.querySelectorAll('.about-strength-grid>a').length`), 4, 'About connects capabilities to service routes');
        }
      }
      assert.equal(await evaluate(`document.querySelectorAll('.process-number,.scope-number,.panel-number,.faq-number,.growth-step-number,.home-visual-note').length`), 0, route + ' has no decorative numbering or removed illustration note');
      if (route === '/') {
        assert.equal(await evaluate(`document.querySelectorAll('.growth-visual-heading p br').length`), 0, 'Hero diagram heading wraps naturally');
        assert.equal(await evaluate(`document.querySelectorAll('.home-art').length`), 3, 'Three service illustrations are present');
        assert.ok(await evaluate(`document.querySelector('h1').textContent.includes('AI Powered Digital Marketing Agency') && document.querySelector('h1').textContent.includes('Hyderabad')`), 'Homepage heading reflects the supplied primary keyword');
      }
      assert.equal(await evaluate(`document.querySelectorAll('.contents-nav, nav[aria-label="On this page"]').length`), 0, route + ' has no section navigation strip');
      const smallText = await evaluate(`[...document.querySelectorAll('body *')].filter(e=>e.getClientRects().length && !e.closest('[aria-hidden="true"], .sr-only, .honeypot, .brand-logo, svg') && [...e.childNodes].some(n=>n.nodeType===3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize)<12).map(e=>({element:e.className,text:e.textContent.slice(0,60),size:getComputedStyle(e).fontSize}))`);
      assert.deepEqual(smallText, [], route + ' has readable labels at ' + width + 'px');
      assert.ok(await evaluate(`(()=>{const panels=[...document.querySelectorAll('.visual-panel')];return panels.every((panel,i)=>!i || panel.getBoundingClientRect().top >= panels[i-1].getBoundingClientRect().bottom);})()`), route + ' service illustration labels do not overlap');
      if (!['/contact/', '/privacy-policy/', '/terms/'].includes(route)) {
        assert.equal(await evaluate(`document.querySelectorAll('main a[href^="tel:"], main a[href^="mailto:"]').length`), 0, route + ' has no repeated direct-contact links');
      }
      if (width <= 900) {
        const cta = await evaluate(`(()=>{const e=document.querySelector('.mobile-header-cta');const r=e.getBoundingClientRect();return {visible:getComputedStyle(e).display!=='none',height:r.height,right:r.right,top:r.top,bottom:r.bottom};})()`);
        assert.ok(cta.visible && cta.height >= 44 && cta.top >= 0 && cta.bottom < 100 && cta.right <= width, 'Mobile header CTA is visible and tappable');
        assert.ok(await evaluate(`document.querySelector('.wordmark').getBoundingClientRect().right <= document.querySelector('.mobile-header-cta').getBoundingClientRect().left`), 'Logo and CTA do not overlap');
      }
      if (layout.scrollWidth > width + 1) console.log('OVERFLOW', JSON.stringify(layout));
      if (['/', '/about/', '/contact/', '/seo/aeo/', '/seo/off-page-seo/'].includes(route) && [390, 1440].includes(width)) { await pause(1200); await screenshot((route === '/' ? 'home' : route.replaceAll('/', '-')) + '-' + width); }
      if (['/about/', '/contact/'].includes(route) && [390, 1440].includes(width)) {
        for (const [name, selector] of [['cards', route === '/about/' ? '.about-values' : '.off-benefits'], ['details', route === '/contact/' ? '#contact-enquiry' : '.about-workspace'], ...(route === '/about/' ? [['strengths', '.about-strengths'], ['advantages', '.about-advantages']] : [])]) {
          await evaluate(`window.scrollTo({top:document.querySelector('${selector}').getBoundingClientRect().top+window.scrollY-110,behavior:'instant'})`);
          await screenshot(route.slice(1,-1) + '-' + name + '-' + width);
        }
        await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
      }
      if (route === '/seo/off-page-seo/' && [390, 1440].includes(width)) {
        await evaluate(`window.scrollTo({top:document.querySelector('#off-enquiry').getBoundingClientRect().top+window.scrollY-110,behavior:'instant'})`);
        await screenshot('off-enquiry-' + width);
        for (const section of ['off-consult', 'off-benefits', 'off-process', 'off-faq']) {
          await evaluate(`window.scrollTo({top:document.querySelector('.${section}').getBoundingClientRect().top+window.scrollY-90,behavior:'instant'})`);
          await screenshot(section + '-' + width);
        }
        await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
      }
      if (route === '/' && [390, 1440].includes(width)) {
        for (const [name,selector] of [['home-faq','.home-faq'],['home-goal','.goal-section']]) {
          await evaluate(`window.scrollTo({top:document.querySelector('${selector}').getBoundingClientRect().top+window.scrollY-110,behavior:'instant'})`);
          await screenshot(name+'-'+width);
        }
        for (const kind of ['search', 'ads', 'website']) {
          await evaluate(`window.scrollTo({top:document.querySelector('.home-art-${kind}').getBoundingClientRect().top+window.scrollY-110,behavior:'instant'})`);
          await screenshot('home-visual-' + kind + '-' + width);
        }
        await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
      }
      if (designedServices.some(([, , serviceRoute]) => route === serviceRoute) && [390, 1440].includes(width)) {
        const slug = route === '/sem/' ? 'sem' : route.split('/')[2];
        await screenshot(slug + '-hero-' + width);
        for (const [label, selector] of [['enquiry', '#seo-enquiry'], ['benefits', '.off-benefits'], ['process', '.off-process'], ...(route.startsWith('/sem/') ? [['journey', '.sem-journey']] : [])]) {
          await evaluate(`window.scrollTo({top:document.querySelector('${selector}').getBoundingClientRect().top+window.scrollY-110,behavior:'instant'})`);
          await screenshot(slug + '-' + label + '-' + width);
        }
        await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
      }
    }
    console.log('Checked all routes at ' + width + 'px');
  }
  await viewport(390); await navigate('/');
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'true');
  assert.equal(await evaluate(`document.querySelector('#main-navigation a[href="/contact/"]').textContent.trim()`), 'Contact Us');
  assert.equal(await evaluate(`document.querySelector('.site-header .brand-name').textContent`), 'JustGrow');
  assert.equal(await evaluate(`document.querySelector('.site-header .brand-tagline').textContent`), 'Grow Smarter. Grow Faster.');
  assert.ok((await evaluate(`document.querySelector('.floating-whatsapp').href`)).startsWith('https://wa.me/918252553686?'));
  assert.equal(await evaluate(`document.querySelectorAll('.lucide-arrow-up-right').length`), 0);
  report.interactions.push('Original logo, Contact Us navigation and existing WhatsApp destination restored; no diagonal arrow icons');
  await evaluate(`document.querySelector('[aria-controls="seo-menu"]').click();document.querySelector('[aria-controls="seo-menu"]').focus()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  assert.equal(await evaluate(`document.querySelector('[aria-controls="seo-menu"]').getAttribute('aria-expanded')`), 'false');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  assert.equal(await evaluate(`document.activeElement.className`), 'menu-toggle');
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false');
  report.interactions.push('Mobile menu and submenu Escape/focus');
  await evaluate(`document.querySelector('input[value="website"]').click()`);
  assert.ok((await evaluate(`document.querySelector('.goal-result').innerText`)).includes('Website Development'));
  await evaluate(`document.querySelector('.faq-list summary').click()`);
  assert.equal(await evaluate(`document.querySelector('.faq-list details').open`), true);
  report.interactions.push('Service selector and FAQ disclosure');
  const homeFaqCount=await evaluate(`document.querySelectorAll('.home-faq details').length`);
  assert.equal(homeFaqCount,8);
  for(let i=0;i<homeFaqCount;i++){
    await evaluate(`document.querySelectorAll('.home-faq details')[${i}].open=false;document.querySelectorAll('.home-faq summary')[${i}].focus()`);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
    assert.ok(await evaluate(`document.querySelectorAll('.home-faq details')[${i}].open`),'FAQ opens with Enter');
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
    assert.equal(await evaluate(`document.querySelectorAll('.home-faq details')[${i}].open`),false,'FAQ closes with Enter');
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  }
  for(const [goal,slug] of [['search','search-engine-optimization'],['ads','google-ads'],['website','website-development']]){
    await evaluate(`document.querySelector('input[name=goal][value="${goal}"]').click()`);
    assert.equal(await evaluate(`document.querySelector('.goal-result>.button').getAttribute('href')`),'/contact/?service='+slug);
  }
  const contrasts=await evaluate(`(()=>{const lum=c=>{const channels=c.match(/[\\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;};return ['.hero-actions>.button','.home-faq-help .button'].map(selector=>{const e=document.querySelector(selector),s=getComputedStyle(e),a=lum(s.color),b=lum(s.backgroundColor);return {selector,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),height:e.getBoundingClientRect().height};});})()`);
  for(const item of contrasts){assert.ok(item.ratio>=4.5,item.selector+' text contrast');assert.ok(item.height>=44,item.selector+' touch target');}
  report.interactions.push('Eight homepage FAQs work with keyboard; goal CTA carries service choice; primary CTA contrast exceeds 4.5:1');

  await navigate('/contact/?service=aeo');
  assert.equal(await evaluate(`document.querySelector('#service').value`), 'aeo');
  // Network boundary is replaced before any form action. No live sheet writes.
  await evaluate(`window.__posts=0;window.fetch=async()=>{window.__posts++;await new Promise(r=>setTimeout(r,150));return new Response(JSON.stringify({success:true,syncedToSheet:true}),{status:200,headers:{'Content-Type':'application/json'}})};document.querySelector('#fullName').value='QA Mock';document.querySelector('#email').value='qa@example.com';document.querySelector('#message').value='Mocked only';document.querySelector('[name=privacy]').checked=true;document.querySelector('form').requestSubmit();document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);
  await waitForThankYou();
  assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).posts"), 1);
  assert.ok(await evaluate(`!!document.querySelector('.thank-you-dialog[open]')`));
  report.interactions.push('Service prefill, optional phone, triple submit = one mocked request, confirmed success');
  await navigate('/contact/');
  await evaluate(`document.querySelector('#phone').value='+91 82525 53686'`);
  assert.equal(await evaluate(`document.querySelector('#phone').checkValidity()`), true);
  await evaluate(`document.querySelector('#phone').value='not a number'`);
  assert.equal(await evaluate(`document.querySelector('#phone').checkValidity()`), false);
  await evaluate(`document.querySelector('#phone').value=''`);
  report.interactions.push('Optional phone accepts international numbers and rejects invalid text');
  await evaluate(`window.fetch=async()=>new Response(JSON.stringify({success:false,error:'Mocked server rejection'}),{status:502});document.querySelector('#fullName').value='QA Mock';document.querySelector('#email').value='qa@example.com';document.querySelector('#message').value='Mocked only';document.querySelector('[name=privacy]').checked=true;document.querySelector('form').requestSubmit()`);
  await pause(200);
  assert.equal(await evaluate(`document.querySelector('.form-error')?.textContent`), 'Mocked server rejection');
  assert.equal(await evaluate(`document.querySelector('#message').value`), 'Mocked only');
  report.interactions.push('Server rejection retains values and focuses error');
  await navigate('/seo/off-page-seo/');
  assert.ok(await evaluate(`document.querySelector('#off-enquiry form') !== null`), 'Off-page CTA anchor targets the enquiry form');
  assert.equal(await evaluate(`document.querySelector('#service').value`), 'off-page-seo');
  for (const id of ['strategy', 'outreach', 'reporting', 'research']) {
    await evaluate(`document.querySelector('#off-tab-${id}').click()`);
    assert.ok(await evaluate(`document.querySelector('#off-tab-${id}').getAttribute('aria-selected')==='true' && !document.querySelector('#off-panel-${id}').hidden && document.querySelectorAll('.off-process-panel:not([hidden])').length===1`));
  }
  await evaluate(`document.querySelector('#off-tab-research').focus()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown' });
  assert.equal(await evaluate(`document.activeElement.id`), 'off-tab-strategy');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End' });
  assert.equal(await evaluate(`document.activeElement.id`), 'off-tab-reporting');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' });
  assert.equal(await evaluate(`document.activeElement.id`), 'off-tab-research');
  await evaluate(`window.__posts=0;window.__lead=null;window.addEventListener('justgrow:analytics',e=>{if(e.detail.event==='enquiry_confirmed')window.__eventPath=e.detail.page_path});window.fetch=async(url,options)=>{window.__posts++;window.__lead=JSON.parse(options.body);await new Promise(r=>setTimeout(r,150));return new Response(JSON.stringify({success:true,syncedToSheet:true}),{status:200,headers:{'Content-Type':'application/json'}})};document.querySelector('#fullName').value='QA Mock';document.querySelector('#email').value='qa@example.com';document.querySelector('#message').value='Mocked off-page enquiry';document.querySelector('[name=privacy]').checked=true;document.querySelector('form').requestSubmit();document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);
  await waitForThankYou();
  assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).posts"), 1);
  assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).lead.service"), 'Off-page SEO');
  assert.ok(await evaluate("Boolean(JSON.parse(sessionStorage.getItem('qa-last-submission')).lead.submissionId)"));
  assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).eventPath"), '/seo/off-page-seo/');
  assert.ok(await evaluate(`!!document.querySelector('.thank-you-dialog[open]')`));
  report.interactions.push('Off-page process tabs and keyboard controls; preselected service; one mocked request for triple submit; correct analytics path');
  for (const [slug, serviceName, serviceRoute] of designedServices) {
    await viewport(390); await navigate(serviceRoute);
    assert.equal(await evaluate(`document.querySelector('#service').value`), slug, slug + ' preselected in the enquiry form');
    const tabs = await evaluate(`Array.from(document.querySelectorAll('[role=tab]'),e=>({id:e.id,panel:e.getAttribute('aria-controls')}))`);
    assert.ok(tabs.length >= 4, slug + ' has a complete process');
    for (const tab of tabs) {
      await evaluate(`document.getElementById(${JSON.stringify(tab.id)}).click()`);
      assert.ok(await evaluate(`document.getElementById(${JSON.stringify(tab.id)}).getAttribute('aria-selected')==='true' && !document.getElementById(${JSON.stringify(tab.panel)}).hidden && document.querySelectorAll('[role=tabpanel]:not([hidden])').length===1`));
    }
    await evaluate(`document.getElementById(${JSON.stringify(tabs[0].id)}).focus()`);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown' });
    assert.equal(await evaluate('document.activeElement.id'), tabs[1].id);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End' });
    assert.equal(await evaluate('document.activeElement.id'), tabs.at(-1).id);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' });
    assert.equal(await evaluate('document.activeElement.id'), tabs[0].id);
    await evaluate(`window.__posts=0;window.__lead=null;window.addEventListener('justgrow:analytics',e=>{if(e.detail.event==='enquiry_confirmed')window.__eventPath=e.detail.page_path});window.fetch=async(url,options)=>{window.__posts++;window.__lead=JSON.parse(options.body);await new Promise(r=>setTimeout(r,150));return new Response(JSON.stringify({success:true,syncedToSheet:true}),{status:200,headers:{'Content-Type':'application/json'}})};document.querySelector('#fullName').value='QA Mock';document.querySelector('#email').value='qa@example.com';document.querySelector('#message').value='Mocked service enquiry';document.querySelector('[name=privacy]').checked=true;document.querySelector('form').requestSubmit();document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))`);
    await waitForThankYou();
    assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).posts"), 1, slug + ' sends one request for repeated submissions');
    assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).lead.service"), serviceName);
    assert.ok(await evaluate("Boolean(JSON.parse(sessionStorage.getItem('qa-last-submission')).lead.submissionId)"));
    assert.equal(await evaluate("JSON.parse(sessionStorage.getItem('qa-last-submission')).eventPath"), serviceRoute);
    assert.ok(await evaluate(`!!document.querySelector('.thank-you-dialog[open]')`));
    report.interactions.push(slug + ': process tabs, keyboard navigation, preselected service and single mocked submission');
  }
  await viewport(390);
  await navigate('/contact/');
  await evaluate(`document.querySelector('a[href="#contact-enquiry"]').click()`);
  await pause(1000);
  const formPosition=await evaluate(`({top:document.querySelector('#contact-enquiry').getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom})`);
  assert.ok(formPosition.top>=formPosition.header && formPosition.top<250,'Contact hero CTA exposes the enquiry form');
  report.interactions.push('Reference-inspired About sections; Contact CTA scrolls to the form below the header');
  await viewport(1440); await navigate('/');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.growth-step')).transitionDuration`), '0s');
  report.interactions.push('Reduced motion disables hover transitions');
  report.overflowCount = report.layoutChecks.filter(c => c.scrollWidth > c.width + 1).length;
  writeFileSync(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checks: report.layoutChecks.length, overflow: report.overflowCount, interactions: report.interactions, errors }, null, 2));
  assert.equal(errors.length, 0, 'No browser errors');
  assert.equal(report.overflowCount, 0, 'No horizontal overflow');
} finally { socket?.close(); chrome.kill(); }
