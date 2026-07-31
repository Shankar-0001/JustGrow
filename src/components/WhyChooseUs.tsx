import React from 'react';
import { VALUE_PROPOSITIONS } from '../data/agencyData';
import { IconRenderer } from './IconRenderer';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            Why JustGrow
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Our Core Principles
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
            We prioritize clear execution, direct communication, and measurable growth over vanity metrics.
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PROPOSITIONS.map((value) => (
            <div 
              key={value.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <IconRenderer name={value.iconName} className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {value.title}
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
