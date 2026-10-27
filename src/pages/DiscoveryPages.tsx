import { Search, MapPin, FileText, Link2, MessageCircle, Globe2, Users, PanelsTopLeft, Code2, RefreshCw, MousePointerClick, Check } from 'lucide-react';
import { Breadcrumbs, CTA, FAQs } from '../components/SiteLayout';
import { SEOServiceVisual } from '../components/SEOServiceVisual';
import { services } from '../data/services';
import { servicePath } from '../data/site';

const searchOptions = [
  { slug: 'search-engine-optimization', title: 'Managed SEO', icon: Search, text: 'Improve your technical foundations, service pages and search visibility with an ongoing plan.', action: 'Explore Managed SEO' },
  { slug: 'local-seo', title: 'Local SEO', icon: MapPin, text: 'Help nearby customers find your business through accurate profiles and useful location pages.', action: 'Explore Local SEO' },
  { slug: 'on-page-seo', title: 'On-page SEO', icon: FileText, text: 'Make your pages clearer with relevant content, descriptive headings and useful internal links.', action: 'Explore On-page SEO' },
  { slug: 'off-page-seo', title: 'Off-page SEO', icon: Link2, text: 'Build relevant external references through research, useful resources and targeted outreach.', action: 'Explore Off-page SEO' },
  { slug: 'aeo', title: 'Answer Engine Optimisation', icon: MessageCircle, text: 'Answer the questions buyers ask so they can understand your services and make informed decisions.', action: 'Explore AEO' },
  { slug: 'geo', title: 'Generative Engine Optimisation', icon: Globe2, text: 'Make your business information clear and consistent across your website and relevant sources.', action: 'Explore GEO' },
  { slug: 'hire-seo-expert', title: 'Hire an SEO Expert', icon: Users, text: 'Get focused help with an audit, a specific search problem or ongoing implementation.', action: 'Explore Expert Support' },
];

const websiteOptions = [
  { title: 'WordPress Websites', icon: PanelsTopLeft, text: 'A business website your team can update. We organise your services, build responsive pages and set up the agreed editing tools.', fit: 'For teams that regularly update content.' },
  { title: 'Custom Website Design', icon: Code2, text: 'A website shaped around your brand and customer journey, with tailored layouts and the features your business needs.', fit: 'For businesses with specific design or functionality needs.' },
  { title: 'Website Redesign', icon: RefreshCw, text: 'Improve an outdated website with clearer content, simpler navigation and easier enquiries. Plan redirects for useful existing pages.', fit: 'For businesses improving an existing site.' },
  { title: 'Campaign Landing Pages', icon: MousePointerClick, text: 'Give each campaign a focused destination with a relevant offer, useful answers and a clear enquiry form.', fit: 'For businesses turning campaign visits into leads.' },
];

const seoFaqs: [string, string][] = [
  ['How will JustGrow help you get more enquiries through SEO?', 'We improve the pages customers search for, explain your services clearly and make contacting you easier. We review enquiries alongside search traffic.'],
  ['Which SEO service should you choose?', 'We review your website, customers and target locations first. Then we recommend managed SEO or focused help with the biggest gap.'],
  ['Can you help customers find your business locally?', 'Yes. We improve your business profile, location information and local service pages to support discovery in the areas you serve.'],
  ['Do you need AEO and GEO as well as SEO?', 'They can help when buyers use answer-based or AI-assisted search. We assess whether your business needs this work alongside its SEO foundations.'],
  ['How long does SEO take?', 'SEO usually needs several months to assess meaningful progress. Timing depends on your starting point, competition and how quickly improvements go live.'],
  ['Can JustGrow guarantee first-page rankings?', 'No. Search rankings are outside our control. We agree the work, track relevant visibility and enquiries, and explain what needs improving.'],
  ['How much do SEO services cost?', 'The cost depends on your website, target market and the work needed. We provide a defined scope and fees before you decide.'],
];

