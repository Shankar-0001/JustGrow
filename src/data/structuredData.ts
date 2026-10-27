import { metadataFor } from './metadata';
import { services } from './services';
import { business, servicePath, type Service } from './site';

type SchemaNode = Record<string, unknown>;
const context = 'https://schema.org';
const organizationId = business.origin + '/#organization';
const websiteId = business.origin + '/#website';
const ref = (id: string) => ({ '@id': id });
const category = { seo: 'SEO & AI Search', sem: 'Paid Advertising', web: 'Website Development' };
const pageNames: Record<string, string> = {
  '/seo/': 'SEO & AI Search', '/sem/': 'SEM', '/about/': 'About',
  '/contact/': 'Contact', '/privacy-policy/': 'Privacy Policy', '/terms/': 'Terms',
};

function serviceSchema(service: Service): SchemaNode {
  const url = business.origin + servicePath(service);
  return {
    '@context': context, '@type': 'Service', '@id': url + '#service',
    name: service.name, serviceType: service.name, category: category[service.group],
    description: service.intro, url,
    provider: ref(organizationId), mainEntityOfPage: ref(url + '#webpage'),
    areaServed: { '@type': 'Country', name: 'India' },
  };
}

// Built into the initial HTML. IDs join the business, website, page and service
// without creating a new organization for each page or inventing commercial claims.
export function structuredDataFor(path: string): SchemaNode[] {
  const meta = metadataFor(path);
  if (!meta.indexable) return [];
  const url = business.origin + meta.route;
  const pageId = url + '#webpage';
  const group = meta.route === '/seo/' ? 'seo' : meta.route === '/sem/' ? 'sem' : undefined;
  const nodes: SchemaNode[] = [{
    '@context': context, '@type': 'Organization', '@id': organizationId,
    name: business.name, url: business.origin + '/', email: business.email, telephone: business.phone,
    address: {
      '@type': 'PostalAddress', streetAddress: 'Flat 111, Pawani Apartment, Balanagar',
      addressLocality: 'Hyderabad', addressCountry: 'IN',
    },
  }, {
    '@context': context, '@type': 'WebSite', '@id': websiteId,
    name: business.name, url: business.origin + '/', publisher: ref(organizationId), inLanguage: 'en',
  }];
  const page: SchemaNode = {
    '@context': context,
    '@type': group ? 'CollectionPage' : meta.route === '/about/' ? 'AboutPage' : meta.route === '/contact/' ? 'ContactPage' : 'WebPage',
    '@id': pageId, url, name: meta.title, description: meta.description,
    isPartOf: ref(websiteId), publisher: ref(organizationId), inLanguage: 'en',
  };
  nodes.push(page);

  if (meta.route !== '/') {
    const crumbs = [{ name: 'Home', item: business.origin + '/' }];
    if (meta.service && meta.service.group !== 'web') {
      crumbs.push({ name: meta.service.group.toUpperCase(), item: business.origin + '/' + meta.service.group + '/' });
    }
    crumbs.push({ name: meta.service?.slug === 'off-page-seo' ? 'Off-Page SEO' : meta.service?.name || pageNames[meta.route], item: url });
    page.breadcrumb = ref(url + '#breadcrumb');
    nodes.push({
      '@context': context, '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
      itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, ...crumb })),
    });
  }

  if (meta.service) {
    page.mainEntity = ref(url + '#service');
    nodes.push(serviceSchema(meta.service));
  } else if (group) {
    const listed = services.filter(service => service.group === group);
    page.mainEntity = ref(url + '#services');
    nodes.push({
      '@context': context, '@type': 'ItemList', '@id': url + '#services',
      name: category[group], numberOfItems: listed.length,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      itemListElement: listed.map((service, index) => {
        const serviceUrl = business.origin + servicePath(service);
        return {
          '@type': 'ListItem', position: index + 1,
          item: {
            '@type': 'Service', '@id': serviceUrl + '#service', name: service.name,
            url: serviceUrl, provider: ref(organizationId),
          },
        };
      }),
    });
  } else {
    page.about = ref(organizationId);
  }
  return nodes;
}
