import { useRef, useState, type KeyboardEvent } from 'react';
import { Search, Link2, Users, ShieldCheck, Globe2, MessageSquare, FileSearch, MapPin, FileText, Target, ChartNoAxesCombined, Check } from 'lucide-react';
import { Breadcrumbs, FAQs } from '../components/SiteLayout';
import { EnquiryForm } from '../components/EnquiryForm';
import type { Service } from '../data/site';

const benefits = [
  { icon: Search, title: 'Support organic discovery', text: 'Relevant editorial links can help search engines discover your pages and understand their context alongside your on-page and technical SEO.' },
  { icon: Users, title: 'Reach a relevant audience', text: 'Introduce your expertise through publications and resources your potential customers already read.' },
  { icon: ShieldCheck, title: 'Build credibility beyond your website', text: 'Independent coverage and accurate business references give buyers more context when they compare providers.' },
  { icon: Globe2, title: 'Bring interested visitors to your site', text: 'A well-placed reference can send readers to a useful service page, guide or resource that answers their next question.' },
  { icon: MessageSquare, title: 'Make your brand easier to recognise', text: 'Consistent, relevant mentions help people encounter your business across the places where they research a purchase.' },
  { icon: ChartNoAxesCombined, title: 'Understand the value of the work', text: 'See which opportunities were researched, who was approached and what coverage, referral visits or enquiries followed.' },
];

const process = [
  { id: 'research', icon: FileSearch, label: 'Research your backlink profile', title: 'Find the opportunities that fit your business.', text: 'We review existing referring sites, lost links and a relevant set of competitors. The aim is to understand which publications reach your buyers and where your business has something useful to contribute.', items: ['Current backlink and brand-mention review', 'Competitor referring-site research', 'Priority pages and audience gaps'], output: 'A backlink review and opportunity shortlist.' },
  { id: 'strategy', icon: Target, label: 'Build the outreach strategy', title: 'Give publishers a reason to pay attention.', text: 'We match opportunities to your expertise, resources and commercial priorities. Together, we agree the story, destination page and claims before outreach begins.', items: ['Publication and audience relevance checks', 'Useful content and contribution ideas', 'Agreed messaging and approval responsibilities'], output: 'An outreach plan with a clear reason for each approach.' },
  { id: 'outreach', icon: Link2, label: 'Earn relevant references', title: 'Make a useful, individual approach.', text: 'We contact suitable editors or resource owners with an approved contribution. That may be an expert insight, a helpful guide, a missing attribution or a replacement for an outdated resource.', items: ['Personalised editorial outreach', 'Link reclamation and unlinked-mention follow-up', 'Documented responses and appropriate follow-up'], output: 'An activity log and any links or mentions earned.' },
  { id: 'reporting', icon: ChartNoAxesCombined, label: 'Report and refine', title: 'Connect placements to the wider picture.', text: 'We review what was published, whether the reference still works and what relevant traffic it brings. Your lead feedback helps us decide which opportunities deserve more attention.', items: ['Live placement and destination checks', 'Referral traffic and enquiry review where available', 'Next-cycle recommendations'], output: 'A readable report with outcomes and next priorities.' },
];

function OutreachGraphic() {
  return <div className="off-network" role="img" aria-label="Relevant publications, useful resources and industry listings connect readers with your business">
    <svg viewBox="0 0 480 360" aria-hidden="true" className="off-network-lines"><path d="M90 70 Q240 70 240 180 M390 85 Q240 85 240 180 M95 290 Q240 290 240 180 M390 290 Q240 290 240 180"/><circle cx="240" cy="180" r="105"/><circle cx="240" cy="180" r="145"/></svg>
    <div className="off-network-centre"><Link2 size={32}/><strong>Your business</strong><span>Expertise worth discovering</span></div>
    <div className="off-network-node off-node-publication"><FileText size={22}/><span>Industry publications</span></div>
    <div className="off-network-node off-node-resource"><Search size={22}/><span>Useful resources</span></div>
    <div className="off-network-node off-node-listing"><MapPin size={22}/><span>Relevant listings</span></div>
    <div className="off-network-node off-node-mention"><MessageSquare size={22}/><span>Earned mentions</span></div>
  </div>;
}

