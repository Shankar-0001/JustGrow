import React from 'react';
import { TARGET_AUDIENCES } from '../data/agencyData';
import { IconRenderer } from './IconRenderer';

export const TargetAudienceBar: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Tailored For Your Industry
          </h2>
          <p className="font-body text-slate-600 text-sm">
            We adapt growth frameworks specifically to the acquisition dynamics of your target market.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TARGET_AUDIENCES.map((aud) => (
            <div 
              key={aud.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2.5 text-blue-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <IconRenderer name={aud.iconName} className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  {aud.name}
                </h3>
              </div>
              <p className="font-body text-xs text-slate-600 leading-relaxed">
                {aud.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
