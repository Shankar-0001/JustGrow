import React, { useState, useEffect } from 'react';
import { AGENCY_INFO, WHATSAPP_URL, WHATSAPP_DISPLAY_PHONE } from '../data/agencyData';
import { Phone, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Logo } from './Logo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, serviceId?: string) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services', hasDropdown: true },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' },
  ];

  const servicesList = [
    { id: 'seo', name: 'SEO' },
    { id: 'web-development', name: 'Website Development' },
    { id: 'social-media', name: 'Social Media Marketing' },
    { id: 'email-marketing', name: 'Email Marketing' },
    { id: 'ppc-advertising', name: 'PPC & Paid Marketing' },
    { id: 'digital-pr', name: 'Digital PR' },
    { id: 'reputation-management', name: 'Rating & Review Management' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' : 'bg-white border-b border-slate-200 py-4'}`}>
      
      {/* Top bar with quick contact info */}
      <div className="hidden lg:block border-b border-slate-100 pb-2 mb-2 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Accepting New Clients
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Call Direct: <a href={`tel:${AGENCY_INFO.phone}`} className="hover:text-blue-600 transition-colors">{WHATSAPP_DISPLAY_PHONE}</a>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">{AGENCY_INFO.hours}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} 
          className="flex items-center text-left focus:outline-none cursor-pointer py-1"
        >
          <Logo size="md" showTagline={true} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <button
                    onClick={() => onNavigate('services')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${currentTab === 'services' ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                  >
                    Services
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Names Only */}
                  {servicesDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2 mt-1 animate-in fade-in duration-150 z-50">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-1.5 border-b border-slate-100">
                        Our Services
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {servicesList.map((srv) => (
                          <button
                            key={srv.id}
                            onClick={() => {
                              onNavigate('services', srv.id);
                              setServicesDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {srv.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentTab === item.id ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-sm transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            title="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={onOpenConsultation}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentTab === item.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 px-1">
              Services
            </div>
            <div className="grid grid-cols-1 gap-1">
              {servicesList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onNavigate('services', s.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600"
                >
                  • {s.name}
                </button>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 mt-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-center text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onOpenConsultation();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-center text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
