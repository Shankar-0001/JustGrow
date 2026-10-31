import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { serviceCatalog as services } from '../data/serviceCatalog';
import { business, enquiryPath, servicePath } from '../data/site';
import { Logo } from './Logo';

export function CTA({ slug, children = 'Discuss Your Project', secondary = false }: { slug?: string; children?: ReactNode; secondary?: boolean }) { return <a className={`button ${secondary ? 'button-light' : ''}`} data-event="service_cta_click" data-service={slug || 'general'} href={enquiryPath(slug)}>{children}</a>; }

export function Header() {
  const [mobile, setMobile] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const toggles = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setDropdown(null); setMobile(false); } };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  return <header className="site-header" ref={header} onKeyDown={event => {
    if (event.key === 'Escape') {
      if (dropdown) { toggles.current[dropdown]?.focus(); setDropdown(null); }
      else if (mobile) { setMobile(false); trigger.current?.focus(); }
    }
  }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { setDropdown(null); setMobile(false); } }}>
    <div className="container header-inner">
      <a className="wordmark" href="/"><Logo/></a>
      <a className="button mobile-header-cta" href="/contact/" data-event="service_cta_click" data-service="general">Contact Us</a>
      <button className="menu-toggle" ref={trigger} aria-expanded={mobile} aria-controls="main-navigation" aria-label={mobile ? 'Close navigation' : 'Open navigation'} onClick={() => { setMobile(!mobile); setDropdown(null); }}>{mobile ? <X/> : <Menu/>}</button>
      <nav id="main-navigation" aria-label="Main navigation" className={mobile ? 'navigation is-open' : 'navigation'}>
        {(['seo', 'sem'] as const).map(group => <div className="nav-group" key={group}>
          <div className="nav-group-label"><a href={`/${group}/`}>{group.toUpperCase()}</a><button ref={el => { toggles.current[group] = el; }} aria-label={`Show ${group.toUpperCase()} services`} aria-expanded={dropdown === group} aria-controls={`${group}-menu`} onClick={() => setDropdown(dropdown === group ? null : group)}><ChevronDown size={14}/></button></div>
          <div className="dropdown" id={`${group}-menu`} hidden={dropdown !== group}><span className="eyebrow">{group === 'seo' ? 'Organic & AI search' : 'Paid search & social'}</span>{services.filter(s => s.group === group).map(s => <a key={s.slug} href={servicePath(s)}>{s.name}</a>)}</div>
        </div>)}
        <a href="/website-development/">Website Development</a><a href="/about/">About</a>
        <CTA>Contact Us</CTA>
      </nav>
    </div>
  </header>;
}
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div><a className="wordmark" href="/"><Logo variant="light"/></a><p>Helping your business attract<br/>customers and generate enquiries.</p><a href={`mailto:${business.email}`}>{business.email}</a><br/><a href={`tel:${business.phone}`}>{business.displayPhone}</a><address>{business.address}</address></div><div><h2>SEO & AI search</h2><a href="/seo/">SEO overview</a>{services.filter(s => s.group === 'seo').map(s => <a key={s.slug} href={servicePath(s)}>{s.name}</a>)}</div><div><h2>Paid advertising</h2><a href="/sem/">SEM overview</a>{services.filter(s => s.group === 'sem').map(s => <a key={s.slug} href={servicePath(s)}>{s.name}</a>)}</div><div><h2>Explore JustGrow</h2><a href="/website-development/">Website Development</a><a href="/about/">About</a><a href="/contact/">Contact Us</a><a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms</a></div></div><div className="footer-bottom"><span>© {new Date().getUTCFullYear()} JustGrow</span><span>Based in Hyderabad. Built around your business.</span><a href="#top">Back to top</a></div></div></footer>;
}
export function FinalCTA({ slug }: { slug?: string }) { return <section className="final-cta"><div className="container"><div><h2>What would you like<br/>your business to improve?</h2><p className="final-cta-copy">Tell us about your website, customers and goals. We’ll help identify which services fit your next step.</p></div><CTA slug={slug}>Contact Us</CTA></div></section>; }
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) { return <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a>{items.map(item => <span key={item.label}><span aria-hidden="true">/</span>{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}</span>)}</nav>; }
export function FAQs({ items }: { items: [string, string][] }) { return <div className="faq-list">{items.map(([q, a]) => <details key={q}><summary>{q}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>; }
