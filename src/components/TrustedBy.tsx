import React from 'react';

export const TrustedBy: React.FC = () => {
  const industries = [
    'Healthcare & Medical',
    'SaaS & Software',
    'E-commerce & Retail',
    'Real Estate & Property',
    'Professional Services',
    'Education & Training'
  ];

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
          Tailored Digital Strategies Across Core Industries
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
