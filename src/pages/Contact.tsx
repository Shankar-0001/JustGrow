import { Search, MessageCircle, ClipboardCheck } from 'lucide-react';
import { business } from '../data/site';
import { Breadcrumbs, FAQs } from '../components/SiteLayout';
import { CompanyVisual } from '../components/CompanyVisual';
import { EnquiryForm } from '../components/EnquiryForm';
import { WHATSAPP_URL } from '../data/agencyData';

const faqs: [string,string][] = [
  ['What should I include in my enquiry?', 'Share your website if you have one, what your business offers, the customers you want to reach and the main challenge you want help with. A budget range or target timeframe is useful if you already have one.'],
  ['Can I contact you before choosing a service?', 'Yes. Select Help me choose a service and describe your goal. You do not need a finished brief or a confirmed channel to start the conversation.'],
  ['Can you review our existing website or campaigns?', 'We can discuss a review of your current activity and agree the scope and access needed. Start by sharing the website and the problem you want to understand.'],
  ['What happens after I send the form?', 'We review the details and follow up to understand your needs. If there is a suitable fit, we discuss the approach and agree deliverables, costs and responsibilities before work starts.'],
];
export default function Contact() {
  return <div className="off-page seo-service-page company-page company-contact-page">
    <section className="off-hero"><div className="container"><Breadcrumbs items={[{label:'Contact'}]}/><div className="off-hero-grid"><div><h1>Let's talk about <span>growing your business.</span></h1><p>Looking for more relevant traffic, better enquiries or a website that makes your services easier to choose? Tell us where your business is today and what you want to improve.</p></div><div><EnquiryForm eyebrow="TELL US WHAT YOU WANT TO ACHIEVE" heading="Start with your business goals." note="We will use the details you share to review and respond to your enquiry."/></div></div></div></section>
    <section className="off-intro"><div className="container"><span className="eyebrow">YOUR GOALS ARE THE STARTING POINT</span><h2>You bring the challenge.<br/><span>Let's work out the next step.</span></h2><p>You do not need to have the solution worked out. Share your website, the customers you want to reach and the challenge you are facing. We can help you find a suitable starting point.</p></div></section>
    <section className="section off-consult"><div className="container off-consult-grid"><div className="off-consult-copy"><h2>Start a useful conversation.</h2><p>Use the form to tell us about your goals, or contact us directly. We work with businesses in Hyderabad and across India on SEO, AI search, paid advertising and website development.</p><div className="company-contact-list"><div><span>CALL US</span><a href={'tel:' + business.phone}>{business.displayPhone}</a></div><div><span>EMAIL US</span><a href={'mailto:' + business.email}>{business.email}</a></div><div><span>MESSAGE US</span><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></div><div><span>BASED IN HYDERABAD</span><address>{business.address}</address><a className="map-link" href="https://www.google.com/maps/search/?api=1&query=Flat%20111%20Pawani%20Apartment%20Balanagar%20Hyderabad" target="_blank" rel="noreferrer">Find us on Google Maps<span className="sr-only"> (opens in a new tab)</span></a></div></div><div className="off-consult-note"><strong>Helpful to include</strong><p>Your website, priority services, target customers and the main outcome you want. A budget range or timeframe is welcome if you already have one.</p></div></div><CompanyVisual contact/></div></section>
    <section className="section off-benefits"><div className="container"><div className="off-centred-heading"><span className="eyebrow">AFTER YOU GET IN TOUCH</span><h2>A clear next step for your enquiry.</h2><p>A useful conversation starts with your goals, the context and the right questions.</p></div><div className="off-benefit-grid company-next-steps">{[
      {icon:Search,title:'We understand the challenge',text:'We review what you share about your business, website and goals, then follow up to clarify the details needed to assess the work.'},
      {icon:MessageCircle,title:'We discuss a suitable approach',text:'Together, we identify which services could help and what information, access or preparation the project would need.'},
      {icon:ClipboardCheck,title:'We agree the scope',text:'If there is a fit, we outline the deliverables, costs, responsibilities and proposed schedule so you can make an informed decision.'},
    ].map(({icon:Icon,title,text})=><article key={title}><span className="off-icon"><Icon size={28}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section off-faq"><div className="container"><div className="off-centred-heading"><span className="eyebrow">BEFORE YOU GET IN TOUCH</span><h2>A little more clarity.</h2></div><FAQs items={faqs}/></div></section>
  </div>;
}
