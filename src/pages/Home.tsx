import { useState } from 'react';
import { Store, Factory, Sprout, Target } from 'lucide-react';
import { CTA, FAQs } from '../components/SiteLayout';
import { BusinessGrowthVisual } from '../components/BusinessGrowthVisual';
import { HomeServiceVisual } from '../components/HomeServiceVisual';
import { services } from '../data/services';
import { servicePath } from '../data/site';

const homeFaqs: [string, string][] = [
  ['How will JustGrow help you to get more enquiries?', 'We use SEO and targeted ads to reach potential customers, then improve your website so they can understand your offer and contact you easily.'],
  ['Which service does my business need?', 'We review your goals, website and current marketing, then recommend the work that addresses your biggest gap and fits your budget.'],
  ['Can you improve my existing website and ads?', 'Yes. We review your pages, campaigns and enquiry process to find what needs improving. A new website is only recommended when needed.'],
  ['Can you help customers find my business locally?', 'Yes. Our local SEO work improves your business profile, location pages and service information to help nearby customers discover you.'],
  ['How much will it cost?', 'Pricing depends on the services and work you need. Your proposal explains the deliverables, service fees and any separate advertising budget before work begins.'],
  ['How soon can I expect results?', 'Ads can begin bringing visitors once live; SEO takes longer to build visibility. Enquiries depend on your offer, competition and website. We agree review points before starting.'],
  ['How will I know the marketing is working?', 'We track relevant traffic and enquiries, then use your feedback on lead quality to decide which pages and campaigns need improving.'],
  ['How do I get started with JustGrow?', 'Send us your website, target customers and main business goal through the contact form. We will discuss your needs and suggest a starting plan.'],
];

const pillars = [
  { title: 'SEO & AI Search', desc: 'Help buyers find your business when they need what you sell.', work: 'We improve service pages, technical foundations and local visibility, with AEO and GEO support for relevant customer questions.', group: 'seo', url: '/seo/', tag: 'GET DISCOVERED', visual: 'search' as const },
  { title: 'Paid Advertising', desc: 'Reach potential customers with a relevant offer and a controlled budget.', work: 'We plan search and social campaigns, align landing pages and review which enquiries come from your advertising spend.', group: 'sem', url: '/sem/', tag: 'REACH THE RIGHT BUYERS', visual: 'ads' as const },
  { title: 'Website Development', desc: 'Give visitors the clarity and confidence to contact your business.', work: 'We create mobile-friendly websites with useful service content, clear calls to action and a straightforward enquiry journey.', group: 'web', url: '/website-development/', tag: 'MAKE ENQUIRING EASY', visual: 'website' as const },
];

const businessCards = [
  { title: 'Local service businesses', text: 'Help nearby customers discover your services, check your location and request a quote through local SEO.', href: '/seo/local-seo/', link: 'Explore Local SEO', icon: Store },
  { title: 'B2B & manufacturers', text: 'Explain your products, capabilities and buying requirements so relevant buyers can assess your business.', href: '/seo/aeo/', link: 'Explore AEO', icon: Factory },
  { title: 'Growing small businesses', text: 'Create a clear website that introduces your services and gives interested customers an easy way to enquire.', href: '/website-development/', link: 'Explore Website Development', icon: Sprout },
  { title: 'Businesses testing demand', text: 'Use focused advertising and relevant landing pages to learn which audiences and offers bring useful enquiries.', href: '/sem/', link: 'Explore Paid Advertising', icon: Target },
];

