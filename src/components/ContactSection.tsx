import React, { useState } from 'react';
import { AGENCY_INFO, SERVICES_DATA, WHATSAPP_DISPLAY_PHONE } from '../data/agencyData';
import { Mail, Phone, Clock, MapPin, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { submitLeadToGoogleSheet } from '../lib/googleSheets';
import { isValidEmail, isValidPhone } from '../lib/validation';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    fullName: '',
    companyName: '',
    businessEmail: '',
    phoneNumber: '',
    serviceInterested: 'general',
    message: '',
    privacyAgreed: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isValidEmail(formState.businessEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@company.com).');
      return;
    }
    if (!isValidPhone(formState.phoneNumber)) {
      setErrorMsg('Please enter a valid phone number with country code (e.g. +91 9876543210 or +1 202 555 0123).');
      return;
    }
    if (!formState.message.trim()) {
      setErrorMsg('Please enter a message.');
      return;
    }
    if (!formState.privacyAgreed) {
      setErrorMsg('Please accept the privacy agreement to submit.');
      return;
    }

    setIsSubmitting(true);

    const selectedServiceName = SERVICES_DATA.find(s => s.id === formState.serviceInterested)?.title || formState.serviceInterested;

    const result = await submitLeadToGoogleSheet({
      formType: 'Send Us a Message',
      fullName: formState.fullName,
      email: formState.businessEmail,
      phone: formState.phoneNumber,
      company: formState.companyName,
      service: selectedServiceName,
      message: formState.message
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(result.message || 'Unable to send your message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Contact Information */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                Get In Touch
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                Let's Grow Your Business
              </h2>
              <p className="font-body text-slate-600 text-base leading-relaxed">
                Have a project in mind or want to explore how our growth marketing and web development services can scale your pipeline? Reach out to our team today.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email</span>
                  <a href={`mailto:${AGENCY_INFO.email}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">
                    {AGENCY_INFO.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <a href={`tel:${AGENCY_INFO.phone}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    {WHATSAPP_DISPLAY_PHONE}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Business Hours</span>
                  <span className="text-sm font-medium text-slate-900">
                    {AGENCY_INFO.hours}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Location</span>
                  <span className="text-sm font-medium text-slate-900">
                    {AGENCY_INFO.address}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Message Sent Successfully!
                </h3>
                <p className="font-body text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to JustGrow. A growth strategist will review your inquiry and get back to you within 24 hours.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({
                      fullName: '',
                      companyName: '',
                      businessEmail: '',
                      phoneNumber: '',
                      serviceInterested: 'general',
                      message: '',
                      privacyAgreed: false
                    });
                  }}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                  Send Us a Message
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Full Name & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      required
                      value={formState.fullName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      id="companyName"
                      name="companyName"
                      value={formState.companyName}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="businessEmail" className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Email *
                    </label>
                    <input 
                      type="email" 
                      id="businessEmail"
                      name="businessEmail"
                      required
                      value={formState.businessEmail}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (with Country Code) *
                    </label>
                    <input 
                      type="tel" 
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={formState.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210 or +1 202 555 0123"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Service Interested In */}
                <div>
                  <label htmlFor="serviceInterested" className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Interested In
                  </label>
                  <select
                    id="serviceInterested"
                    name="serviceInterested"
                    value={formState.serviceInterested}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    {SERVICES_DATA.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or growth goals..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input 
                    type="checkbox"
                    id="privacyAgreed"
                    name="privacyAgreed"
                    checked={formState.privacyAgreed}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <label htmlFor="privacyAgreed" className="text-xs text-slate-600 leading-tight cursor-pointer">
                    I agree to the privacy policy and consent to being contacted.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
