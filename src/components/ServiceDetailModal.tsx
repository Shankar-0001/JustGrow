import React from 'react';
import { ServiceItem } from '../types';
import { IconRenderer } from './IconRenderer';
import { X, Check, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ 
  service, 
  onClose,
  onOpenConsultation 
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IconRenderer name={service.iconName} className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 block">
                {service.category}
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                {service.title}
              </h2>
            </div>
          </div>

          <p className="font-body text-slate-600 text-sm leading-relaxed">
            {service.fullDescription}
          </p>
        </div>

        {/* Benefits & Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Key Strategic Benefits
            </h3>
            <ul className="space-y-2">
              {service.keyBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Included Deliverables
            </h3>
            <ul className="space-y-2">
              {service.deliverables.map((del, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Service FAQ */}
        {service.faq && service.faq.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-slate-400">
              Frequently Asked Questions
            </h3>
            {service.faq.map((f, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{f.question}</div>
                <div className="text-slate-600">{f.answer}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
