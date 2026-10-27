import { Search, Megaphone, Compass, PanelsTopLeft } from 'lucide-react';
import SEOServicePage from './SEOServicePage';
import { SEMServiceVisual } from '../components/SEMServiceVisual';
import { semPageContent } from '../data/semPageContent';
import { services } from '../data/services';
import { servicePath, type Service } from '../data/site';

const channels = [
  { slug: 'google-ads', icon: Search, title: 'Google Ads', fit: 'Capture active search demand', text: 'Reach people looking for your service and guide them to a focused landing page.', action: 'Explore Google Ads' },
  { slug: 'social-media-ads', icon: Megaphone, title: 'Social Media Ads', fit: 'Introduce your offer to suitable audiences', text: 'Connect useful creative with a clear offer and an enquiry journey your team can follow up.', action: 'Explore Social Media Ads' },
  { slug: 'bing-ads', icon: PanelsTopLeft, title: 'Microsoft Advertising', fit: 'Explore another paid search opportunity', text: 'Assess additional demand with reviewed campaigns and consistent lead-quality measures.', action: 'Explore Microsoft Ads' },
  { slug: 'chatgpt-ads', icon: Compass, title: 'ChatGPT Ads', fit: 'Assess a new route to customer interest', text: 'Check eligibility and prepare a relevant offer, destination and supported campaign test.', action: 'Explore ChatGPT Ads' },
];

export default function SEMServicePage({ service }: { service?: Service }) {
  const hub = !service;
  const current = service || { ...services.find(s => s.slug === 'google-ads')!, slug: 'general', name: 'Paid Advertising', related: channels.map(c => c.slug) };
  const content = semPageContent[hub ? 'sem' : current.slug];
  const introduction = hub ? <section className="section container sem-channels"><div className="off-centred-heading"><span className="eyebrow">CHOOSE THE ROLE BEFORE THE CHANNEL</span><h2>Find the advertising service that fits your goal.</h2><p>Explore how each channel can support a different part of your customer journey.</p></div><div className="sem-channel-grid">{channels.map(({ slug, icon: Icon, title, fit, text, action }) => <a key={slug} href={servicePath(services.find(s => s.slug === slug)!)}><span className="off-icon"><Icon size={28}/></span><h3>{title}</h3><strong>{fit}</strong><p>{text}</p><span className="sem-channel-action">{action}</span></a>)}</div></section> : undefined;
  const journey = <section className="section container sem-journey"><div className="off-centred-heading"><span className="eyebrow">HOW TRAFFIC BECOMES A BUSINESS OPPORTUNITY</span><h2>{content.journeyHeading}</h2></div><div className="sem-journey-grid">{content.journey.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
  return <SEOServicePage service={current} pageContent={content} visual={<SEMServiceVisual content={content}/>} introduction={introduction} journey={journey}/>;
}
