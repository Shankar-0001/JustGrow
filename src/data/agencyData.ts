import { 
  ServiceItem, 
  ValuePropItem, 
  ProcessStep, 
  PortfolioProject, 
  TestimonialItem, 
  FaqItem, 
  TargetAudience,
  TeamMember 
} from '../types';

export const AGENCY_INFO = {
  name: 'JustGrow',
  tagline: 'Grow Smarter. Grow Faster.',
  headline: 'Grow Smarter. Grow Faster.',
  description: 'JustGrow is a modern growth marketing agency specializing in search engine optimization, custom web development, targeted paid advertising, social media, and digital PR.',
  email: 'marketing@justgrow.in',
  phone: '+918252553686',
  whatsapp: '+918252553686',
  hours: 'Mon - Fri: 9:00 AM - 7:00 PM IST',
  address: 'Flat 111, pawani apartment, Balanagar',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/justgrow',
    twitter: 'https://twitter.com/justgrow',
    facebook: 'https://facebook.com/justgrow',
    instagram: 'https://instagram.com/justgrow'
  }
};

export const WHATSAPP_NUMBER = '918252553686';
export const WHATSAPP_DISPLAY_PHONE = '+91 82525 53686';

export const WHATSAPP_DEFAULT_MESSAGE = `Hello JustGrow Team,

I visited your website and I'm interested in your digital marketing services.

Please contact me.

Thank you.`;

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'seo',
    title: 'SEO',
    category: 'Organic Growth',
    iconName: 'Search',
    shortDescription: 'Improve organic rankings and capture high-intent search traffic with comprehensive technical and content optimization.',
    fullDescription: 'Our search engine optimization strategies focus on technical performance, keyword research, on-page optimization, and high-quality backlink building to drive sustainable organic traffic growth.',
    keyBenefits: [
      'Increased organic visibility for relevant search terms',
      'Technical health and site speed optimization',
      'High-intent keyword targeting and content strategy',
      'Sustainable traffic growth without recurring ad spend'
    ],
    deliverables: [
      'Comprehensive Technical SEO Audit',
      'Keyword Strategy & Gap Analysis',
      'On-Page Meta & Schema Optimization',
      'Monthly Ranking & Traffic Performance Reports'
    ],
    startingPrice: '$2,000 / month',
    caseStudyHighlight: {
      client: 'Healthcare Brand',
      metric: 'Organic Traffic Lift',
      result: 'Improved search visibility for core high-intent queries.'
    },
    faq: [
      {
        question: 'How long does SEO take to produce results?',
        answer: 'SEO is a long-term investment. Most websites start noticing rank improvements and steady traffic growth within 3 to 6 months.'
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Website Development',
    category: 'Development',
    iconName: 'Code',
    shortDescription: 'Build fast, responsive, modern websites and web applications tailored for seamless user experience.',
    fullDescription: 'We build custom, modern web applications with clean code, lightning-fast load times, and intuitive design interfaces that work seamlessly across all screen sizes.',
    keyBenefits: [
      'Sub-second page loading and high Core Web Vitals performance',
      'Fully responsive, mobile-first design architecture',
      'Clean TypeScript & React codebase',
      'Intuitive user interfaces built for high usability'
    ],
    deliverables: [
      'Custom Design System & Wireframes',
      'Responsive Frontend Codebase',
      'CMS / Content Management Integration',
      'Performance Optimization & Testing'
    ],
    startingPrice: '$4,000 one-time',
    caseStudyHighlight: {
      client: 'Modern SaaS Platform',
      metric: 'User Engagement',
      result: 'Redesigned core interface resulting in lower bounce rates.'
    },
    faq: [
      {
        question: 'What technologies do you use?',
        answer: 'We specialize in React, TypeScript, Next.js, and modern CSS frameworks like Tailwind CSS.'
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    category: 'Organic Growth',
    iconName: 'Share2',
    shortDescription: 'Engage your audience with consistent visual content, community management, and brand messaging.',
    fullDescription: 'Build brand presence and community across major social networks through structured content creation, visual design, and regular audience interactions.',
    keyBenefits: [
      'Consistent, cohesive brand presence across channels',
      'Higher community interaction and audience trust',
      'Professional graphic design and short-form video assets',
      'Data-informed post scheduling and audience insights'
    ],
    deliverables: [
      'Monthly Content Calendar & Strategy',
      'Custom Visual Assets & Video Content',
      'Copywriting & Hashtag Optimization',
      'Monthly Engagement Analytics Report'
    ],
    startingPrice: '$1,500 / month',
    caseStudyHighlight: {
      client: 'Lifestyle Brand',
      metric: 'Audience Reach',
      result: 'Grew organic impression volume consistently over 6 months.'
    },
    faq: [
      {
        question: 'Which social platforms should we prioritize?',
        answer: 'We analyze where your target prospective customers spend time, whether B2B on LinkedIn or B2C on Instagram and TikTok.'
      }
    ]
  },
  {
    id: 'email-marketing',
    title: 'Email Marketing',
    category: 'Paid Media',
    iconName: 'Mail',
    shortDescription: 'Nurture leads and retain customers with automated email sequences and newsletter campaigns.',
    fullDescription: 'Design and deploy targeted email workflows, customer onboarding drips, and promotional broadcasts to maintain strong relationships with your customer base.',
    keyBenefits: [
      'Automated customer onboarding and re-engagement flows',
      'Custom responsive email template design',
      'Segmented list messaging based on user behavior',
      'Improved email deliverability and open rates'
    ],
    deliverables: [
      'Automated Welcome & Re-engagement Drips',
      'Custom HTML/CSS Email Templates',
      'List Hygiene & Segmentation Setup',
      'A/B Performance Testing & Analytics'
    ],
    startingPrice: '$1,200 / month',
    caseStudyHighlight: {
      client: 'E-commerce Brand',
      metric: 'Customer Retention',
      result: 'Increased repeat orders through automated email messaging.'
    },
    faq: [
      {
        question: 'Which email platforms do you integrate with?',
        answer: 'We work with all major email platforms including Klaviyo, Mailchimp, HubSpot, and ActiveCampaign.'
      }
    ]
  },
  {
    id: 'ppc-advertising',
    title: 'PPC & Paid Marketing',
    category: 'Paid Media',
    iconName: 'Target',
    shortDescription: 'Drive targeted customer acquisition through managed search engine and social media ad campaigns.',
    fullDescription: 'Structure, manage, and optimize paid ad campaigns on Google Search, Meta Ads, and LinkedIn Ads to capture immediate buyer intent.',
    keyBenefits: [
      'Immediate visibility for high-value search queries',
      'Targeted demographic and interest-based ad delivery',
      'Ongoing keyword and ad copy optimization',
      'Clear tracking from ad click to lead submission'
    ],
    deliverables: [
      'Search & Paid Social Campaign Setup',
      'Ad Copywriting & Creative Design',
      'Conversion Pixel & Analytics Setup',
      'Bi-weekly Optimization & Spend Audits'
    ],
    startingPrice: '$1,800 / month',
    caseStudyHighlight: {
      client: 'Professional Services Firm',
      metric: 'Lead Generation',
      result: 'Streamlined ad campaign structure to lower cost per lead.'
    },
    faq: [
      {
        question: 'Do we own our advertising accounts?',
        answer: 'Yes, you maintain 100% full ownership of all Google Ads, Meta, and analytics accounts.'
      }
    ]
  },
  {
    id: 'digital-pr',
    title: 'Digital PR',
    category: 'Brand & PR',
    iconName: 'Megaphone',
    shortDescription: 'Earn media mentions and authoritative editorial links to strengthen brand reputation and domain authority.',
    fullDescription: 'Earn high-quality editorial coverage and backlinks from respected industry publications through data-driven research stories, press releases, and expert commentary.',
    keyBenefits: [
      'Enhanced brand credibility and industry authority',
      'High-authority backlink creation for SEO strength',
      'Increased brand search presence and visibility',
      'Media coverage in relevant online publications'
    ],
    deliverables: [
      'Data Research & Press Release Drafting',
      'Journalist & Publication Pitching',
      'Executive Commentary Outreaches',
      'Media Coverage Dossier'
    ],
    startingPrice: '$2,500 / month',
    caseStudyHighlight: {
      client: 'FinTech Startup',
      metric: 'Press Coverage',
      result: 'Secured editorial mentions in premier industry news outlets.'
    },
    faq: [
      {
        question: 'How is Digital PR different from traditional PR?',
        answer: 'Digital PR focuses on earning online coverage and authoritative backlinks that directly benefit search visibility alongside brand awareness.'
      }
    ]
  },
  {
    id: 'reputation-management',
    title: 'Rating & Review Management',
    category: 'Brand & PR',
    iconName: 'Star',
    shortDescription: 'Monitor, protect, and enhance your online ratings and customer review presence.',
    fullDescription: 'Build consumer trust by systematically collecting positive customer feedback, monitoring sentiment across platforms, and resolving customer issues promptly.',
    keyBenefits: [
      'Systematic accumulation of verified 5-star customer reviews',
      'Real-time alerts for incoming public feedback',
      'Improved local search map pack positioning',
      'Clear brand sentiment monitoring across channels'
    ],
    deliverables: [
      'Review Invitation Automation Setup',
      'Google Business Profile Optimization',
      'Feedback Resolution Protocol Guidelines',
      'Monthly Sentiment & Star Rating Audits'
    ],
    startingPrice: '$1,000 / month',
    caseStudyHighlight: {
      client: 'Multi-location Business',
      metric: 'Customer Ratings',
      result: 'Accumulated consistent positive customer feedback.'
    },
    faq: [
      {
        question: 'Can you help resolve negative public feedback?',
        answer: 'We provide clear response frameworks and dispute options for reviews that violate platform policies.'
      }
    ]
  }
];

export const VALUE_PROPOSITIONS: ValuePropItem[] = [
  {
    id: 'clear-communication',
    title: 'Transparent Communication',
    description: 'Direct, honest communication with regular updates into campaign progress and technical execution.',
    iconName: 'MessageSquare'
  },
  {
    id: 'tailored-strategy',
    title: 'Tailored Strategy',
    description: 'Every marketing and development plan is designed specifically around your business goals and market dynamics.',
    iconName: 'Layers'
  },
  {
    id: 'senior-expertise',
    title: 'Senior Expertise',
    description: 'Work directly with experienced marketing strategists and software engineers.',
    iconName: 'Award'
  },
  {
    id: 'value-focused',
    title: 'Value-Focused Pricing',
    description: 'Fair, predictable pricing structured to deliver maximum return on investment.',
    iconName: 'DollarSign'
  },
  {
    id: 'proactive-support',
    title: 'Proactive Support',
    description: 'Responsive communication channels ensuring questions and project requests are addressed quickly.',
    iconName: 'Zap'
  },
  {
    id: 'quality-execution',
    title: 'Quality Execution',
    description: 'Rigorous attention to detail across code quality, design polish, and campaign structure.',
    iconName: 'TrendingUp'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Discovery',
    subtitle: 'Understanding Your Objectives',
    description: 'We review your current digital presence, business targets, customer profile, and industry competitors.',
    keyActivities: [
      'Initial technical and marketing evaluation',
      'Competitor landscape analysis',
      'Goal alignment & KPI definition'
    ],
    iconName: 'Compass'
  },
  {
    stepNumber: 2,
    title: 'Strategy',
    subtitle: 'Tailored Action Plan',
    description: 'Architecting a clear roadmap tailored to your specific channels, website requirements, and budget.',
    keyActivities: [
      'Channel allocation and content outline',
      'Technical architecture mapping',
      'Timeline and milestone agreement'
    ],
    iconName: 'LayoutGrid'
  },
  {
    stepNumber: 3,
    title: 'Execution',
    subtitle: 'Implementation & Build',
    description: 'Clean execution across website development, SEO technical fixes, ad campaign builds, and content creation.',
    keyActivities: [
      'Ad campaign structure deployment',
      'Responsive web development & testing',
      'Analytics tracking verification'
    ],
    iconName: 'Cpu'
  },
  {
    stepNumber: 4,
    title: 'Optimization',
    subtitle: 'Continuous Refinement',
    description: 'Monitoring live data to refine campaign parameters, improve user experience, and maximize efficiency.',
    keyActivities: [
      'Performance data review',
      'A/B ad copy & page testing',
      'Regular strategy alignment meetings'
    ],
    iconName: 'Sliders'
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'apex-health',
    title: 'Healthcare Patient Portal & Search Platform',
    clientName: 'Apex Health Systems',
    industry: 'Healthcare',
    servicesProvided: ['seo', 'web-development'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Improved search visibility and responsive online booking experience.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: true
  },
  {
    id: 'fintech-pulse',
    title: 'SaaS Lead Acquisition & Digital Experience',
    clientName: 'FinTech Pulse',
    industry: 'SaaS',
    servicesProvided: ['ppc-advertising', 'email-marketing'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Targeted ad campaign structure with streamlined lead capture flows.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: true
  },
  {
    id: 'prestige-realty',
    title: 'Real Estate Property Portal & Digital PR',
    clientName: 'Prestige Realty Group',
    industry: 'Real Estate',
    servicesProvided: ['ppc-advertising', 'digital-pr'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Targeted geographic PPC campaigns coupled with media coverage.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: true
  },
  {
    id: 'luminary-beauty',
    title: 'E-commerce Storefront & Lifecycle Email',
    clientName: 'Luminary Skincare',
    industry: 'E-commerce',
    servicesProvided: ['email-marketing', 'social-media'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Automated email flows to engage existing customer base.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: false
  },
  {
    id: 'horizon-ed',
    title: 'Educational Institution Web Portal',
    clientName: 'Horizon Academy',
    industry: 'Education',
    servicesProvided: ['web-development', 'seo'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Modernized web architecture with clear inquiry paths.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: false
  },
  {
    id: 'urban-craft-bistro',
    title: 'Local Hospitality Presence & Review Management',
    clientName: 'Urban Bistro Chain',
    industry: 'Local Business',
    servicesProvided: ['reputation-management', 'seo'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    shortResult: 'Optimized local search listings and systematic feedback collection.',
    fullChallenge: '',
    solution: '',
    metricsAchieved: [],
    featured: false
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Sarah Jenkins',
    position: 'Marketing Director',
    company: 'Apex Health',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'JustGrow helped us restructure our organic search strategy and rebuild our core web platform. Communication was clear, deadlines were met, and overall site performance improved significantly.',
    serviceUsed: 'SEO & Website Development',
    date: 'May 2026',
    industry: 'Healthcare'
  },
  {
    id: 'test-2',
    name: 'David Vance',
    position: 'Co-Founder',
    company: 'FinTech Pulse',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'Working with JustGrow on our paid search and email automation was straightforward and transparent. They eliminated bloated ad spend and focused strictly on high-intent leads.',
    serviceUsed: 'PPC & Paid Marketing',
    date: 'April 2026',
    industry: 'SaaS'
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    position: 'Growth Lead',
    company: 'Luminary Skincare',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'The email marketing workflows created by JustGrow brought consistent engagement from our customer list. Highly professional team with sharp technical execution.',
    serviceUsed: 'Email Marketing',
    date: 'March 2026',
    industry: 'E-commerce'
  },
  {
    id: 'test-4',
    name: 'Marcus Thorne',
    position: 'Managing Partner',
    company: 'Prestige Realty',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'JustGrow delivered clean digital PR campaigns that placed our brand in reputable industry news sources. Their strategic guidance gave us a strong market presence.',
    serviceUsed: 'Digital PR',
    date: 'February 2026',
    industry: 'Real Estate'
  },
  {
    id: 'test-5',
    name: 'Robert Chen',
    position: 'Operations Manager',
    company: 'Prestige Clinics',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'Their review management system gave us a structured way to gather positive customer feedback and handle incoming queries efficiently across local listings.',
    serviceUsed: 'Rating & Review Management',
    date: 'January 2026',
    industry: 'Local Business'
  },
  {
    id: 'test-6',
    name: 'Amanda Brooks',
    position: 'Head of Communications',
    company: 'Horizon Academy',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    detailedFeedback: 'From the initial wireframe to post-launch support, JustGrow demonstrated great attention to detail on our website redesign. Highly recommended for web development.',
    serviceUsed: 'Website Development',
    date: 'January 2026',
    industry: 'Education'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'SEO',
    question: 'How quickly can we expect search ranking improvements?',
    answer: 'Initial technical health and indexing improvements can be seen within weeks, while steady keyword position gains typically develop over 3 to 6 months.'
  },
  {
    id: 'faq-2',
    category: 'Web Development',
    question: 'What is the standard timeline for a web development project?',
    answer: 'Standard landing pages typically take 2 to 3 weeks, while full custom web platforms take 4 to 6 weeks depending on requirements.'
  },
  {
    id: 'faq-3',
    category: 'PPC',
    question: 'Who owns our advertising accounts and campaign data?',
    answer: 'You retain 100% full ownership of all advertising and analytics accounts at all times.'
  },
  {
    id: 'faq-4',
    category: 'Timeline & Pricing',
    question: 'Do you require long-term binding contracts?',
    answer: 'We offer flexible month-to-month service agreements with clear deliverables and transparent pricing.'
  },
  {
    id: 'faq-5',
    category: 'Support',
    question: 'How often will we receive updates on campaign performance?',
    answer: 'We provide scheduled bi-weekly reports and maintain direct communication channels for regular project updates.'
  }
];

export const TARGET_AUDIENCES: TargetAudience[] = [
  {
    id: 'small-business',
    name: 'Small Businesses',
    iconName: 'Store',
    description: 'Outrank local competitors and generate a steady stream of qualified inbound sales leads.',
    keyPains: [],
    recommendedServices: ['seo', 'reputation-management', 'ppc-advertising'],
    averageRoi: ''
  },
  {
    id: 'startups',
    name: 'Startups & Scaleups',
    iconName: 'Rocket',
    description: 'Achieve rapid product-market fit, lower CAC, and scale conversion funnels.',
    keyPains: [],
    recommendedServices: ['web-development', 'ppc-advertising', 'digital-pr'],
    averageRoi: ''
  },
  {
    id: 'local-business',
    name: 'Local Businesses',
    iconName: 'MapPin',
    description: 'Dominate Google Map Packs and capture high-intent local customer calls.',
    keyPains: [],
    recommendedServices: ['seo', 'reputation-management', 'web-development'],
    averageRoi: ''
  },
  {
    id: 'e-commerce',
    name: 'E-commerce Brands',
    iconName: 'ShoppingBag',
    description: 'Increase average order value, reduce cart abandonment, and scale profitable ad spend.',
    keyPains: [],
    recommendedServices: ['email-marketing', 'ppc-advertising', 'social-media'],
    averageRoi: ''
  },
  {
    id: 'saas',
    name: 'SaaS Companies',
    iconName: 'Laptop',
    description: 'Drive high-LTV demo bookings, free trial signups, and scalable organic product search authority.',
    keyPains: [],
    recommendedServices: ['seo', 'ppc-advertising', 'email-marketing'],
    averageRoi: ''
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    iconName: 'Activity',
    description: 'Marketing funnels that convert searchers into lifetime patient appointments.',
    keyPains: [],
    recommendedServices: ['seo', 'web-development', 'reputation-management'],
    averageRoi: ''
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    iconName: 'Building2',
    description: 'Attract qualified home buyers, seller listings, and commercial real estate inquiries.',
    keyPains: [],
    recommendedServices: ['ppc-advertising', 'digital-pr', 'social-media'],
    averageRoi: ''
  },
  {
    id: 'education',
    name: 'Educational Institutions',
    iconName: 'GraduationCap',
    description: 'Streamline prospective student enrollment funnels and elevate institutional reputation.',
    keyPains: [],
    recommendedServices: ['web-development', 'seo', 'digital-pr'],
    averageRoi: ''
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Amit Kumar Thakur',
    role: 'Head of digital marketing and content strategy',
    bio: 'Drives growth marketing strategy, performance acquisition, and content architecture for scaling digital brands.',
    avatar: 'AT',
    linkedin: 'https://linkedin.com',
    specialty: 'Digital Marketing & Content Strategy'
  },
  {
    id: 'tm-2',
    name: 'Priya Sharma',
    role: 'Head of SEO & Organic Growth',
    bio: 'Specialist in technical search engine optimization, keyword strategy, and scalable search traffic growth.',
    avatar: 'PS',
    linkedin: 'https://linkedin.com',
    specialty: 'Technical SEO & Search Strategy'
  },
  {
    id: 'tm-3',
    name: 'Rohan Verma',
    role: 'Lead Web Developer & Software Engineer',
    bio: 'Engineers high-performance web applications and custom software solutions with modern React & TypeScript.',
    avatar: 'RV',
    linkedin: 'https://linkedin.com',
    specialty: 'Web Development & Architecture'
  },
  {
    id: 'tm-4',
    name: 'Ananya Patel',
    role: 'PPC & Paid Search Specialist',
    bio: 'Expert in structuring high-ROI paid search campaigns, conversion tracking, and paid media strategy.',
    avatar: 'AP',
    linkedin: 'https://linkedin.com',
    specialty: 'PPC & Performance Advertising'
  }
];
