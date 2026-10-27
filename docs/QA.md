# Verification report

## URL structure — 27 October 2026

Preserved the existing lowercase, descriptive route hierarchy and added allowlisted permanent 308 redirects for duplicate slashes, case variants, missing trailing slashes and `index.html` variants. Redirects retain query strings and go directly to the preferred page. Unknown and unsafe paths remain 404; no new service slug aliases were invented.

Type checking and all 19 tests passed. Indexable-build HTTP checks passed for all 20 pages and 98 redirect variants, with one-hop destinations, unchanged query parameters, consistent canonical/Open Graph URLs, valid internal links, structured data and correct robots headers. The sitemap contains exactly the 19 canonical content URLs and excludes `/thank-you/`. Private-file and unknown-path checks also passed. No live enquiries were submitted. The final build was restored to preview/noindex.

The read-only live check still found an older deployment: the homepage canonical points to `https://justgrow.com`, all 19 non-home application routes return 404, and robots.txt/sitemap.xml return 404. HTTPS/non-www redirects exist at the edge. These local fixes require deployment of the current application with `SITE_INDEXABLE=true` at both build time and runtime; the live site was not changed.

Evidence: [indexable HTTP report](../.qa/audit/url-structure-indexable/http.json), [live deployment check](../.qa/url-structure/live.json). References: [Google URL structure guidance](https://developers.google.com/search/docs/crawling-indexing/url-structure), [permanent redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Popup OK returns home — 27 October 2026

The confirmation button is now labelled OK and navigates directly to `/` using history replacement, instead of only closing the popup. The thank-you entry is replaced by the homepage. Escape still dismisses the dialog. Production build and type checking passed; mocked browser checks across all 13 form locations confirmed homepage navigation, no repeated submissions/events and preserved error handling. The Contact flow also retained its Escape/focus behavior. No live enquiry was submitted.

## Thank-you page and confirmation popup — 26 October 2026

Added `/thank-you/` to the generated route inventory while keeping it permanently noindex and outside the sitemap. The shared form navigates there only after `success` and `syncedToSheet` are both confirmed. Its successful-submission lock stays engaged through navigation. The dialog says “Thank you for submitting your form!” and promises a call when a phone number was supplied; otherwise it promises email follow-up. Got it/Escape dismiss the dialog and focus returns to Back to Home.

The page receives only a timestamp and two booleans in tab history, never contact details. Receipts expire after 30 minutes. Direct visits do not claim a submission or emit an enquiry event. Reloads keep the confirmed message without reopening the popup, sending a request or repeating the event. Session-storage restrictions do not prevent the redirect. Failed or unconfirmed API responses leave the form and its values in place.

Type checking, builds and all 17 tests passed. HTTP checks covered all 20 routes, including the thank-you page's noindex response/header in an indexable build and sitemap exclusion. `scripts/thank-you-qa.mjs` intercepted all API submissions and blocked GTM/analytics requests: all 13 form locations passed triple-submit, redirect, popup, single-event and refresh checks. Contact additionally passed error/unconfirmed-response checks, no-phone/email wording, disabled session storage, direct URL access, focus/Escape and 360/1440px popup bounds. No browser errors or live sheet writes occurred. The final workspace build was restored to preview/noindex.

Evidence: [mocked browser report](../.qa/thank-you/report.json), [mobile popup](../.qa/thank-you/popup-360.png), [desktop popup](../.qa/thank-you/popup-1440.png), [indexable HTTP checks](../.qa/audit/thank-you-indexable/http.json). These are local checks; the live Apps Script and deployed website remain unverified for this change.

## Service structured data — 26 October 2026

Updated all 12 service pages with linked Service, WebPage, Organization, WebSite and BreadcrumbList entities. Added CollectionPage/ItemList markup to the SEO and SEM overviews, listing their seven and four service destinations respectively. Service types, descriptions, categories, canonical URLs and India coverage use existing business information. No prices, ratings, certifications or platform partnerships were added. The 404 emits an empty schema array.

The schema is generated from `src/data/structuredData.ts` during prerendering. Type checking, production build and all 15 tests passed. Three schema checks cover all service identities, overview destinations, reference resolution, duplicate entities and visible breadcrumb labels. GTM and Google verification markup remain in the shared template. Validation was local; Google Rich Results Test, Search Console and live deployment were not rechecked.

Implementation references: [Schema.org Service](https://schema.org/Service), [ItemList](https://schema.org/ItemList), [Google breadcrumb requirements](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) and [structured-data content guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Structured data describes the actual services; it does not establish eligibility for a guaranteed search appearance.

## Google Tag Manager installation — 26 October 2026

Installed the owner-supplied `GTM-WRZZBS6F` loader near the start of the shared HTML head and the noscript iframe immediately after the opening body tag. Rebuilt all 19 pages and the 404. Verified exactly one loader and fallback on every generated page, with both outside the React root. A local DOM fixture confirmed one asynchronous request URL and one initial `gtm.js` dataLayer event. Type checking, production build and all 12 existing tests passed. No live container, Tag Assistant session, configured conversion tags or analytics receipt was verified. Earlier performance and no-third-party-tag findings below predate this installation.

## Latest content change — 26 October 2026

Removed related-service and closing CTA sections after FAQs. Type checking, the production build and all 12 existing tests passed. A generated-HTML check verified that all 16 pages with FAQs end there and all 19 public pages retain their footer. The full browser and performance audits were not rerun for this removal. The earlier audit and screenshot results below are historical evidence for their respective builds.

## Earlier verification history

Local checks on 24 October 2026. No production deployment or live sheet submission was performed.

## Completed

- TypeScript type check passed.
- Vite build and React static rendering generated 19 public pages plus a 404 page.
- Ten automated tests passed: concurrent/repeated submissions, uncertain responses, upstream failure formats, validation, consent, formula escaping, client request coalescing, Apps Script duplicate IDs with mocked sheet storage, page metadata/link integrity and route content coverage.
- Headless Chrome checked all 19 routes at 360, 390, 768, 1024 and 1440px: 95 layout checks, no document-level horizontal overflow, exactly one H1 per page, no JavaScript or hydration errors.
- Mobile menu and SEO submenu open/close, Escape behavior and restored trigger focus passed.
- Goal selector and native FAQ disclosures passed.
- Contact service prefill, blank optional phone, mocked success and three rapid submits producing one request passed.
- Optional phone validation accepted an international number and rejected non-phone text.
- Mocked server rejection retained entered values and presented a focused error notice.
- Reduced-motion mode disabled hover transitions.
- Production HTTP checks: Home, AEO and Contact return 200; `/seo` redirects to `/seo/` with 308; unknown pages return 404; the server bundle is not publicly served.
- Local/preview robots response and response headers block indexing.
- HTML checks confirmed unique titles/descriptions, correct canonical host, valid structured-data JSON, live internal route targets, contact links and absence of Google Form or Insights links.
- Original 1200 × 630 PNG social image generated from the editable SVG.

## Evidence

The SEO overview and website-development redesigns passed TypeScript checking, the production build and all ten automated tests. Targeted Chrome checks covered both routes at 360, 390, 768, 1024 and 1440px with no horizontal overflow or application errors. Checks verified seven SEO service links, four website option cards, seven SEO FAQs and eight website FAQs, native keyboard disclosure controls, primary CTA text contrast of at least 4.5:1, touch heights of at least 44px and correct Contact service preselection. Desktop and mobile screenshots were reviewed. No live form was submitted. These routes now use `src/pages/DiscoveryPages.tsx` and scoped `src/styles/discovery-pages.css`.

The homepage colour, FAQ and CTA refinements passed TypeScript checking, the production build, all ten automated tests and 95 responsive route/width checks. Desktop and mobile screenshots were reviewed. All eight native FAQ disclosures open and close with Enter; the goal CTA carries the selected service to Contact. Hero, FAQ and closing primary buttons meet a 4.5:1 text contrast ratio and a 44px minimum touch height. Browser checks found no horizontal overflow or application errors. Existing enquiry checks passed with mocked requests, including one request for three rapid submissions. No live enquiry was sent.

The final reference-inspired About layout and SEO/SEM-styled Contact page passed TypeScript checking, the production build, all ten tests and 95 responsive route/width checks. Browser checks confirmed four About value cards, eight advantage blocks, four capability links, matching Contact sections, readable labels and no horizontal overflow or application errors. The Contact CTA scrolls to the form below the header; service preselection, validation, success, error retention and duplicate-submit protection passed with mocked requests. Desktop/mobile screenshots of the hero, cards, company introduction and enquiry form were reviewed. No live enquiry was sent.

The About and Contact rewrites passed TypeScript checking, the production build, all ten automated tests and 95 responsive route/width checks. The existing enquiry success, validation, failure and duplicate-submit checks passed using mocked requests. Final desktop and mobile checks confirmed readable layouts and the Contact CTA exposing the form below the sticky header. The final spacing adjustment was rebuilt and checked at 390px and 1440px. The unwanted advertiser reference is absent from the built ChatGPT Ads page. No live enquiry was sent. Content notes are in [the content review](AUDIT-CONTENT.md).

On 25 October 2026, the SEM overview, Google Ads, Social Media Ads, Bing Ads and ChatGPT Ads redesigns passed TypeScript checking, the production build, all ten automated tests and 95 responsive route/width checks. Chrome reported zero application errors and no horizontal overflow. All five SEM pages passed process-tab keyboard checks, service selection, correct analytics paths and a triple-submission test producing one mocked request. The overview links to all four channels; each page includes a distinct visual and the traffic-to-enquiry-to-follow-up journey. Mobile and desktop screenshots were reviewed. The build generated all 19 public routes; application assets measured about 132.52 kB gzipped JavaScript and 15.25 kB gzipped CSS. No live enquiries or advertising campaigns were submitted. See [the page editing guide](HANDOVER.md#page-structure-and-editing) for page and content details.

On 25 October 2026, the AEO and GEO redesigns passed TypeScript checking, the production build, all ten automated tests and 95 responsive route/width checks. Chrome reported no application errors or horizontal overflow. Both pages passed process-tab and keyboard checks, service preselection, analytics page-path checks and three rapid submissions producing one mocked request. Desktop/mobile screenshots were reviewed for readable headings, visible CTAs, forms and the new visuals. No live enquiry was sent. Implementation notes are in [the page editing guide](HANDOVER.md#page-structure-and-editing).

The SEO Services, Hire an SEO Expert, Local SEO and On-Page SEO redesigns passed type checking, the production build, all ten automated tests and 95 responsive route/width checks. Each new page also passed process-tab and keyboard checks, correct service preselection, correct analytics page-path checks and a triple-submission test producing one mocked request. Mobile and desktop hero, enquiry, benefit and process screenshots were reviewed. The page mapping and content decisions are in [the page editing guide](HANDOVER.md#page-structure-and-editing). No live enquiries were submitted.

The Off-Page SEO redesign passed type checking, the production build, all ten automated tests and 95 responsive browser checks. Final checks cover the direct-to-form CTA target, process tabs and keyboard navigation, Off-page SEO preselection, correct analytics page path and one mocked network request for three rapid submissions. The shared Contact form's existing success, validation and failure checks also passed. No live sheet data was submitted. Page structure and implementation notes are in [the page editing guide](HANDOVER.md#page-structure-and-editing).

The homepage keyword/content revision passed type checking, a production build, all three generated-page tests and 95 browser route/width checks. Three new service illustrations and the revised primary-keyword heading are checked by the browser harness; screenshots of each illustration are saved as `.qa/home-visual-{search,ads,website}-{390,1440}.png`. No horizontal overflow or application errors were found. Keyword placement and content decisions are documented in `docs/HOMEPAGE-CONTENT.md`.

The typography revision removed the shared service-page section navigation, increased body copy, labels, links and form text, and separated overlapping service illustration cards. Type checking, the production build and all three generated-page tests passed. The final 95 browser route/width checks confirmed no horizontal overflow, no section-navigation strip, no visible content labels below 12px (excluding the brand tagline and decorative elements), no overlapping illustration cards, and visible mobile header CTAs. Existing interaction checks passed with mocked form requests and no browser application errors.

- Browser output: `.qa/browser-report.json` (generated locally, ignored by Git).
- Screenshots: `.qa/home-1440.png`, `.qa/home-390.png`, and desktop/mobile Contact and AEO screenshots.
- Tests: `tests/lead-handler.test.ts` and `tests/pages.test.ts`.
- Browser harness: `scripts/browser-qa.mjs`; uses the installed Windows Chrome and port 3100, replaces form network calls with mocks before submitting.

The restricted execution sandbox prevented Chrome rendering processes from starting. The same local checks completed with the tool's approved execution permission. No website error caused that initial browser startup failure.

## Performance and accessibility limits

The revised build emitted about 96 kB gzipped application JavaScript and 9.0 kB gzipped CSS. Graphics use inline SVG/CSS, fonts use the system stack, and no third-party analytics scripts load. These are build observations, not a Lighthouse score or field Core Web Vitals measurements.

The browser checks were repeated after the owner-requested corrections: original logo and tagline, “Contact Us” navigation, existing WhatsApp destination, removal of diagonal arrow icons, and business-benefit layouts. All 95 route/width checks and the ten existing automated tests passed. No live WhatsApp message or sheet submission was sent.

The subsequent contact-detail cleanup passed type checking, a production rebuild and the three existing generated-page tests. Browser checks also verify that marketing-page main content has no repeated phone/email links and the mobile header CTA is visible, within the viewport and at least 44px tall. Primary enquiry buttons use larger text and full available width on small screens.

Keyboard interactions, landmarks, labels, focus states, native validation and reduced motion were implemented and exercised where listed. This is not an independent WCAG certification, screen-reader audit or full accessibility conformance test. No production LCP/INP/CLS or real-user data is available.

## Still external to this checkout

The existing Apps Script deployment must return a valid success acknowledgement. Its source, permissions, worksheet layout and live response were not available for verification. The optional durable duplicate-prevention script is prepared but not remotely installed. A controlled, owner-authorised production submission should confirm one sheet row before release. Existing duplicate rows were not deleted.

Production hosting, canonical-host routing, Google Search Console validation, actual advertiser account eligibility and owner review of policy details remain deployment/business checks.

## Complete audit — 26 October 2026

The [complete audit report](AUDIT.md) supersedes earlier estimates and records the audited build, deployment findings and release gates at the time of those checks. It preserves the owner-approved navy/blue design, native Sheets form and WhatsApp.

The final browser regression passed all 95 route/width layouts with zero overflow or browser errors. Detailed coverage passed all 19 direct/reload/back/forward journeys, 114 FAQ keyboard checks and 38 axe scans with no reported violations. Extra reflow, no-JavaScript, touch/pointer, reduced-motion and anchor checks are recorded separately. Both indexing modes passed the generated-page/HTTP checks; the final artifact is intentionally preview/noindex. Twelve automated tests and type checking passed.

Delivery compression, build/runtime indexing consistency, preview sitemap exclusion, the homepage hydration artifact, logo accessible names and the WhatsApp landmark were fixed. Website-development content now explains delivery measures and client inputs. See the [measured before/after performance table](AUDIT-PERFORMANCE.md), rather than historical bundle estimates above.

Public read-only checks found the old homepage with a wrong-domain canonical and 404s for all 18 intended non-home routes, robots.txt and sitemap.xml. No deployment or live enquiry was performed. The report explicitly separates local passes, public failures and external checks that remain unverified.