export default function Home() {
  const [goal, setGoal] = useState('search');
  const choices = [
    { id: 'search', label: 'Help more customers find us', text: 'Start with the searches, questions and locations that matter to your buyers. Explore organic search and local visibility support.', slugs: ['search-engine-optimization', 'aeo', 'geo', 'local-seo'] },
    { id: 'ads', label: 'Generate enquiries through advertising', text: 'Match your offer to a suitable audience, channel and landing page. Set an evaluation budget and track confirmed enquiries.', slugs: ['google-ads', 'social-media-ads', 'bing-ads'] },
    { id: 'website', label: 'Make our website work harder', text: 'Explain your services, answer buying questions and make the next step easy on every screen.', slugs: ['website-development', 'on-page-seo'] },
  ];
  const selected = choices.find(c => c.id === goal)!;
  return <div className="home-page">
    <div className="home-hero-band"><section className="hero container home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><i className="status-dot"/> JUSTGROW / BUILT AROUND YOUR BUSINESS</span>
        <h1>AI Powered Digital Marketing Agency <span>in Hyderabad.</span></h1>
        <p className="hero-subhead">Get found by the right people.<br/>Give them a reason to choose you.</p>
        <p className="hero-description">JustGrow connects SEO, AI search, paid advertising and website development to help your business attract relevant customers and generate enquiries. Based in Hyderabad, we build practical marketing plans for businesses across India.</p>
        <div className="hero-actions"><CTA>Discuss Your Growth Goals</CTA><a className="text-link home-secondary-cta" href="#services">Explore Our Services</a></div>
      </div>
      <BusinessGrowthVisual/>
    </section></div>

    <div className="principles"><div className="container"><span>YOUR GOALS GUIDE THE WORK</span><p><i/> Relevant visibility</p><p><i/> Clearer customer journeys</p><p><i/> Enquiry-focused measurement</p></div></div>

    <section className="section container home-services" id="services">
      <div className="section-heading"><div><span className="eyebrow">SERVICES WITH A PURPOSE</span><h2>Digital marketing services<br/>for business growth.</h2></div><p>Bring discovery, advertising and your website together. Each service addresses a different part of how a prospect becomes a customer.</p></div>
      <div className="pillar-grid">{pillars.map(p => <article className="pillar" key={p.group}>
        <div className="pillar-meta"><span>{p.tag}</span></div>
        <HomeServiceVisual kind={p.visual}/>
        <h3><a href={p.url}>{p.title}</a></h3><p className="pillar-benefit">{p.desc}</p><p className="pillar-work"><strong>What we work on</strong>{p.work}</p>
        <div className="pillar-links">{services.filter(s => s.group === p.group).map(s => <a key={s.slug} href={servicePath(s)}>{s.name}</a>)}</div>
      </article>)}</div>
    </section>

    <section className="dark-section"><div className="container journey-layout"><div><span className="eyebrow">AI ASSISTED. HUMAN REVIEWED.</span><h2>Smarter research.<br/>Decisions grounded<br/>in your business.</h2><p>AI helps organise research, explore customer questions and develop ideas for content and campaigns. Our role is to check those ideas against your offer, your audience and the evidence available.</p><p>Every recommendation still needs a business reason. We connect the research to useful pages, focused campaigns and a clear next step for your customers.</p><a className="button home-about-cta" href="/about/">Get to know JustGrow</a></div><div className="journey"><div><h3>Understand buying intent</h3><p>Explore what customers ask, compare and need to know before they contact you.</p></div><div><h3>Review and put ideas to work</h3><p>Check business facts and turn relevant ideas into content, campaigns and website improvements.</p></div><div><h3>Learn from real enquiries</h3><p>Use tracking and your sales feedback to understand which activity brings suitable prospects.</p></div></div></div></section>

    <section className="section container goal-section"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Start with the problem<br/>you want to solve.</h2><p>You do not need every marketing service at once. Choose your priority to see where we can help.</p></div><div className="goal-selector"><fieldset><legend className="sr-only">Your business goal</legend>{choices.map(c => <label className={goal === c.id ? 'goal-option selected' : 'goal-option'} key={c.id}><input type="radio" name="goal" value={c.id} checked={goal === c.id} onChange={() => setGoal(c.id)}/>{c.label}</label>)}</fieldset><div className="goal-result" aria-live="polite"><p>{selected.text}</p><div>{selected.slugs.map(slug => { const s = services.find(s => s.slug === slug)!; return <a className="chip" key={slug} href={servicePath(s)}>{s.name}</a>; })}</div><CTA slug={selected.slugs[0]}>Discuss This Goal</CTA></div></div></section>

    <section className="section soft-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FROM PLAN TO PROGRESS</span><h2>A clear scope.<br/>A practical way forward.</h2></div><p>Know what is being done, why it matters and how you will review it together.</p></div><div className="process-grid">{[
      ['Understand your business', 'We discuss your services, customers, target locations and current website or campaigns.'],
      ['Choose the priorities', 'We define the work, deliverables, budget and access needed to address your main obstacle.'],
      ['Build and launch', 'We prepare the agreed pages, campaigns and tracking, with checks before changes go live.'],
      ['Review and improve', 'We assess search visibility, confirmed enquiries and your lead feedback to decide the next steps.'],
    ].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section container sample-layout"><div className="sample-board"><div className="board-heading"><strong>A focused starting plan</strong></div>{[
      ['Explain your strongest service', 'Website', 'Help buyers understand the offer and request a quote.'],
      ['Reach a relevant audience', 'Discovery', 'Focus search or advertising on the customers you want.'],
      ['Check the enquiries', 'Measurement', 'Review lead quality before expanding the work.'],
    ].map(([title, tag, text]) => <div className="board-row" key={title}><div><strong>{title}</strong><p>{text}</p></div><small>{tag}</small></div>)}<div className="board-foot">Your priorities depend on your starting point and budget.</div></div><div><span className="eyebrow">FOR SMALL BUSINESSES WITH BIG DECISIONS</span><h2>Make your next marketing investment count.</h2><p>For small business growth in India, the best digital marketing services are the ones that fit your customers, capacity and budget. A local service business may need better local discovery. A B2B company may first need pages that explain its capabilities.</p><p>As a digital marketing service company in India, JustGrow helps you choose a focused starting scope and understand the cost of each part. We separate service fees, advertising spend and website work in the proposal.</p><CTA>Discuss Your Growth Goals</CTA></div></section>

    <section className="section container use-cases"><div className="section-heading"><div><span className="eyebrow">BASED IN HYDERABAD. SUPPORTING BUSINESSES ACROSS INDIA.</span><h2>Built around how<br/>your customers buy.</h2></div><p>From nearby service searches to national supplier comparisons, we match the work to your market.</p></div><div className="use-case-grid">{businessCards.map(({ title, text, href, link, icon: Icon }) => <a className="business-card" key={title} href={href}><span className="business-card-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.7}/></span><h3>{title}</h3><p>{text}</p><span className="business-card-link">{link}</span></a>)}</div></section>

    <section className="why-section"><div className="container"><span className="eyebrow">WHY WORK WITH JUSTGROW?</span><h2>Your business goals.<br/><span>A plan you can understand.</span></h2><div className="why-grid"><p><strong>Work you can see.</strong> Agree which pages, campaigns and improvements are included before the project starts.</p><p><strong>Channels that fit.</strong> Choose services around your audience, budget and ability to follow up on enquiries.</p><p><strong>Connected implementation.</strong> Keep your search content, advertising messages and website experience working towards the same goal.</p><p><strong>Meaningful reviews.</strong> Discuss what was done, what the evidence shows and what your business should prioritise next.</p></div></div></section>

    <section className="section home-faq" id="home-faq"><div className="container faq-section"><div className="home-faq-intro"><h2>Frequently Asked Questions</h2><p>How we help your business attract customers and generate enquiries.</p><div className="home-faq-help"><h3>Have a different question?</h3><p>Tell us about your business and the challenge you want to solve.</p><CTA>Ask Us About Your Project</CTA></div></div><FAQs items={homeFaqs}/></div></section>
  </div>;
}
