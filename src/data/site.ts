export const business = {
  name: 'JustGrow', origin: 'https://www.justgrow.in',
  email: 'marketing@justgrow.in', phone: '+918252553686', displayPhone: '+91 82525 53686',
  address: 'Flat 111, Pawani Apartment, Balanagar, Hyderabad',
};

export type Service = {
  slug: string; group: 'seo' | 'sem' | 'web'; name: string; title: string; heading: string;
  intro: string; audience: string; problem: string; definition: string;
  scope: [string, string][]; deliverables: string[]; process: [string, string][];
  inputs: string; measures: string; timing: string; example: [string, string][];
  faqs: [string, string][]; related: string[]; cta: string; visual: string;
};
export const servicePath = (s: Pick<Service, 'group' | 'slug'>) => s.group === 'web' ? '/website-development/' : `/${s.group}/${s.slug}/`;
export const enquiryPath = (slug?: string) => `/contact/${slug ? `?service=${encodeURIComponent(slug)}` : ''}`;
