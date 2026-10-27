import { Eye, MessageCircle, Lightbulb, RefreshCw, Target, ClipboardCheck, Users, Search, Megaphone, PanelsTopLeft, FileText, Settings2, Handshake, MapPin } from 'lucide-react';
import { Breadcrumbs } from '../components/SiteLayout';
import { CompanyVisual } from '../components/CompanyVisual';

const values = [
  { icon: Eye, title: 'Clarity in the work', text: 'Understand what we recommend, why it matters and what is included. We keep priorities, costs and responsibilities visible.' },
  { icon: MessageCircle, title: 'Open conversations', text: 'Your business knowledge shapes the plan. We ask useful questions, explain decisions and agree how feedback and approvals will work.' },
  { icon: Lightbulb, title: 'Purposeful ideas', text: 'Creative and technical choices start with a customer need. Every page, message and campaign should have a useful job to do.' },
  { icon: RefreshCw, title: 'Learning through action', text: 'We review the work alongside customer feedback and available data, then use what we learn to improve the next decision.' },
];
const advantages = [
  { icon: Target, title: 'Your goals come first', text: 'We start with the customers you want to reach and the business problem you need to solve.' },
  { icon: ClipboardCheck, title: 'A defined scope', text: 'Deliverables, costs and responsibilities are discussed before the work begins.' },
  { icon: Users, title: 'A coordinated approach', text: 'Search, advertising and websites work together around the same customer journey.' },
  { icon: FileText, title: 'Useful communication', text: 'Know what has changed, what needs your input and what the next priorities are.' },
  { icon: Search, title: 'Customer-focused content', text: 'Give buyers clear service information and answers to the questions that influence a decision.' },
  { icon: Settings2, title: 'Practical implementation', text: 'Turn the agreed plan into page, campaign and website improvements that can be reviewed.' },
  { icon: Handshake, title: 'Collaboration that fits', text: 'Work with your existing team and build on the assets and knowledge your business already has.' },
  { icon: RefreshCw, title: 'Learning from leads', text: 'Use enquiry quality and sales feedback to guide improvements beyond the initial click.' },
];
export function About() {
  return <div className="off-page company-page about-page about-reference">
    <section className="off-hero about-banner"><div className="about-banner-art" aria-hidden="true"><div/><div/><div/></div><div className="container"><Breadcrumbs items={[{label:'About'}]}/><div className="about-banner-copy"><span className="eyebrow">A DIGITAL MARKETING AGENCY IN HYDERABAD</span><h1>About <span>JustGrow.</span></h1><p>We connect search, advertising and websites to help businesses get discovered, explain their value and turn interest into useful customer conversations.</p><a className="button off-primary" href="/contact/" data-event="service_cta_click">Contact JustGrow</a></div></div></section>

    <section className="section off-benefits about-values"><div className="container"><div className="about-section-title"><span className="eyebrow">THE WAY WE WORK</span><h2>Our core values.</h2><p>A clear purpose, shared understanding and practical progress guide our work with your business.</p></div><div className="about-values-grid">{values.map(({icon:Icon,title,text})=><article key={title}><span className="off-icon"><Icon size={29}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section about-workspace"><div className="container"><div className="about-section-title"><span className="eyebrow">IDEAS CONNECTED TO YOUR BUSINESS</span><h2>Where strategy becomes useful work.</h2></div><div className="about-workspace-grid"><CompanyVisual/><div className="about-story-card"><span className="eyebrow">BASED IN HYDERABAD. WORKING ACROSS INDIA.</span><h3>Bring the whole customer journey into focus.</h3><p>JustGrow helps businesses connect the way they are discovered with the way they explain their services and receive enquiries. SEO, paid advertising and website development each play a part in that journey.</p><p>We begin with your offer, your audience and the challenge you want to solve. That context helps us choose the work that matters, whether it is improving search visibility, refining a campaign or making an existing website easier to use.</p><p>Your knowledge of your customers stays central. We work with your team to turn that understanding into clear messages, useful pages and practical next steps.</p></div></div></div></section>

    <section className="section container about-story"><div className="about-section-title"><span className="eyebrow">THE THINKING BEHIND JUSTGROW</span><h2>A clearer path to your next customer.</h2></div><div className="about-story-grid"><div><h3>Good businesses need to be understood.</h3><p>You know the value of your services. Your next customer needs to find that value, understand it and feel ready to get in touch. Our approach brings those needs into the same plan.</p></div><div><h3>Every improvement needs a purpose.</h3><p>A campaign needs a relevant destination. A service page needs useful answers. An enquiry needs a clear follow-up. We look at how these pieces work together before choosing what to change.</p></div><div><h3>Growth starts with the right questions.</h3><p>Who are you trying to reach? What stops them from choosing you? Which enquiries are suitable? Your answers help us keep the marketing connected to the business behind it.</p></div></div></section>

    <section className="section about-strengths"><div className="container"><div className="about-section-title"><span className="eyebrow">CONNECTED CAPABILITIES</span><h2>Our strengths.</h2><p>Different skills, working towards the same business goal.</p></div><div className="about-strength-grid">{[
      {icon:Search,title:'Search & AI discovery',text:'Help customers find useful information about your services.',href:'/seo/'},
      {icon:Megaphone,title:'Paid advertising',text:'Connect a relevant audience with a clear offer and enquiry journey.',href:'/sem/'},
      {icon:PanelsTopLeft,title:'Website experience',text:'Make your services easier to understand and your business easier to contact.',href:'/website-development/'},
      {icon:MapPin,title:'Business understanding',text:'Build the plan around your audience, service areas and priorities.',href:'/contact/'},
    ].map(({icon:Icon,title,text,href})=><a key={title} href={href}><Icon size={32}/><h3>{title}</h3><p>{text}</p><span>Explore this with us</span></a>)}</div></div></section>

    <section className="section about-advantages"><div className="container"><div className="about-section-title"><span className="eyebrow">WHAT THIS MEANS FOR YOU</span><h2>The advantages of working with JustGrow.</h2><p>Understand the work, stay involved in the decisions and connect the progress to your customers.</p></div><div className="about-advantage-grid">{advantages.map(({icon:Icon,title,text})=><article key={title}><span className="off-icon"><Icon size={29}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="about-closing"><div className="container"><div className="about-closing-card"><div><span className="eyebrow">LET'S BUILD YOUR NEXT STEP</span><h2>Bring us your business challenge.</h2><p>Share your website, customers and goals. We will help identify a practical starting point for your growth.</p></div><a className="button off-primary" href="/contact/" data-event="service_cta_click">Contact JustGrow</a></div></div></section>
  </div>;
}
