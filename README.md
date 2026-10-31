# JustGrow

Multipage agency site built with React, Vite and Express. The navy-and-blue layout retains the original JustGrow wordmark, tagline and green WhatsApp contact button. The build produces real HTML for every public page; React adds menus, FAQs, goal selection and the contact form. No Google Form or Insights section is included.

## Build and run

- `npm run typecheck`
- `npm run build`
- `npm test` (page checks require the build output)
- `npm start` serves the production build and the enquiry API.

Vercel production deployments enable indexing automatically using `VERCEL_TARGET_ENV` / `VERCEL_ENV`; Vercel previews and development stay noindex. Local builds default to noindex. An explicit `SITE_INDEXABLE=false` disables indexing even in production: remove it or set it to true in Vercel's Production environment and redeploy if present. Keep Vercel's system environment variables exposed. For other production hosts serving https://www.justgrow.in, set `SITE_INDEXABLE=true` at **build time and runtime**, then rebuild. The prerender script and server share `api/indexing.ts` and read `.env.local` and `.env`, with existing environment variables taking priority.

The build includes 19 indexable content pages, a `/thank-you/` utility page and the 404. The thank-you page always has noindex metadata/headers and is excluded from the sitemap, including in production.

The build writes a private `dist/build-manifest.json`. The server refuses to start if its indexing setting differs from the build, preventing contradictory runtime headers and HTML metadata. Preview sitemaps are empty; an indexable build lists the 19 canonical public URLs. Route inventory is independent of sitemap inclusion.

Edit files under `src/`, then rebuild. Do not format or edit `dist/index.html`: added whitespace inside the rendered root can cause React hydration mismatches. `dist/` is excluded in `.prettierignore`. Build output includes Brotli and gzip alternatives; the Node server negotiates them and caches hashed assets immutably. HTML remains revalidated.

Deploy the Node server, not only the static HTML, unless the host separately provides the same `/api/submit-lead` handler. `api/submit-lead.ts` retains the prior fetch-handler adapter; the Express server is the locally verified runtime. Preserve platform-specific deployment configuration for your host.

## URL structure

The preferred origin is `https://www.justgrow.in`. Page URLs use lowercase, hyphenated words and trailing slashes, grouped under `/seo/` and `/sem/` where relevant. Existing service slugs are preserved. Canonical tags, Open Graph URLs, structured data, internal links and the indexable sitemap use these same paths; tracking and Contact service-selection parameters do not enter canonical URLs.

The production Express server redirects known page variants (uppercase, repeated slashes, missing trailing slash and `index.html`) directly to their canonical path with HTTP 308, preserving the query string. For example, `/SEO//LOCAL-SEO/index.html?service=local-seo` redirects to `/seo/local-seo/?service=local-seo`. Unknown pages return 404 rather than redirecting to the homepage. Routing rules live in `api/page-routing.ts`; HTTP checks run with `node scripts/audit-http.mjs url-check` against port 3100. HTTPS and non-www redirects must remain configured at the hosting edge.

## Editing

- Business/contact configuration: `src/data/site.ts`.
- All twelve service pages: `src/data/services.ts`.
- Service-specific business benefits: `src/data/serviceBenefits.ts`.
- Route inventory and page metadata: `src/data/metadata.ts`.
- Structured data: `src/data/structuredData.ts`, included in initial HTML by `scripts/prerender.tsx`. Each of the 12 service pages has its own Service identity, provider, category, description, canonical page and stated India service area. SEO/SEM overview pages use CollectionPage and ItemList for their linked services. Shared Organization/WebSite identities and page-specific breadcrumbs connect the markup without duplicating business entities.
- Homepage and supporting copy: `src/pages/`.
- Header, footer and reusable UI: `src/components/SiteLayout.tsx`.
- Shared tokens and responsive styles: `src/styles/site.css`; page-specific colour refinements in `src/styles/`.
- Original SVG graphics: `src/components/Sculpture.tsx`.
- Social preview: `public/share-card.png` (1200 ? 630), with editable SVG source alongside it.

The original `Logo`, `FloatingWhatsApp` and `WhatsAppIcon` components are used by the public application. Other earlier components/data remain in the repository, including pre-existing user edits, but their old pages are not rendered. No unverified team profiles, testimonials, client projects or results are rendered.

## Google Sheets and the duplicate fix

The old tracked submission implementation sent FormData, URL-encoded data and JSON to the same Apps Script endpoint, causing three potential writes. The working copy had begun removing these fallbacks. The redesign preserves the single API path and adds:

- A synchronous form lock and a stable random submission ID.
- Coalescing of concurrent requests with the same ID.
- A server cache that returns the original result for repeated IDs and rejects changed payloads.
- No alternate transport, automatic write retry or browser PII backup.
- Server validation, sheet-formula escaping, an allowlisted upstream host and no enquiry payload logging.
- Success only after Google returns JSON with `success: true` or the legacy `result: "success"`; explicit errors, HTML/login pages and failed HTTP responses are not treated as saved leads.

The server cache lasts 24 hours in a single process and does not survive restarts or cover separate server instances. For durable protection, install `scripts/google-apps-script.gs` into the **existing** Apps Script project, then update its existing web-app deployment:

1. Review the current sheet layout before changing the script. The expected first nine columns are timestamp, form type, full name, email, phone, company, service, preferred date and message.
2. Reserve column J for `submissionId`. Do not overwrite an occupied column; adapt the script if your actual layout differs.
3. Set Script Properties `SPREADSHEET_ID` to the existing spreadsheet ID and `SHEET_NAME` to the exact existing worksheet tab name. Neither creates a second lead database.
4. Merge any owner-required existing behavior, retain appropriate access settings, and update the existing deployment version so its URL remains valid.
5. With owner-authorised test data, verify one row, retry the same submission ID and confirm no second row.

The script holds a Google Apps Script lock while checking the ID column and appending the row. The live Apps Script project was not available in this workspace, so it has **not** been updated. No test enquiry was sent to the live sheet. Confirm the deployed script's acknowledgement format before production release. After an ambiguous network response, the UI keeps the form values and advises calling/emailing before resubmitting.

After an acknowledged submission, the shared form opens `/thank-you/` with a small confirmation dialog. Its OK button goes directly to the homepage and replaces the thank-you history entry. Escape can dismiss the popup without navigating. Visitors who provided a phone number see a call follow-up message; others see an email follow-up message. A 30-minute receipt in the tab's history carries only a timestamp, phone-presence flag and popup-display flag. Contact values never enter the URL or receipt. Refreshing does not resend the enquiry, repeat its event or reopen the popup. Direct visits show a neutral page. If navigation is unavailable, the existing inline confirmation remains as a fallback. The page and dialog are in `src/pages/ThankYou.tsx`; mocked browser checks run with `node scripts/thank-you-qa.mjs` against port 3100.

## Measurement

Google Tag Manager container `GTM-WRZZBS6F` is installed in the shared `index.html` template: its loader is near the start of the head and its noscript iframe is immediately after the opening body tag. Prerendering includes both snippets once on all 20 pages and the 404 page, including local previews. Container tags and triggers are managed in Google Tag Manager; their published configuration has not been verified here. No separate GA4 ID was added.

The GTM loader now waits until the page has loaded and painted, then runs at the next idle opportunity (with a 1.5-second maximum idle wait); an earlier pointer or keyboard interaction starts it immediately. The container and noscript fallback are preserved. Very short visits may be measured differently. The browser also emits `justgrow:analytics` CustomEvents with non-personal data for phone/email clicks, service CTAs and acknowledged enquiries. These existing events are not automatically forwarded to GTM's `dataLayer` by this installation.

Phone/email clicks are micro-conversions. `enquiry_confirmed` is emitted only after the API confirms a sheet acknowledgement; it is not a qualified lead or a sale. Event detail contains event name, service slug, route path and (for clicks) CTA position, not form contents or query strings.

## Content and launch notes

See the [complete audit and launch blockers](docs/AUDIT.md), [performance comparison](docs/AUDIT-PERFORMANCE.md), [handover and route inventory](docs/HANDOVER.md) and [earlier verification history](docs/QA.md). Commercial engagement terms, retention practices and any future work/testimonials need owner review. Do not publish invented case studies, office locations, account eligibility or results.

The design uses system sans-serif fonts, original SVG/CSS visuals and no WebGL, remote font requests or image-generation dependencies.

Pages are selected asynchronously by `src/loadPage.tsx` for both prerendering and browser hydration. The initial HTML stays complete while the browser loads only the selected page's code. Header/footer links and form choices use the small `serviceCatalog.ts`, checked against the full service content by tests. Prerendering inlines styles to avoid a render-blocking CSS request; the homepage includes only base and homepage styles and preloads its own JavaScript dependencies. Local development still loads the full stylesheet. Set `AUDIT_ORIGIN` to measure a deployed site with `scripts/audit-performance.mjs`; reports are stored under `.qa/` and are specific to their test environment.
