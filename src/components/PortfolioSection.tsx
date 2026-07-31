import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/agencyData';
import { PortfolioProject } from '../types';
import { ExternalLink } from 'lucide-react';

interface PortfolioSectionProps {
  onSelectProject?: (project: PortfolioProject) => void;
  onOpenConsultation: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onOpenConsultation
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industries = ['all', ...Array.from(new Set(PORTFOLIO_PROJECTS.map(p => p.industry)))];

  const filteredProjects = selectedIndustry === 'all' 
    ? PORTFOLIO_PROJECTS 
    : PORTFOLIO_PROJECTS.filter(p => p.industry === selectedIndustry);

  return (
    <section id="portfolio" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            Selected Works
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
            Featured Projects
          </h2>
          <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed">
            A selection of modern web platforms and marketing campaigns delivered across core industries.
          </p>
        </div>

        {/* Industry Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${selectedIndustry === ind ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              {ind === 'all' ? 'All Industries' : ind}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full"
            >
              <div>
                {/* Project Image */}
                <div className="h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {project.industry}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    {project.title}
                  </h3>

                  <p className="font-body text-slate-600 text-sm leading-relaxed">
                    {project.shortResult}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.servicesProvided.map((srv, idx) => (
                      <span key={idx} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {srv.replace('-', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visit Project Action */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                <button
                  onClick={onOpenConsultation}
                  className="w-full mt-4 py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire About Similar Project</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
