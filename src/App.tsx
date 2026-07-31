import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustedBy } from './components/TrustedBy';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessTimeline } from './components/ProcessTimeline';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialSlider } from './components/TestimonialSlider';
import { FaqAccordion } from './components/FaqAccordion';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AboutView } from './components/AboutView';
import { TargetAudienceBar } from './components/TargetAudienceBar';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SERVICES_DATA } from './data/agencyData';
import { ServiceItem, PortfolioProject } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>();

  const handleNavigate = (tab: string, serviceId?: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (serviceId) {
      const match = SERVICES_DATA.find(s => s.id === serviceId);
      if (match) {
        setSelectedService(match);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar 
        currentTab={currentTab} 
        onNavigate={handleNavigate} 
        onOpenConsultation={() => setConsultationOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'home' && (
          <>
            <HeroSection 
              onOpenConsultation={() => setConsultationOpen(true)}
              onNavigateServices={() => handleNavigate('services')}
            />

            <TrustedBy />

            <TargetAudienceBar />

            <ServicesSection 
              onSelectService={(service) => setSelectedService(service)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />

            <WhyChooseUs />

            <ProcessTimeline />

            <PortfolioSection 
              onSelectProject={(project) => setSelectedProject(project)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />

            <TestimonialSlider />

            <FaqAccordion />

            <ContactSection />
          </>
        )}

        {currentTab === 'services' && (
          <div className="py-6 space-y-12">
            <ServicesSection 
              onSelectService={(service) => setSelectedService(service)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
            <TargetAudienceBar />
            <ContactSection />
          </div>
        )}

        {currentTab === 'about' && (
          <AboutView 
            onOpenConsultation={() => setConsultationOpen(true)}
          />
        )}

        {currentTab === 'portfolio' && (
          <div className="py-6 space-y-12">
            <PortfolioSection 
              onSelectProject={(project) => setSelectedProject(project)}
              onOpenConsultation={() => setConsultationOpen(true)}
            />
            <TestimonialSlider />
            <ContactSection />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="py-6 space-y-12">
            <ContactSection />
            <FaqAccordion />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      {/* Interactive Modals */}
      <ServiceDetailModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      <ConsultationModal 
        isOpen={consultationOpen} 
        onClose={() => setConsultationOpen(false)}
        preselectedServiceId={preselectedServiceId}
      />

      {/* Floating WhatsApp Chat Button */}
      <FloatingWhatsApp />
    </div>
  );
}
