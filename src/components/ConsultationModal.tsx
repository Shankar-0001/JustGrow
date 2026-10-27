import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/agencyData';
import { X, CheckCircle2, Send, Loader2, AlertCircle } from 'lucide-react';
import { submitLeadToGoogleSheet } from '../lib/googleSheets';
import { isValidEmail, isValidPhone } from '../lib/validation';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
];

const TIME_ZONES = [
  { label: 'IST (Indian Standard Time - GMT+5:30)', value: 'IST (GMT+5:30)' },
  { label: 'EST (Eastern Standard Time - GMT-5)', value: 'EST (GMT-5)' },
  { label: 'PST (Pacific Standard Time - GMT-8)', value: 'PST (GMT-8)' },
  { label: 'CST (Central Standard Time - GMT-6)', value: 'CST (GMT-6)' },
  { label: 'GMT / UTC (Coordinated Universal Time)', value: 'GMT/UTC' },
  { label: 'SGT (Singapore Time - GMT+8)', value: 'SGT (GMT+8)' },
  { label: 'AEST (Australian Eastern Time - GMT+10)', value: 'AEST (GMT+10)' },
  { label: 'BST / GMT+1 (UK British Summer Time)', value: 'BST (GMT+1)' },
  { label: 'CET (Central European Time - GMT+1)', value: 'CET (GMT+1)' },
  { label: 'GST (Gulf Standard Time / Dubai - GMT+4)', value: 'GST (GMT+4)' }
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ 
  isOpen, 
  onClose,
  preselectedServiceId 
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceId: preselectedServiceId || 'seo',
    preferredDate: '',
    timeSlot: '10:00 AM',
    timeZone: 'IST (GMT+5:30)',
    goals: ''
  });

  if (!isOpen) return null;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!isValidEmail(formData.email)) {
        setErrorMsg('Please enter a valid email address (e.g. name@company.com).');
        return;
      }
      if (!isValidPhone(formData.phone)) {
        setErrorMsg('Please enter a valid phone number with country code (e.g. +91 9876543210 or +1 202 555 0123).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.preferredDate) {
        setErrorMsg('Please select a preferred date.');
        return;
      }

      setIsSubmitting(true);
      const selectedService = SERVICES_DATA.find(s => s.id === formData.serviceId)?.title || formData.serviceId;
      const combinedTime = `${formData.timeSlot} ${formData.timeZone}`;

      const result = await submitLeadToGoogleSheet({
        formType: 'Schedule Your Growth Session',
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service: selectedService,
        preferredDate: formData.preferredDate,
        preferredTime: combinedTime,
        message: formData.goals
      });

      setIsSubmitting(false);
      if (result.success) {
        setStep(3);
      } else {
        setErrorMsg(result.message || 'Unable to submit your request. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 3 ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-bold text-slate-900">
                Inquiry Received, {formData.name}!
              </h3>
              <p className="font-body text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to JustGrow. We have received your strategy request for <strong className="text-slate-900">{formData.preferredDate} ({formData.timeSlot} {formData.timeZone})</strong>. A growth specialist will contact you at <strong className="text-blue-600">{formData.phone}</strong> and <strong className="text-blue-600">{formData.email}</strong> to confirm your session.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Return To Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleNext} className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Step {step} of 2 • JustGrow Consultation
              </span>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">
                Schedule Your Growth Session
              </h3>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Doe" 
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="jane@company.com" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (with Country Code) *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +91 9876543210 or +1 202 555 0123" 
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Company Inc." 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Interested In</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Continue to Date & Time →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.preferredDate}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredDate: e.target.value });
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time *</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Time Zone *</label>
                    <select
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {TIME_ZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Project Details</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us about your project goals..."
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setStep(1);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Schedule Request</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
