import React from 'react';
import { AGENCY_INFO, WHATSAPP_DISPLAY_PHONE } from '../data/agencyData';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (tab: string, serviceId?: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center text-left focus:outline-none cursor-pointer"
            >
              <Logo variant="light" size="md" showTagline={true} />
            </button>

            <p className="font-body text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              JustGrow is a modern growth marketing and software development agency specializing in SEO, web applications, paid search, and digital strategy.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <a href={`mailto:${AGENCY_INFO.email}`} className="hover:text-white transition-colors">{AGENCY_INFO.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <a href={`tel:${AGENCY_INFO.phone}`} className="hover:text-white transition-colors">{WHATSAPP_DISPLAY_PHONE}</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{AGENCY_INFO.address}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors cursor-pointer">
                  Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('services', 'seo')} className="hover:text-white transition-colors cursor-pointer">
                  SEO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'web-development')} className="hover:text-white transition-colors cursor-pointer">
                  Website Development
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'social-media')} className="hover:text-white transition-colors cursor-pointer">
                  Social Media Marketing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'email-marketing')} className="hover:text-white transition-colors cursor-pointer">
                  Email Marketing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'ppc-advertising')} className="hover:text-white transition-colors cursor-pointer">
                  PPC & Paid Advertising
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'digital-pr')} className="hover:text-white transition-colors cursor-pointer">
                  Digital PR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'reputation-management')} className="hover:text-white transition-colors cursor-pointer">
                  Rating & Review Management
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-200">
              Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-800/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 JustGrow. Grow Smarter. Grow Faster.</p>
          <p className="text-slate-500">All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
};
