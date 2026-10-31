import { useEffect, type ReactNode } from 'react';
import { Header, Footer } from './components/SiteLayout';
import { serviceCatalog as services } from './data/serviceCatalog';
import { servicePath } from './data/site';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
export default function App({ path = '/', children }: { path?: string; children: ReactNode }) {
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
  return <><a className="skip-link" href="#main">Skip to content</a><div id="top"/><Header/><main id="main">{children}</main><Footer/><aside aria-label="WhatsApp contact"><FloatingWhatsApp/></aside></>;
}
