import { serviceCatalog } from './data/serviceCatalog';
import { servicePath } from './data/site';

// Resolve before hydration so the complete prerendered page stays visible.
// Both the build and browser use the same route selection.
export async function loadPage(path: string) {
  const route = path === '/' ? '/' : path.replace(/\/+$/, '') + '/';
  if (route === '/') { const { default: Home } = await import('./pages/Home'); return <Home/>; }
  if (route === '/contact/') { const { default: Contact } = await import('./pages/Contact'); return <Contact/>; }
  if (route === '/thank-you/') { const { default: ThankYou } = await import('./pages/ThankYou'); return <ThankYou/>; }
  if (route === '/seo/' || route === '/website-development/') {
    const { default: DiscoveryPage } = await import('./pages/DiscoveryPages');
    return <DiscoveryPage kind={route === '/seo/' ? 'seo' : 'website'}/>;
  }
  if (route === '/about/') { const { About } = await import('./pages/About'); return <About/>; }
  if (route === '/sem/') { const { default: SEMServicePage } = await import('./pages/SEMServicePage'); return <SEMServicePage/>; }
  if (serviceCatalog.some(service => servicePath(service) === route)) {
    const { services } = await import('./data/services');
    const service = services.find(service => servicePath(service) === route)!;
    if (service.group === 'sem') { const { default: Page } = await import('./pages/SEMServicePage'); return <Page service={service}/>; }
    if (service.slug === 'off-page-seo') { const { default: Page } = await import('./pages/OffPageSEO'); return <Page service={service}/>; }
    const { seoPageContent } = await import('./data/seoPageContent');
    if (seoPageContent[service.slug]) { const { default: Page } = await import('./pages/SEOServicePage'); return <Page service={service}/>; }
    const { default: Page } = await import('./pages/ServicePage'); return <Page service={service}/>;
  }
  const { Legal, NotFound } = await import('./pages/Supporting');
  return route === '/privacy-policy/' || route === '/terms/' ? <Legal privacy={route === '/privacy-policy/'}/> : <NotFound/>;
}
