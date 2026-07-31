import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/agencyData';
import { ChevronDown } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            FAQ
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base">
            Common questions about our services, campaign setup, and working with JustGrow.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm sm:text-base font-semibold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 pt-0 border-t border-slate-100 font-body text-slate-600 text-sm leading-relaxed animate-in fade-in duration-150">
                    <p className="pt-3">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
