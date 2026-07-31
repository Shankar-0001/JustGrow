import React from 'react';
import { PROCESS_STEPS } from '../data/agencyData';
import { IconRenderer } from './IconRenderer';

export const ProcessTimeline: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            Methodology
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            How We Work
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
            A structured four-step methodology designed for clarity, rapid execution, and continuous optimization.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div 
              key={step.stepNumber}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                    0{step.stepNumber}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center">
                    <IconRenderer name={step.iconName} className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <span className="text-xs font-medium text-blue-600 block mb-2">
                    {step.subtitle}
                  </span>
                  <p className="font-body text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <ul className="space-y-1.5 pt-3 border-t border-slate-200">
                  {step.keyActivities.map((act, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
