import { Search, FileText, MousePointerClick, ClipboardCheck, ListChecks, Users, MapPin, Check, PanelsTopLeft, MessageCircle, BookOpen, Globe2, Link2, ShieldCheck } from 'lucide-react';
import type { SeoPageContent } from '../data/seoPageContent';

export function SEOServiceVisual({ kind }: { kind: SeoPageContent['kind'] }) {
  if (kind === 'aeo') return <div className="seo-visual seo-answer-visual" role="img" aria-label="A customer question leads to a direct explanation with useful supporting detail">
    <span className="seo-visual-kicker">FROM A QUESTION TO CLARITY</span>
    <div className="seo-question-card"><MessageCircle size={24}/><div><span>Customer question</span><strong>What does an SEO audit cover?</strong></div></div>
    <div className="seo-answer-card"><span className="seo-answer-label"><FileText size={18}/> A direct explanation</span><p>An SEO audit reviews technical access, page content and internal links, then prioritises improvements around your website and business goals.</p><div className="seo-answer-detail"><BookOpen size={20}/><div><strong>Give the answer useful context</strong><span>Scope, evidence and a clear next step.</span></div></div></div>
    <span className="seo-visual-foot"><Check size={18}/> Real questions. Accurate answers.</span>
  </div>;

  if (kind === 'geo') return <div className="seo-visual seo-brand-visual" role="img" aria-label="Consistent business facts connect your website, useful expertise and relevant external references">
    <span className="seo-visual-kicker">A COHERENT PICTURE OF YOUR BUSINESS</span>
    <div className="seo-brand-centre"><span className="seo-brand-symbol"><Globe2 size={31}/></span><div><strong>Your business, clearly explained.</strong><p>What you do. Who you help. Where you work.</p></div></div>
    <div className="seo-source-grid">{[
      { icon: FileText, title: 'Your website', text: 'Clear services and approved facts.' },
      { icon: BookOpen, title: 'Your expertise', text: 'Useful detail and supporting evidence.' },
      { icon: Link2, title: 'Relevant references', text: 'Accurate profiles and external context.' },
    ].map(({ icon: Icon, title, text }) => <div className="seo-source-card" key={title}><Icon size={23}/><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    <span className="seo-visual-foot"><ShieldCheck size={18}/> Consistency across the information people find.</span>
  </div>;

  if (kind === 'local') return <div className="seo-visual seo-local-visual" role="img" aria-label="Accurate business information connects people in your real service area with your business">
    <div className="seo-map" aria-hidden="true"><svg viewBox="0 0 460 360" preserveAspectRatio="none"><path className="seo-map-block" d="M0 0H160L130 95H0ZM210 0H460V75L240 110ZM0 155L110 140L135 265H0ZM205 160L460 125V270L235 250ZM0 315L140 300L165 360H0ZM260 310L460 325V360H270Z"/><path className="seo-map-road" d="M180 0 160 120 190 280 220 360M0 120 160 120 460 95M0 290 190 280 460 300"/></svg><MapPin className="seo-map-pin seo-map-pin-main" size={54}/><MapPin className="seo-map-pin seo-map-pin-secondary" size={31}/><div className="seo-map-area">Your genuine service area</div></div>
    <div className="seo-local-card"><span className="seo-visual-kicker">LOCAL DISCOVERY</span><strong>Make your business easy to find.</strong><p>Accurate details. Useful local pages. A clear way to enquire.</p><span className="seo-visual-foot"><Check size={17}/> Real locations and relevant services</span></div>
  </div>;

  if (kind === 'onpage') return <div className="seo-visual seo-page-visual" role="img" aria-label="A useful service page connects a relevant title, clear answers and an easy next step">
    <div className="seo-browser-bar" aria-hidden="true"><span/><span/><span/><p>Your service page</p><PanelsTopLeft size={17}/></div>
    <div className="seo-browser-copy"><span className="seo-visual-kicker">MATCH THE CUSTOMER'S INTENT</span><strong>A clear offer.<br/>Answers that help.</strong><div className="seo-page-lines" aria-hidden="true"><i/><i/></div><div className="seo-page-checks"><span><Check size={17}/> Descriptive titles and headings</span><span><Check size={17}/> Useful service information</span><span><Check size={17}/> Relevant internal links</span></div><div className="seo-visual-action">Make an enquiry<MousePointerClick size={21}/></div></div>
  </div>;

  const expert = kind === 'expert';
  const steps = expert ? [
    { icon: Search, title: 'Understand the issue', text: 'Review the pages, data and context.' },
    { icon: ListChecks, title: 'Choose the priorities', text: 'Agree what matters and who will do it.' },
    { icon: ClipboardCheck, title: 'Put the plan to work', text: 'Support implementation and check changes.' },
  ] : [
    { icon: Search, title: 'Relevant discovery', text: 'Connect customer searches to your offer.' },
    { icon: FileText, title: 'Useful website pages', text: 'Explain your services and answer questions.' },
    { icon: MousePointerClick, title: 'A clearer enquiry journey', text: 'Make the next step easy to understand.' },
  ];
  return <div className={`seo-visual seo-plan-visual seo-plan-${kind}`} role="img" aria-label={expert ? 'Expert SEO support moves from diagnosis to priorities and checked implementation' : 'A connected SEO plan helps visitors discover, understand and contact your business'}>
    <div className="seo-plan-heading"><span className="seo-visual-kicker">{expert ? 'PRACTICAL SEO SUPPORT' : 'A CONNECTED SEO PLAN'}</span><strong>{expert ? 'A clear way forward.' : 'From search to a useful conversation.'}</strong></div>
    <div className="seo-plan-steps">{steps.map(({ icon: Icon, title, text }) => <div className="seo-plan-step" key={title}><span className="seo-plan-icon"><Icon size={23}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    <span className="seo-visual-foot">{expert ? <Users size={19}/> : <Check size={19}/>} {expert ? 'Working alongside your team.' : 'Priorities shaped by your business.'}</span>
  </div>;
}
