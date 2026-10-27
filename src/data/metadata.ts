import { services } from './services';
import { servicePath } from './site';
import { semPageContent } from './semPageContent';
export const publicRoutes = ['/', '/seo/', '/sem/', ...services.map(servicePath), '/about/', '/contact/', '/privacy-policy/', '/terms/'];
export const utilityRoutes = ['/thank-you/'];
export const allRoutes = [...publicRoutes, ...utilityRoutes];
const supporting: Record<string, [string, string]> = {
  '/': ['AI Powered Digital Marketing Agency in Hyderabad | JustGrow', 'Grow your business with JustGrow, an AI powered digital marketing agency in Hyderabad. Explore SEO, paid ads and website services for businesses across India.'],
  '/seo/': ['SEO & AI Search Services | JustGrow', 'Compare managed SEO, AEO, GEO, on-page, off-page and local SEO. Find the right search growth service for your business with JustGrow.'],
  '/sem/': [semPageContent.sem.title, semPageContent.sem.description],
  '/about/': ['About JustGrow | Digital Marketing Agency in Hyderabad', 'Meet JustGrow, a Hyderabad digital marketing agency helping businesses across India connect SEO, paid advertising and websites with relevant enquiries.'],
  '/contact/': ['Contact JustGrow | Discuss Your Digital Marketing Goals', 'Contact JustGrow to discuss SEO, paid advertising or website development. Share your business goals and find a practical next step for better traffic and enquiries.'],
  '/thank-you/': ['Thank You | JustGrow', 'Thank you for contacting JustGrow. Return to our website or get in touch about your business goals.'],
  '/privacy-policy/': ['Privacy Policy | JustGrow', 'How JustGrow handles project enquiries, Google Sheets records and browser submission identifiers. Contact us about your enquiry information.'],
  '/terms/': ['Website Terms | JustGrow', 'Information about JustGrow’s website, service descriptions, illustrative examples and project enquiries. Individual engagements require an agreed scope.'],
};
export function metadataFor(path: string) {
  const route = path === '/' ? '/' : path.replace(/\/+$/, '') + '/';
  const service = services.find(s => servicePath(s) === route);
  const record = supporting[route];
  return { route, title: service?.title || record?.[0] || 'Page Not Found | JustGrow', description: service?.intro || record?.[1] || 'Find your way to JustGrow services and contact information.', found: Boolean(service || record), indexable: Boolean(service || record) && !utilityRoutes.includes(route), service };
}
