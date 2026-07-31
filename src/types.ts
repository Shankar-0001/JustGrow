export type ServiceId = 
  | 'seo'
  | 'web-development'
  | 'social-media'
  | 'email-marketing'
  | 'ppc-advertising'
  | 'digital-pr'
  | 'reputation-management';

export interface ServiceItem {
  id: ServiceId;
  title: string;
  category: 'Organic Growth' | 'Development' | 'Paid Media' | 'Brand & PR';
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  keyBenefits: string[];
  deliverables: string[];
  startingPrice: string;
  caseStudyHighlight: {
    client: string;
    metric: string;
    result: string;
  };
  faq: { question: string; answer: string }[];
}

export interface ValuePropItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  keyActivities: string[];
  iconName: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description: string;
  iconName: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  clientName: string;
  industry: 'E-commerce' | 'SaaS' | 'Healthcare' | 'Real Estate' | 'Local Business' | 'Education' | 'Startup';
  servicesProvided: ServiceId[];
  image: string;
  shortResult: string;
  fullChallenge: string;
  solution: string;
  metricsAchieved: { label: string; value: string }[];
  featured: boolean;
  testimonialSnippet?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
  rating: number;
  detailedFeedback: string;
  serviceUsed: string;
  date: string;
  industry: string;
}

export interface FaqItem {
  id: string;
  category: 'SEO' | 'Web Development' | 'PPC' | 'Email Marketing' | 'Timeline & Pricing' | 'Support';
  question: string;
  answer: string;
}

export interface TargetAudience {
  id: string;
  name: string;
  iconName: string;
  description: string;
  keyPains: string[];
  recommendedServices: ServiceId[];
  averageRoi: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string;
  specialty: string;
}

export interface ContactFormData {
  fullName: string;
  companyName: string;
  businessWebsite?: string;
  businessEmail: string;
  phoneNumber: string;
  serviceInterested: ServiceId | 'All Services' | 'Custom Growth Plan';
  estimatedBudget?: string;
  message: string;
  agreePrivacy: boolean;
}