function OutreachProcess() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % process.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + process.length) % process.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = process.length - 1;
    else return;
    event.preventDefault(); setActive(next); buttons.current[next]?.focus();
  }
  return <div className="off-process-layout"><div className="off-process-tabs" role="tablist" aria-label="Link-building process" aria-orientation="vertical">{process.map(({ id, icon: Icon, label }, i) => <button key={id} type="button" id={`off-tab-${id}`} role="tab" aria-controls={`off-panel-${id}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} ref={el => { buttons.current[i] = el; }} onClick={() => setActive(i)} onKeyDown={event => onKeyDown(event, i)}><Icon size={22}/><span>{label}</span></button>)}</div><div>{process.map(({ id, icon: Icon, title, text, items, output }, i) => <div className="off-process-panel" key={id} id={`off-panel-${id}`} role="tabpanel" aria-labelledby={`off-tab-${id}`} tabIndex={0} hidden={active !== i}><span className="off-icon"><Icon size={30}/></span><h3>{title}</h3><p>{text}</p><ul className="off-checklist">{items.map(item => <li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul><p className="off-output"><strong>What you receive</strong>{output}</p></div>)}</div></div>;
}

export default function OffPageSEO({ service }: { service: Service }) {
  return <div className="off-page">
    <section className="off-hero"><div className="container"><Breadcrumbs items={[{ label: 'SEO', href: '/seo/' }, { label: 'Off-Page SEO' }]}/><div className="off-hero-grid"><div><span className="eyebrow">OFF-PAGE SEO & LINK BUILDING</span><h1>Off-page SEO. <span>Build your presence beyond your website.</span></h1><p>Put your expertise in front of the people who matter. JustGrow helps your business earn relevant links, useful mentions and new opportunities for discovery.</p><a className="button off-primary" href="#off-enquiry" data-event="service_cta_click" data-service="off-page-seo">Discuss Your Off-Page SEO</a></div><OutreachGraphic/></div></div></section>

    <section className="off-intro"><div className="container"><span className="eyebrow">BASED IN HYDERABAD. SUPPORTING BUSINESSES ACROSS INDIA.</span><h2>Off-page SEO services.<br/><span>Relevant links. Stronger connections.</span></h2><p>Off-page SEO builds your presence beyond your own website through editorial links, business references and relevant mentions. Our link-building services connect useful content with the publications, resources and audiences that have a reason to care about it.</p></div></section>

    <section className="off-consult section"><div className="container off-consult-grid"><div className="off-consult-copy"><span className="eyebrow">TURN YOUR EXPERTISE INTO OPPORTUNITY</span><h2>Give the right people<br/>more ways to find you.</h2><p>Strong service pages deserve to be discovered. We look beyond your website to find relevant places where your knowledge, resources and business information can help a reader.</p><h3>A plan built around your market</h3><p>Whether you serve customers in Hyderabad or sell across India, we select opportunities around your industry, audience and priority pages.</p><h3>Quality you can evaluate</h3><p>Every prospect needs a reason: a relevant readership, useful context and a credible editorial purpose. You see the research, approved outreach and earned outcomes.</p><ul className="off-checklist"><li><Check size={18}/>Backlink and competitor research</li><li><Check size={18}/>Editorial outreach and link reclamation</li><li><Check size={18}/>Relevant business references and reporting</li></ul><div className="off-consult-note"><strong>A useful starting point</strong><p>Share your website, target customers and main SEO goal. We will help identify the off-page work that fits your wider marketing plan.</p></div></div><div id="off-enquiry"><EnquiryForm initialService="off-page-seo" eyebrow="LET'S DISCUSS YOUR WEBSITE" heading="Request an off-page SEO plan"/></div></div></section>

    <section className="section off-benefits"><div className="container"><div className="off-centred-heading"><span className="eyebrow">WHAT THIS MEANS FOR YOUR BUSINESS</span><h2>Make your expertise<br/>go further.</h2><p>Build a presence that supports discovery, credibility and more informed customer conversations.</p></div><div className="off-benefit-grid">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><span className="off-icon"><Icon size={28}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section container off-scope"><div className="section-heading"><div><span className="eyebrow">OUR OFF-PAGE SEO SERVICES</span><h2>The right work for<br/>your backlink profile.</h2></div><p>A proposal defines the priorities, outreach responsibilities and any content needed to support them.</p></div><div className="off-scope-grid">{service.scope.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="section off-process"><div className="container"><div className="off-centred-heading"><span className="eyebrow">FROM RESEARCH TO RELEVANT COVERAGE</span><h2>Our link-building process.</h2><p>Clear priorities, approved outreach and a record of what happened.</p></div><OutreachProcess/></div></section>

    <section className="off-banner"><div className="container"><div><h2>Ready to build a more credible online presence?</h2><p>Start with your website, your audience and the opportunities worth pursuing.</p></div><a className="button off-primary" href="#off-enquiry" data-event="service_cta_click" data-service="off-page-seo">Let's Discuss Your Website</a></div></section>

    <section className="section container off-reporting"><div><span className="eyebrow">MEASUREMENT WITH CONTEXT</span><h2>Know what the<br/>work is achieving.</h2><p>{service.measures}</p><p>Off-page SEO works best alongside useful content, sound technical foundations and clear landing pages. We keep those dependencies visible when planning the work.</p></div><div className="off-report-card"><h3>Your reporting should show</h3><ul className="off-checklist"><li><Check size={18}/>Research completed and opportunities selected</li><li><Check size={18}/>Outreach activity and publisher responses</li><li><Check size={18}/>Earned links, mentions and restored references</li><li><Check size={18}/>Relevant referral visits and enquiries, where measurable</li></ul><a className="text-link" href="/seo/search-engine-optimization/">Explore our wider SEO service</a></div></section>

    <section className="section off-faq"><div className="container"><div className="off-centred-heading"><span className="eyebrow">BEFORE WE GET STARTED</span><h2>Off-page SEO FAQs.</h2></div><FAQs items={service.faqs}/></div></section>

  </div>;
}
