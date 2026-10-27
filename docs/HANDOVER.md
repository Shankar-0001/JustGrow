# JustGrow redesign handover

Updated 26 October 2026. This is a local implementation, not a production deployment. See [the recorded audit](AUDIT.md) for deployment findings and [verification history](QA.md) for checks after subsequent edits.

## Public route inventory

| Route | Purpose |
| --- | --- |
| `/` | Positioning, three service pillars, goal selector, process, illustrative deliverable, use cases, FAQs |
| `/seo/` | Organic and AI-search service selection and comparison |
| `/seo/search-engine-optimization/` | Managed SEO engagement |
| `/seo/aeo/` | Answer clarity, question coverage and evidence |
| `/seo/geo/` | Brand consistency, sources and generative-search observations |
| `/seo/on-page-seo/` | URL-level content and structure improvements |
| `/seo/off-page-seo/` | Relevant references and earned outreach |
| `/seo/local-seo/` | Genuine local business discovery |
| `/seo/hire-seo-expert/` | Consultation, defined projects and ongoing support |
| `/sem/` | Paid search and social channel selection |
| `/sem/google-ads/` | Google Ads planning and management |
| `/sem/social-media-ads/` | Paid social, creative and testing |
| `/sem/bing-ads/` | Microsoft Advertising |
| `/sem/chatgpt-ads/` | Suitability and eligibility assessment; no assumed Indian advertiser eligibility |
| `/website-development/` | Website planning, design, implementation and handover |
| `/about/` | Working approach without invented people or history |
| `/contact/` | Native enquiry form, phone, email, WhatsApp and supplied address |
| `/thank-you/` | Non-indexable confirmation page with a popup after an acknowledged enquiry |
| `/privacy-policy/` | Actual form, storage and third-party processing information |
| `/terms/` | Website-use and enquiry information; project terms remain separate |

All 20 pages are generated as static HTML with one H1, distinct metadata and canonical URLs. The thank-you page is excluded from the sitemap and always noindex; the other 19 pages are eligible for indexing on production. Unknown paths return a real 404 through the production server. The canonical policy uses trailing slashes; known slashless pages redirect with HTTP 308, preserving query strings.

## Intentionally not published

- Insights listing, articles and navigation: omitted according to the user's override.
- Google Form/embed/configuration: replaced by the existing Google Sheets enquiry integration.
- Work, case studies, client logos, reviews and team profiles: no owner-verified material supplied.
- Chatbots, scheduling and payment flows: not part of the requested contact journey.

## Owner-requested design corrections

The original black-and-blue JustGrow wordmark and “Grow Smarter. Grow Faster.” tagline are restored in the header and footer. The header explicitly says “Contact Us”. The existing WhatsApp number and prefilled message are restored through the floating green button, with an additional WhatsApp link on Contact.

The homepage leads with business benefits and explains the contribution of search, paid advertising and website development. Service pages explain business benefits connected to the work being offered. Decorative upward arrows were removed from navigation, buttons, page links, the favicon and social preview. Interactive controls and cards use restrained hover shadows with reduced-motion support.

Repeated phone/email links have been removed from homepage, service and hub heroes. Direct contact details remain on Contact and in the footer; policy pages retain their relevant email contact. Primary enquiry buttons use larger text, strong contrast and visible focus/shadow states. On mobile, “Contact Us” stays visible in the sticky header without opening the menu, and main enquiry buttons span the available width. The restored WhatsApp button remains available.

## Page structure and editing

All 16 pages with FAQs end their main content at the FAQ section. Duplicate closing CTA and related-service sections after FAQs were removed at the owner's request. The footer remains on all 20 pages. About and legal pages have no FAQ section and retain their existing layouts.

- SEO detail content and layout: `src/data/seoPageContent.ts`, `src/pages/SEOServicePage.tsx`, `src/components/SEOServiceVisual.tsx` and `src/components/SEOProcessTabs.tsx`.
- Off-page SEO has its own layout and process in `src/pages/OffPageSEO.tsx`.
- SEM content and channel visuals: `src/data/semPageContent.ts`, `src/pages/SEMServicePage.tsx` and `src/components/SEMServiceVisual.tsx`. SEM reuses the SEO service layout.
- SEO overview and website development: `src/pages/DiscoveryPages.tsx`.
- About and Contact: `src/pages/About.tsx`, `src/pages/Contact.tsx` and `src/components/CompanyVisual.tsx`.
- Native enquiry forms share `src/components/EnquiryForm.tsx`; preserve its validation, service preselection and duplicate-submission protections.

The [content review](AUDIT-CONTENT.md) records each page's purpose. The [homepage keyword map](HOMEPAGE-CONTENT.md) preserves the owner's keyword choices.

## Google Sheets deployment boundary

The website keeps the existing Apps Script URL and makes one POST per enquiry. The server and form changes are implemented and tested with mocks. The included Apps Script adds row-level submission IDs and locking, but installing it requires access to the existing Google project and knowledge of the worksheet tab/column layout. It has not been remotely installed. The actual upstream success response and live row count remain unverified. See the README for installation steps.

## Owner review and deployment inputs

- Confirm the live script's response contract and install durable ID protection in the existing sheet if required across restarts/instances.
- Review privacy/website terms against actual business handling and hosting practices. No retention period, governing law, refund rule or registered entity has been invented. Add verified details before publishing where applicable.
- Confirm the production host runs the Node API or an equivalent adapter. A static-only upload cannot accept enquiries by itself.
- Set `SITE_INDEXABLE=true` at build and runtime only for the canonical production site. Previews stay noindex.
- No historic redirect map was invented: the inspected original application used root-URL views. Add verified legacy URLs from hosting/Search Console if any exist.
- The owner supplied GTM container `GTM-WRZZBS6F`; both installation snippets are in the shared HTML template for every page. Container tags/triggers and any GA4 setup still require verification in the owner's GTM account. Existing CustomEvents are not automatically forwarded to `dataLayer`.
- New proof modules require owner-approved facts and client permission. Future articles should be genuinely reviewed and published only if the owner reintroduces that scope.

## Research used

- [WebIndia Inc.](https://www.webindiainc.com/): service hierarchy and consultation patterns; no copied claims or assets.
- [Existing JustGrow](https://www.justgrow.in/): domain context; local source supplied the original interaction architecture.
- [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features): established SEO fundamentals remain applicable; no special AI schema promise.
- [OpenAI advertising](https://ads.openai.com/): paid placements are distinct from answers; eligibility and account features must be checked before a proposal promises launch.
- [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization): factual organization properties; no ratings, awards or unsupported partnerships.
- [Apps Script LockService](https://developers.google.com/apps-script/reference/lock/lock-service) and [Content Service](https://developers.google.com/apps-script/guides/content): concurrency control and JSON acknowledgements through redirect-following requests.
