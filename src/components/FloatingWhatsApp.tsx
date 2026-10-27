import { WHATSAPP_URL } from '../data/agencyData';
import { WhatsAppIcon } from './WhatsAppIcon';

export function FloatingWhatsApp() {
  return <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
    aria-label="Chat with JustGrow on WhatsApp (opens in a new tab)"
    className="floating-whatsapp" title="Chat with us on WhatsApp">
    <WhatsAppIcon className="whatsapp-symbol"/>
    <span className="whatsapp-label">Chat with us</span>
  </a>;
}
