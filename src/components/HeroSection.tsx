import React from 'react';
import { ArrowRight, CheckCircle, Search, Code, Target, Share2, Mail, Megaphone, Star } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onNavigateServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenConsultation, 
  onNavigateServices 
}) => {
  return (
    <section className="bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Subtle clean badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Growth Marketing & Custom Development
          </div>

          {/* Headline & Tagline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Grow Smarter. <span className="text-blue-600">Grow Faster.</span>
          </h1>

          {/* Description */}
          <p className="font-body text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            JustGrow builds high-converting web applications and executes data-driven marketing campaigns designed to increase visibility, attract qualified buyers, and scale predictable revenue.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateServices}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-colors cursor-pointer"
            >
              Explore Services
            </button>
          </div>

          {/* Key Value Points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Tailored Strategy
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Transparent Pricing
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              No Hidden Contracts
            </span>
          </div>

        </div>

        {/* Minimal Clean Feature Frame */}
        <div className="mt-16 max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="font-heading text-xs uppercase tracking-wider font-semibold text-slate-500">
              Integrated Growth Capabilities
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'SEO', icon: Search },
              { label: 'Web Dev', icon: Code },
              { label: 'Social Media', icon: Share2 },
              { label: 'Email', icon: Mail },
              { label: 'PPC Ads', icon: Target },
              { label: 'Digital PR', icon: Megaphone },
              { label: 'Reviews', icon: Star }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-3 text-center space-y-2 hover:border-blue-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="block text-xs font-medium text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
