import React from 'react';
import { SERVICES_DATA } from '../data/agencyData';
import { ServiceItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { Check } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenConsultation: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectService, 
  onOpenConsultation 
}) => {
  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            Core Capabilities
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Our Services
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
            Integrated digital marketing and software development services built for long-term sustainable growth.
          </p>
        </div>

        {/* Services Equal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div 
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <IconRenderer name={service.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                      {service.category}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Short Description */}
                <p className="font-body text-slate-600 text-sm leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {service.keyBenefits.slice(0, 3).map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-heading text-2xl font-bold text-slate-900">
            Need a Customized Marketing Strategy?
          </h3>
          <p className="font-body text-slate-600 text-sm max-w-xl mx-auto">
            We analyze your current channel performance and build a clear, multi-channel growth plan tailored to your business objectives.
          </p>
          <div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              Get Started With JustGrow
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
