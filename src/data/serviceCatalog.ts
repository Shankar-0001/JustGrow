import type { Service } from './site';

// Small navigation/form catalog; full service copy loads only on relevant pages.
export const serviceCatalog: Pick<Service, 'slug' | 'group' | 'name'>[] = [
  {
    "slug": "search-engine-optimization",
    "group": "seo",
    "name": "Search Engine Optimization"
  },
  {
    "slug": "aeo",
    "group": "seo",
    "name": "AEO"
  },
  {
    "slug": "geo",
    "group": "seo",
    "name": "GEO"
  },
  {
    "slug": "on-page-seo",
    "group": "seo",
    "name": "On-page SEO"
  },
  {
    "slug": "off-page-seo",
    "group": "seo",
    "name": "Off-page SEO"
  },
  {
    "slug": "local-seo",
    "group": "seo",
    "name": "Local SEO"
  },
  {
    "slug": "hire-seo-expert",
    "group": "seo",
    "name": "Hire an SEO Expert"
  },
  {
    "slug": "google-ads",
    "group": "sem",
    "name": "Google Ads"
  },
  {
    "slug": "social-media-ads",
    "group": "sem",
    "name": "Social Media Ads"
  },
  {
    "slug": "bing-ads",
    "group": "sem",
    "name": "Bing Ads"
  },
  {
    "slug": "chatgpt-ads",
    "group": "sem",
    "name": "ChatGPT Ads"
  },
  {
    "slug": "website-development",
    "group": "web",
    "name": "Website Development"
  }
];
