import { Search, Target, MousePointerClick, Check } from 'lucide-react';

export function BusinessGrowthVisual() {
  const steps = [
    { icon: Search, title: 'Help customers find you', channel: 'SEO & AI SEARCH', text: 'Improve the pages that answer your customers’ searches and buying questions.' },
    { icon: Target, title: 'Bring the right people to your website', channel: 'PAID ADVERTISING', text: 'Focus campaigns on relevant searches, audiences and locations.' },
    { icon: MousePointerClick, title: 'Make it easier to enquire', channel: 'WEBSITE DEVELOPMENT', text: 'Explain your offer clearly and make calls, forms and WhatsApp easy to reach.' },
  ];
  return <aside className="growth-visual" aria-label="How JustGrow helps your business">
    <div className="growth-visual-heading"><span className="eyebrow">HOW WE HELP YOUR BUSINESS</span><p>From being found to being contacted.</p></div>
    <div className="growth-steps">{steps.map(({ icon: Icon, title, channel, text }) => <div className="growth-step" key={title}>
      <span className="growth-step-icon" aria-hidden="true"><Icon size={23}/></span>
      <div><span className="growth-channel">{channel}</span><h2>{title}</h2><p>{text}</p></div>

    </div>)}</div>
    <div className="growth-result"><Check size={18} aria-hidden="true"/><p>The goal: enquiries from people who need what you sell.</p></div>
  </aside>;
}
