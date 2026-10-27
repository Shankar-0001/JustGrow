import { useEffect } from 'react';
import { Header, Footer } from './components/SiteLayout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import ServicePage from './pages/ServicePage';
import DiscoveryPage from './pages/DiscoveryPages';
import OffPageSEO from './pages/OffPageSEO';
import SEOServicePage from './pages/SEOServicePage';
import SEMServicePage from './pages/SEMServicePage';
import { seoPageContent } from './data/seoPageContent';
import { About, Legal, NotFound } from './pages/Supporting';
import { services } from './data/services';
import { servicePath } from './data/site';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
export default function App({ path = '/' }: { path?: string }) {
  const route = path === '/' ? '/' : path.replace(/\/+$/, '') + '/';
  const service = services.find(s => servicePath(s) === route);
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const name = href.startsWith('tel:') ? 'phone_click' : href.startsWith('mailto:') ? 'email_click' : link.dataset.event;
      if (name) window.dispatchEvent(new CustomEvent('justgrow:analytics', { detail: { event: name, page_path: route, service_slug: link.dataset.service || service?.slug || 'general', cta_position: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'content' } }));
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [route, service]);
  let page;
  if (route === '/') page = <Home/>;
  else if (route === '/sem/') page = <SEMServicePage/>;
  else if (route === '/seo/') page = <DiscoveryPage kind="seo"/>;
  else if (route === '/website-development/') page = <DiscoveryPage kind="website"/>;
  else if (service) page = service.group === 'sem' ? <SEMServicePage service={service}/> : service.slug === 'off-page-seo' ? <OffPageSEO service={service}/> : seoPageContent[service.slug] ? <SEOServicePage service={service}/> : <ServicePage service={service}/>;
  else if (route === '/about/') page = <About/>;
  else if (route === '/contact/') page = <Contact/>;
  else if (route === '/thank-you/') page = <ThankYou/>;
  else if (route === '/privacy-policy/' || route === '/terms/') page = <Legal privacy={route === '/privacy-policy/'}/>;
  else page = <NotFound/>;
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top"/><Header/><main id="main">{page}</main><Footer/><aside aria-label="WhatsApp contact"><FloatingWhatsApp/></aside></>;
}
