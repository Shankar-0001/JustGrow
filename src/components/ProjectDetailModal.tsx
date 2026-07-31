import React from 'react';
import { PortfolioProject } from '../types';
import { X, ExternalLink } from 'lucide-react';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenConsultation
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 sm:p-8 text-slate-900 shadow-xl relative max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-3">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {project.industry}
          </span>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            {project.title}
          </h2>
          <p className="font-body text-slate-600 text-sm leading-relaxed">
            {project.shortResult}
          </p>
        </div>

        <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-500">Services Provided:</span>
          {project.servicesProvided.map((srv, idx) => (
            <span key={idx} className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">
              {srv.replace('-', ' ').toUpperCase()}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <span>Inquire About Project</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
