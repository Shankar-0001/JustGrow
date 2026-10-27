import { Search, Target, MousePointerClick, MessageCircle, Users, PanelsTopLeft, Check, Megaphone, FileCheck2, Compass } from 'lucide-react';
import type { SEMPageContent } from '../data/semPageContent';

const stageIcons = [Target, MousePointerClick, MessageCircle];

export function SEMServiceVisual({ content }: { content: SEMPageContent }) {
  return <div className={`seo-visual sem-visual sem-visual-${content.kind}`} role="img" aria-label={content.visualHeading + ' ' + content.visualStages.map(([title, text]) => `${title}: ${text}`).join(' ')}>
    <div className="sem-visual-art" aria-hidden="true">
      {content.kind === 'google' && <><div className="sem-search-symbol"><Search size={30}/><span>A customer searches for your service</span></div><div className="sem-intent-tags"><span>Relevant need</span><span>Right location</span><span>Clear offer</span></div></>}
      {content.kind === 'social' && <div className="sem-creative-art"><span className="sem-creative-icon"><Megaphone size={45}/></span><div><span className="sem-art-label">CREATIVE WITH A PURPOSE</span><strong>A problem they recognise.<br/>An offer they understand.</strong></div><span className="sem-audience-icon"><Users size={32}/></span></div>}
      {content.kind === 'microsoft' && <div className="sem-channel-art"><div><Search size={26}/><span>Search opportunity</span></div><span className="sem-channel-link"/><div><FileCheck2 size={26}/><span>Validated campaign</span></div></div>}
      {content.kind === 'chatgpt' && <div className="sem-research-art"><Compass size={37}/><div><span className="sem-art-label">DECISIONS START WITH QUESTIONS</span><strong>Explore. Compare. Consider.</strong></div></div>}
      {content.kind === 'sem' && <div className="sem-overview-art"><span><Search size={29}/>Search</span><span><Megaphone size={29}/>Social</span><span><PanelsTopLeft size={29}/>Your website</span></div>}
    </div>
    <div className="sem-visual-copy"><span className="seo-visual-kicker">CONNECTING ADS WITH YOUR BUSINESS</span><strong className="sem-visual-title">{content.visualHeading}</strong><div className="sem-visual-stages">{content.visualStages.map(([title, text], i) => { const Icon = stageIcons[i]; return <div className="sem-visual-stage" key={title}><span><Icon size={22}/></span><div><strong>{title}</strong><p>{text}</p></div></div>; })}</div><span className="seo-visual-foot"><Check size={18}/>A clear offer. A useful next step.</span></div>
  </div>;
}
