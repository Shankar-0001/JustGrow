import { Search, Target, ShieldCheck, FileText, MousePointerClick, ChartNoAxesCombined, Check } from 'lucide-react';
import { Breadcrumbs, FAQs } from '../components/SiteLayout';
import { EnquiryForm } from '../components/EnquiryForm';
import { SEOServiceVisual } from '../components/SEOServiceVisual';
import { SEOProcessTabs } from '../components/SEOProcessTabs';
import { seoPageContent } from '../data/seoPageContent';
import type { Service } from '../data/site';
import type { ReactNode } from 'react';
import type { SeoPageContent } from '../data/seoPageContent';

const benefitIcons = [Search, Target, ShieldCheck, FileText, MousePointerClick, ChartNoAxesCombined];

export default function SEOServicePage({ service, pageContent, visual, introduction, journey }: { service: Service; pageContent?: Omit<SeoPageContent, 'kind'> & { kind: string }; visual?: ReactNode; introduction?: ReactNode; journey?: ReactNode }) {
  const content = pageContent || seoPageContent[service.slug];
  const enquiryButton = <a className="button off-primary" href="#seo-enquiry" data-event="service_cta_click" data-service={service.slug}>{content.cta}</a>;
  return <div className={`off-page seo-service-page seo-service-${content.kind}${service.group === 'sem' ? ' sem-service-page' : ''}`}>
    <section className="off-hero"><div className="container"><Breadcrumbs items={service.slug === 'general' ? [{ label: 'SEM' }] : [{ label: service.group.toUpperCase(), href: `/${service.group}/` }, { label: service.name }]}/><div className="off-hero-grid"><div><span className="eyebrow">JUSTGROW / {service.name.toUpperCase()}</span><h1>{content.heading} <span>{content.tagline}</span></h1><p>{content.heroText}</p>{enquiryButton}</div>{visual || <SEOServiceVisual kind={seoPageContent[service.slug].kind}/>}</div></div></section>

    <section className="off-intro"><div className="container"><span className="eyebrow">BASED IN HYDERABAD. SUPPORTING BUSINESSES ACROSS INDIA.</span><h2>{content.introHeading}<br/><span>{content.introAccent}</span></h2><p>{content.introText}</p></div></section>
    {introduction}

    <section className="off-consult section"><div className="container off-consult-grid"><div className="off-consult-copy"><span className="eyebrow">YOUR BUSINESS SETS THE DIRECTION</span><h2>{content.consultHeading}</h2><p>{content.consultText}</p>{content.consultPoints.map(([title, text]) => <div className="seo-consult-point" key={title}><h3>{title}</h3><p>{text}</p></div>)}<ul className="off-checklist">{content.checklist.map(item => <li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul><div className="off-consult-note"><strong>A useful starting point</strong><p>Share your website, target customers and the problem you want to solve. We will help you identify a suitable scope.</p></div></div><div id="seo-enquiry"><EnquiryForm initialService={service.slug} eyebrow="LET'S DISCUSS YOUR NEXT STEP" heading={content.formHeading}/></div></div></section>

    <section className="section off-benefits"><div className="container"><div className="off-centred-heading"><span className="eyebrow">WHAT THIS MEANS FOR YOUR BUSINESS</span><h2>{content.benefitsHeading}</h2><p>{content.benefitsText}</p></div><div className="off-benefit-grid">{content.benefits.map(([title, text], i) => {
      const Icon = benefitIcons[i % benefitIcons.length];
      return <article key={title}><span className="off-icon"><Icon size={28}/></span><h3>{title}</h3><p>{text}</p></article>;
    })}</div></div></section>
    {journey}

    {content.kind === 'expert' && <section className="section container seo-engagements"><div className="off-centred-heading"><span className="eyebrow">CHOOSE THE SUPPORT THAT FITS</span><h2>A focused question or an ongoing need?</h2><p>The engagement follows the work you need help with.</p></div><div className="seo-engagement-grid">{[
      ['Consultation', 'For a specific decision or question.', 'Discuss the issue, review the relevant context and leave with documented next steps.'],
      ['Defined project', 'For a clear set of deliverables.', 'Scope an audit, page review or website-change project with agreed responsibilities and a handover.'],
      ['Ongoing support', 'For continuing priorities and reviews.', 'Keep a shared backlog, coordinate implementation and review evidence as the work develops.'],
    ].map(([title, summary, text]) => <article key={title}><h3>{title}</h3><strong>{summary}</strong><p>{text}</p></article>)}</div></section>}

    <section className="section container off-scope"><div className="section-heading"><div><span className="eyebrow">WHAT WE WORK ON</span><h2>{content.scopeHeading}</h2></div><p>{content.scopeText}</p></div><div className="off-scope-grid">{content.scope.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="section off-process"><div className="container"><div className="off-centred-heading"><span className="eyebrow">CLEAR WORK. VISIBLE PROGRESS.</span><h2>{content.processHeading}</h2><p>Understand the priorities, the responsibilities and what you receive.</p></div><SEOProcessTabs slug={service.slug} steps={content.steps}/></div></section>

    <section className="off-banner"><div className="container"><div><h2>{content.closingHeading}</h2><p>{content.closingText}</p></div>{enquiryButton}</div></section>

    <section className="section container off-reporting"><div><span className="eyebrow">MEASUREMENT WITH CONTEXT</span><h2>See what changed.<br/>Understand what comes next.</h2><p>{content.measures}</p></div><div className="off-report-card"><h3>Your reporting should show</h3><ul className="off-checklist">{content.reporting.map(item => <li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul><a className="text-link" href="#seo-enquiry">Discuss the right scope</a></div></section>

    <section className="section off-faq"><div className="container"><div className="off-centred-heading"><span className="eyebrow">YOUR QUESTIONS, ANSWERED</span><h2>{content.kind === 'expert' ? 'Hiring an SEO expert: FAQs.' : `${service.name} FAQs.`}</h2></div><FAQs items={content.faqs}/></div></section>

  </div>;
}