const websiteFaqs: [string, string][] = [
  ['Which type of website is right for your business?', 'We recommend WordPress, a custom build, a redesign or landing pages based on your goals, editing needs and budget.'],
  ['How will the website help you get more enquiries?', 'We make your services easy to understand and add clear contact options. Relevant traffic from SEO or advertising helps bring potential customers to those pages.'],
  ['Will your website work well on mobile?', 'Yes. We design responsive layouts and check navigation, content and enquiry forms on mobile and desktop.'],
  ['Can JustGrow redesign your existing website?', 'Yes. We review what works, improve the pages that need attention and plan redirects where existing URLs change.'],
  ['Can you update the website yourself?', 'For WordPress and other agreed CMS builds, we set up editable content and provide handover guidance. Editing options for custom sites are agreed before development.'],
  ['Are content writing and SEO included?', 'We include the agreed page structure and metadata. Copywriting and ongoing SEO are defined separately in your proposal so you know what is covered.'],
  ['How much will it cost and how long will it take?', 'Pages, features, content readiness and approvals determine the price and timeline. We confirm both after reviewing your requirements.'],
  ['What happens after launch?', 'We hand over the agreed website and guidance. Hosting, renewals, updates and ongoing support are clearly assigned in the proposal.'],
];

export default function DiscoveryPage({ kind }: { kind: 'seo' | 'website' }) {
  const web = kind === 'website';
  const slug = web ? 'website-development' : 'search-engine-optimization';
  const cta = web ? 'Discuss Your Website Project' : 'Discuss Your SEO Goals';
  const process = web ? [
    ['Understand your business', 'Agree your audience, pages, features, budget and content responsibilities.'],
    ['Design the experience', 'Review page layouts, your visual style and the path from a visit to an enquiry.'],
    ['Build and check', 'Develop the agreed pages, connect forms and check mobile layouts and key journeys.'],
    ['Launch and hand over', 'Check redirects and live pages, then hand over access and editing guidance.'],
  ] : [
    ['Review your starting point', 'Understand your services, customers, search data and existing website.'],
    ['Choose the priorities', 'Match relevant searches to useful pages and agree the most valuable improvements.'],
    ['Put the plan to work', 'Improve content, technical access, local information and relevant references.'],
    ['Review business outcomes', 'Assess search visibility and enquiries, using lead-quality feedback to guide the next steps.'],
  ];
  return <div className={`off-page discovery-page discovery-${kind}`}>
    <section className="off-hero"><div className="container"><Breadcrumbs items={[{ label: web ? 'Website Development' : 'SEO & AI Search' }]}/><div className="off-hero-grid"><div><span className="eyebrow">JUSTGROW / {web ? 'WEBSITE DESIGN & DEVELOPMENT' : 'SEO & AI SEARCH'}</span><h1>{web ? 'Website development.' : 'SEO services.'} <span>{web ? 'Make every visit easier to turn into an enquiry.' : 'Help the right customers find your business.'}</span></h1><p>{web ? 'From WordPress websites to custom designs, we build clear, mobile-friendly pages that explain your services and make it easy for customers to contact you.' : 'Connect relevant searches with useful pages and a clear next step. JustGrow brings SEO, local visibility and AI search support together around your business goals.'}</p><CTA slug={slug}>{cta}</CTA></div>{web ? <div className="website-preview"><div className="website-preview-bar"><PanelsTopLeft size={20} aria-hidden="true"/><span>Your business website</span></div><div className="website-preview-copy"><span className="eyebrow">DESIGNED AROUND YOUR CUSTOMERS</span><strong>Clear services.<br/>An easy next step.</strong><p>Help visitors understand what you do and why it matters to them.</p><div className="website-preview-features"><span><Check size={18}/> Mobile-friendly pages</span><span><Check size={18}/> Useful service information</span><span><Check size={18}/> A straightforward enquiry form</span></div><span className="website-preview-action">Your next customer starts here</span></div></div> : <SEOServiceVisual kind="managed"/>}</div></div></section>

    <section className="off-intro"><div className="container"><span className="eyebrow">BASED IN HYDERABAD. SUPPORTING BUSINESSES ACROSS INDIA.</span><h2>{web ? 'A website built for your business.' : 'Search visibility with a business purpose.'}</h2><p>{web ? 'Your website should help people understand your offer, find answers and take action. We connect design, content and development so the finished site supports both your customers and the team that maintains it.' : 'More visits matter when they come from people who need what you sell. We focus on relevant searches, clear service information and the steps that help interested visitors become enquiries.'}</p></div></section>

    <section className="section container discovery-options" id="services"><div className="off-centred-heading"><h2>{web ? 'Four ways to build a better website.' : 'Choose the SEO support your business needs.'}</h2><p>{web ? 'Choose a starting point. We will define the pages, features and platform around your requirements.' : 'Start with a complete SEO plan or focus on a specific search challenge.'}</p></div><div className={`discovery-card-grid ${web ? 'website-options' : 'search-options'}`}>{web ? websiteOptions.map(({ title, icon: Icon, text, fit }) => <article className="discovery-card" key={title}><span className="discovery-icon"><Icon size={28} aria-hidden="true"/></span><h3>{title}</h3><p>{text}</p><p className="discovery-fit">{fit}</p><CTA slug={slug}>Discuss {title === 'WordPress Websites' ? 'WordPress' : title === 'Custom Website Design' ? 'Custom Design' : title === 'Website Redesign' ? 'a Redesign' : 'Landing Pages'}</CTA></article>) : searchOptions.map(({ slug: serviceSlug, title, icon: Icon, text, action }) => <a className="discovery-card" href={servicePath(services.find(s => s.slug === serviceSlug)!)} key={serviceSlug}><span className="discovery-icon"><Icon size={28} aria-hidden="true"/></span><h3>{title}</h3><p>{text}</p><span className="discovery-card-action">{action}</span></a>)}</div></section>

    <section className="section discovery-delivery"><div className="container discovery-split"><div><span className="eyebrow">WORK YOU CAN UNDERSTAND</span><h2>{web ? 'More than a new look.' : 'A plan shaped around your customers.'}</h2><p>{web ? 'We agree what your website needs to do before development begins. Each page should answer a customer question or make a useful action easier.' : 'A local service company, a manufacturer and a growing small business need different search priorities. We choose the work around your market and the enquiries you want.'}</p><CTA slug={slug}>{cta}</CTA></div><div className="discovery-delivery-card"><h3>{web ? 'Your website scope can include' : 'Your SEO plan brings together'}</h3><ul>{(web ? ['An agreed sitemap and responsive page designs', 'Service content and clear enquiry routes', 'Page titles, descriptions and internal links', 'Tested forms and agreed integrations', 'Redirect planning for existing pages', 'Launch checks and handover guidance'] : ['Research into relevant searches and customer questions', 'Technical and content priorities for your website', 'Local visibility where it fits your service area', 'Useful answers and consistent business information', 'Enquiry tracking and feedback on lead quality', 'Clear reporting on completed work and next steps']).map(item => <li key={item}><Check size={20} aria-hidden="true"/>{item}</li>)}</ul><p>{web ? 'Hosting, domain costs, paid tools and ongoing maintenance are identified separately in your proposal.' : 'The proposal defines the deliverables, responsibilities and fees before work begins.'}</p></div></div></section>

    <section className="section container"><div className="off-centred-heading"><h2>{web ? 'From your first brief to a working website.' : 'A clear process from review to improvement.'}</h2></div><div className="discovery-process">{process.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    {web && <section className="section discovery-delivery"><div className="container"><div className="off-centred-heading"><h2>Make the website part of your growth plan.</h2><p>We check mobile usability, page performance and working enquiry routes at handover. Once visitors arrive, enquiry tracking and your lead-quality feedback help identify what to improve. Your team supplies approved business facts, brand assets and the access needed for launch.</p></div><div className="related-grid">{[
      ['on-page-seo', 'Improve your service pages', 'Connect page content, titles and internal links to the searches that matter.'],
      ['search-engine-optimization', 'Build relevant search traffic', 'Support the new website with an ongoing SEO plan around your customers.'],
      ['google-ads', 'Give campaigns a clear destination', 'Match advertising with relevant landing pages and verified enquiries.'],
    ].map(([relatedSlug, title, text]) => <a href={servicePath(services.find(s => s.slug === relatedSlug)!)} key={relatedSlug}><h3>{title}</h3><p>{text}</p></a>)}</div></div></section>}

    <section className="section off-faq"><div className="container"><div className="off-centred-heading"><h2>Frequently Asked Questions</h2><p>{web ? 'Clear answers about your website project.' : 'What to know before starting SEO with JustGrow.'}</p></div><FAQs items={web ? websiteFaqs : seoFaqs}/></div></section>

  </div>;
}
