import React from 'react';
import { AGENCY_INFO, TEAM_MEMBERS } from '../data/agencyData';
import { Target, Eye, ShieldCheck, Heart, Users, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

interface AboutViewProps {
  onOpenConsultation: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenConsultation }) => {
  const coreValues = [
    {
      title: 'Data-Driven Clarity',
      description: 'We base every strategy, campaign parameter, and design choice on validated data rather than guesswork.',
      icon: Target
    },
    {
      title: 'Absolute Transparency',
      description: 'Clear reporting, direct communication, and no hidden retainer fees or complex jargon.',
      icon: ShieldCheck
    },
    {
      title: 'Craft & Engineering',
      description: 'We take pride in clean code, responsive layouts, sub-second performance, and high conversion usability.',
      icon: Sparkles
    },
    {
      title: 'Client Partnership',
      description: 'We align deeply with our partners business objectives to foster long-term growth.',
      icon: Heart
    }
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      
      {/* Hero Header */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            About JustGrow
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Grow Smarter. Grow Faster.
          </h1>
          <p className="font-body text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            JustGrow is a modern digital marketing and software development agency built to deliver measurable, predictable pipeline expansion for scaling businesses.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Our Mission
              </h2>
              <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
                To empower companies with high-performing web platforms, organic search authority, and efficient acquisition channels that eliminate marketing waste and drive sustainable revenue growth.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Our Vision
              </h2>
              <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
                To set the benchmark for modern growth agencies through transparent execution, technical excellence, and genuine partner collaboration without bloated retainers or vanity metrics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-heading text-3xl font-bold text-slate-900">
              Our Core Values
            </h2>
            <p className="font-body text-slate-600 text-sm">
              The foundational standards that guide our strategy, design, and partner relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <val.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {val.title}
                </h3>
                <p className="font-body text-slate-600 text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Team Leadership */}
      <section className="py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
              Leadership
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">
              Meet Our Strategists
            </h2>
            <p className="font-body text-slate-600 text-sm">
              Work directly with senior growth practitioners across marketing, SEO, and web engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div 
                key={member.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-center hover:border-blue-300 transition-colors"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md border-2 border-blue-500/20 relative group">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400 absolute top-2 right-2 opacity-70" />
                  <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                    {member.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                    {member.role}
                  </span>
                  <p className="font-body text-slate-600 text-xs mt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-50 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <h2 className="font-heading text-3xl font-bold text-slate-900">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="font-body text-slate-600 text-sm">
            Contact our strategy team to discuss your current acquisition channels and custom web development needs.
          </p>
          <div>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
