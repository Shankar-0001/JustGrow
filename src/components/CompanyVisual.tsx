import { Search, Target, MessageCircle, Check, Globe2, Users, ClipboardCheck } from 'lucide-react';

export function CompanyVisual({ contact = false }: { contact?: boolean }) {
  const stages = contact ? [
    { icon: Globe2, title: 'Your business', text: 'What you offer and who you want to reach.' },
    { icon: Target, title: 'Your goal', text: 'The challenge you want help solving.' },
    { icon: MessageCircle, title: 'Our conversation', text: 'A suitable approach and a clear next step.' },
  ] : [
    { icon: Search, title: 'Be found', text: 'Connect with people who need your services.' },
    { icon: Users, title: 'Be understood', text: 'Explain your offer and answer buying questions.' },
    { icon: MessageCircle, title: 'Start a conversation', text: 'Make it easier for interested people to enquire.' },
  ];
  return <div className="seo-visual seo-plan-visual seo-plan-expert company-visual" role="img" aria-label={contact ? 'Share your business and goal to start a conversation about the right next step.' : 'Search, clear service information and simple contact journeys work together to help your next customer.'}><div className="seo-plan-heading"><span className="seo-visual-kicker">{contact ? 'A USEFUL STARTING POINT' : 'YOUR CUSTOMER JOURNEY, CONNECTED'}</span><strong>{contact ? 'Start with what matters to you.' : 'Your business at the centre of the plan.'}</strong></div><div className="seo-plan-steps">{stages.map(({ icon: Icon, title, text }) => <div className="seo-plan-step" key={title}><span className="seo-plan-icon"><Icon size={23}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div><span className="seo-visual-foot">{contact ? <ClipboardCheck size={19}/> : <Check size={19}/>} {contact ? 'You do not need a finished brief to get in touch.' : 'Search. Advertising. Websites. Working together.'}</span></div>;
}
