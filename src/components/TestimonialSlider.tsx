import React from 'react';
import { TESTIMONIALS_DATA } from '../data/agencyData';
import { Star } from 'lucide-react';

export const TestimonialSlider: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
            Client Feedback
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            What Our Partners Say
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
            Real feedback from marketing leaders and business owners who scale with JustGrow.
          </p>
        </div>

        {/* 6 Clean Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Feedback Quote */}
                <p className="font-body text-slate-700 text-sm leading-relaxed italic">
                  "{item.detailedFeedback}"
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {item.position}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
