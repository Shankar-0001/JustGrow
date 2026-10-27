# JustGrow audit, fixes and verification

Later tracking change: GTM container `GTM-WRZZBS6F` was installed after this audit. Statements below about absent tracking tags describe the audited build. See [verification history](QA.md) for installation checks; container contents and their performance were not audited.

Snapshot scope: the measurements and screenshots below predate the subsequent removal of sections after FAQs. That change passed type checking, a production build, all 12 existing tests and a generated-HTML check confirming that all 16 FAQ pages end at their FAQs and all 19 pages retain the footer. Lighthouse and the full browser audit were not rerun for that content removal. Public-site findings below describe the recorded audit checks, not a new live-site check.

Prepared 26 October 2026. The local application has completed route, content, functional, accessibility and responsive verification. The currently deployed website is **not ready**: it serves an older application, 18 intended routes return 404, and the homepage canonical points to the wrong domain. Nothing was published and no enquiry was sent to the live sheet.

The owner's explicit clarifications supersede the older brief: retain the navy-and-blue identity, native Google Sheets form and existing WhatsApp. The logo, service hierarchy, independently accessible URLs and useful visuals remain.

## Environment and scope

React 19, TypeScript, Vite 6.4.3 and Express 4 on Node 22.16. Routing is an explicit pathname switch in `src/App.tsx`, with ordinary crawlable anchors. The build prerenders HTML for each public route, bundles the Node server and generates compressed static alternatives. React hydrates the HTML for interactions. No routing or rendering framework migration was needed.

- Local production-build preview: `http://127.0.0.1:3100`, intentionally noindex.
- Separate local indexable-build check: `http://127.0.0.1:3102`, tested then stopped. The final workspace build was restored to preview/noindex.
- Public read-only checks: `https://www.justgrow.in/`, plus HTTPS/hostname variants. Hosting response resembles Vercel, but deployment configuration/account access was unavailable; that is not proof of the intended runtime.
- 19 published routes, discovered from source metadata, navigation, footer, internal links and the indexable sitemap. No published Insights, article, case-study or thank-you routes exist. Submission confirmation is inline.
- Chrome 155 on Windows. All routes at 360, 390, 768, 1024 and 1440 CSS pixels (95 layout checks). Additional 390/1440 automated accessibility scans, keyboard interactions, emulated touch and 200%-equivalent reflow checks. Real phones, Safari, Firefox and assistive-technology sessions were not available.

## URL coverage

Each path below is under `https://www.justgrow.in`. Every page is intended to be indexable in production; every local preview page is deliberately noindex. Local PASS means initial/rendered content, metadata, direct opening, refresh, internal navigation, back/forward and link checks passed. It does not certify Google indexing or live hosting. The canonical column is the verified **local output**.

| Path | Page type | Local HTTP / result | Canonical | Public HTTP / result |
| --- | --- | --- | --- | --- |
| `/` | Home | 200 PASS | `https://www.justgrow.in/` | 200 FAIL: canonical is `https://justgrow.com` |
| `/seo/` | SEO service selector | 200 PASS | `https://www.justgrow.in/seo/` | 404 FAIL |
| `/sem/` | Paid advertising overview | 200 PASS | `https://www.justgrow.in/sem/` | 404 FAIL |
| `/seo/search-engine-optimization/` | Managed SEO | 200 PASS | `https://www.justgrow.in/seo/search-engine-optimization/` | 404 FAIL |
| `/seo/aeo/` | Answer optimization | 200 PASS | `https://www.justgrow.in/seo/aeo/` | 404 FAIL |
| `/seo/geo/` | Generative search visibility | 200 PASS | `https://www.justgrow.in/seo/geo/` | 404 FAIL |
| `/seo/on-page-seo/` | On-page SEO | 200 PASS | `https://www.justgrow.in/seo/on-page-seo/` | 404 FAIL |
| `/seo/off-page-seo/` | Off-page SEO | 200 PASS | `https://www.justgrow.in/seo/off-page-seo/` | 404 FAIL |
| `/seo/local-seo/` | Local SEO | 200 PASS | `https://www.justgrow.in/seo/local-seo/` | 404 FAIL |
| `/seo/hire-seo-expert/` | Specialist support | 200 PASS | `https://www.justgrow.in/seo/hire-seo-expert/` | 404 FAIL |
| `/sem/google-ads/` | Google Ads | 200 PASS | `https://www.justgrow.in/sem/google-ads/` | 404 FAIL |
| `/sem/social-media-ads/` | Paid social | 200 PASS | `https://www.justgrow.in/sem/social-media-ads/` | 404 FAIL |
| `/sem/bing-ads/` | Microsoft Advertising | 200 PASS | `https://www.justgrow.in/sem/bing-ads/` | 404 FAIL |
| `/sem/chatgpt-ads/` | ChatGPT advertising | 200 PASS | `https://www.justgrow.in/sem/chatgpt-ads/` | 404 FAIL |
| `/website-development/` | Website services | 200 PASS | `https://www.justgrow.in/website-development/` | 404 FAIL |
| `/about/` | Company | 200 PASS | `https://www.justgrow.in/about/` | 404 FAIL |
| `/contact/` | Enquiry | 200 PASS | `https://www.justgrow.in/contact/` | 404 FAIL |
| `/privacy-policy/` | Privacy information | 200 PASS | `https://www.justgrow.in/privacy-policy/` | 404 FAIL |
| `/terms/` | Website terms | 200 PASS | `https://www.justgrow.in/terms/` | 404 FAIL |

[Machine-readable coverage](audit-route-coverage.csv) also lists negative route checks. `/unknown-audit-page/`, `/insights/`, `/work/` and `/thank-you/` correctly return 404/noindex without a canonical locally. Private `/server.cjs`, `/build-manifest.json` and `/.env` are not exposed. These are intentionally unpublished, not missing planned pages. Public versions of those negative cases were NOT TESTED.

## Findings and fixes

| Priority | Issue and affected routes | Evidence / reproduction | Resolution |
| --- | --- | --- | --- |
| P0 | Live deployment misses all 18 non-home routes | GET any intended service/contact URL; `production-routes.json` records 404 | BLOCKED on hosting deployment. Local independent routes all return 200. |
| P1 | Live homepage canonical points to `https://justgrow.com`; live sitemap and robots return 404 | Read homepage source and GET `/sitemap.xml`, `/robots.txt`; `production-http.json` | Correct output verified locally; deployment required. |
| P1 | Homepage hydration failure | Baseline browser reports React #418; generated home HTML was pretty-formatted inside the React root | Rebuilt from source; excluded `dist/` in `.prettierignore`; documented generated-file handling. Final complete browser regression reports zero errors. |
| P1 | Uncompressed JS/CSS delayed mobile rendering on every route | Baseline JS ~475 KB and CSS ~100 KB transferred uncompressed; Lighthouse compression diagnostic | Build creates Brotli/gzip; server negotiates encoding, preserves type, sets Vary and immutable hashed-asset caching. Final payloads are 125,088 bytes JS and 17,989 bytes CSS with Brotli. HTML also compressed and revalidated. |
| P1 | Build/runtime indexing settings could disagree | Build metadata and runtime headers came from separate settings | Private build manifest and startup guard reject mismatch. Both indexable and preview modes verified. |
| P2 | Preview sitemap listed intentionally noindex pages | Baseline preview sitemap contained 19 entries | Empty preview sitemap; indexable build contains exactly 19 canonical pages. Tests use route inventory independently of indexability. |
| P2 | Floating WhatsApp outside a semantic landmark | Baseline axe `region` findings | Wrapped in labelled complementary landmark; zero final axe violations across 38 scans. |
| P2 | Logo accessible name did not match visible text | Lighthouse `label-content-name-mismatch`; an expanded custom label still triggered its experimental rule | Removed the redundant `aria-label` so the link inherits its visible wordmark/tagline. Explicitly enabled this rule in the final axe recheck. Visible logo unchanged. |
| P2 | Sticky header allowed text behind it to show through | Screenshot review of scrolled pages | Solid white header; navy/blue design retained; form-anchor positions verified below header. |
| P2 | Website-development delivery/measurement copy and related links were thin | Individual rendered-content review | Added handover checks, client inputs, post-launch measurement and relevant managed SEO/on-page/Ads links. |

Existing duplicate-submission protection was preserved and tested; it was not newly invented during this audit. Live cross-instance/restart protection still depends on the deployed Apps Script. See contact limits below.

## Performance

See [all 38 before/after route/profile comparisons](AUDIT-PERFORMANCE.md) and [full metric CSV](audit-performance.csv). They include LCP, CLS, FCP, TTFB, TBT, transfer sizes and exact UTC timestamps. Raw Lighthouse reports preserve diagnostics and settings. Representative noisy mobile routes use three-run medians, with every run retained.

Reported mobile performance improved from 78–81 to 97–99; desktop from 99–100 to 100. Homepage mobile median LCP improved from 3.96 to 1.71 seconds and total transfer from 601.5 to 163.6 KiB. All recorded CLS values were zero. TBT did not improve on every route; the per-route table preserves those increases and the run-to-run variability. The 94 saved Lighthouse measurements comprise 38 baseline, eight baseline repeats, 38 post-fix and ten final repeats. The final repeats follow the last logo accessibility correction; the detailed report discloses that small build difference.

The root performance bottleneck was delivery compression. Static SVG/CSS graphics and system fonts already avoid raster texture and font-download costs. No active canvas/WebGL scenes or continuous 3D animation loops were found; a legacy Sculpture component is not mounted. Hero content and contact actions remain in initial HTML, including in the four JavaScript-disabled spot checks. No useful visual or content was removed for scores. Reduced-motion behavior passed.

Lab TBT is not INP. Field INP, CrUX and real-user percentile results are **NOT TESTED**, because no relevant data/account was available. Local TTFB is not production hosting latency. Preview Lighthouse SEO scores are intentionally reduced by noindex/robots restrictions; indexable behavior was verified separately through HTTP and build checks. No claim of indexed pages or field Core Web Vitals is made.

## SEO, content and structured data

All 19 local routes contain meaningful initial HTML, one H1, unique titles/descriptions, matching canonical and Open Graph URLs, crawlable links and valid structured-data JSON. Browser-rendered metadata/content agree with prerendered output. Main-content heading scans found no skipped levels. Internal destinations and fragment IDs resolve; footer/navigation discovery found no orphan public routes.

Organization/WebSite, BreadcrumbList and Service markup are used where applicable and match visible content. No fake Review/AggregateRating or invented results were introduced. FAQ answers are visible and keyboard-accessible; no rich-result guarantee is made. Google Rich Results Test/Search Console validation is NOT TESTED without a deployed version/account.

The local indexable build allows crawling, has index/follow HTML, no conflicting noindex header and a 19-URL sitemap. Preview uses noindex headers/meta, disallows crawling and has an empty sitemap. No invented last-modified dates are supplied. Trailing-slash redirects return 308 and retain query strings for all 18 non-root routes; canonicals omit tracking parameters. Existing URLs were retained, so no migration redirect mapping was needed. Public HTTPS/preferred-www redirects passed, but the destination deployment still fails the route/canonical checks above.

The [individual content review](AUDIT-CONTENT.md) covers every page: SEO overview selects services while managed SEO describes the engagement; AEO addresses buying questions while GEO addresses brand/source consistency; paid social is separate from organic management; ChatGPT ads are separate from organic AI answers. Client requirements, scope, deliverables, realistic measures and FAQs were reviewed. No clients, certifications, team members or numerical results were invented. Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) supports normal SEO practices rather than special AI schema or guaranteed inclusion.

## Navigation, accessibility and visual checks

- PASS: 19 direct opens, refreshes, internal navigation journeys and back/forward checks.
- PASS: 95 responsive checks; zero horizontal overflow. All 19 routes also passed reflow at 720 CSS pixels/DPR 2, an approximation of a 1440-wide viewport at 200% zoom, not a real browser zoom or text-only scaling test.
- PASS: 114 FAQ disclosures by keyboard; process tabs and mobile menus, Escape/focus return, service selector, pointer and emulated touch controls.
- PASS: 13 form-anchor positions remain below the sticky header after scrolling; contact CTAs and service preselection work.
- PASS: essential services and contact destinations are reachable within three activations. This is a navigation check, not proof of overall usability.
- PASS: 38 axe-core 4.10.3 scans using WCAG 2/2.1/2.2 A/AA and best-practice tags, with the experimental label-in-name rule explicitly enabled in the final recheck; zero reported violations. Keyboard labels and primary CTA contrast checks passed. Automated color checks have limitations on gradients; no full WCAG certification is claimed.
- PASS: reduced-motion checks; no dependency on canvas for essential content.
- NOT TESTED: actual iOS/Android hardware, Safari/Firefox, screen readers, text-only scaling and a complete manual WCAG conformance audit.

Fresh mobile/desktop hero screenshots exist for **every** route under `.qa/audit/baseline/` and `.qa/audit/final/`. Representative template comparisons were reviewed for readable headings, visible CTAs, preserved colors/logo/WhatsApp and absence of clipping. Main visual changes are the opaque header and website delivery copy; the audit is not a visual redesign.

## Contact and analytics

The native form and WhatsApp remain as the owner requested. No Google Form was added. `marketing@justgrow.in`, `tel:+918252553686`, displayed `+91 82525 53686`, and Flat 111, Pawani Apartment, Balanagar, Hyderabad remain configured. Phone/email destinations were verified without sending a message or placing a call.

| Check | Result | Limit |
| --- | --- | --- |
| Service-specific CTA and preselection | PASS | Local browser behavior |
| Required fields, consent and optional international phone | PASS | Mocked request/local validation |
| Triple submit | PASS: one mocked request | Does not establish live Sheets deduplication |
| Concurrent requests and replay | PASS: one fake upstream write | Single process unit test |
| Changed payload with same ID | PASS: rejected | Local handler fixture |
| HTML/login, failed HTTP, null JSON or explicit upstream failure | PASS: no false success | Mocked upstream |
| Lost response | PASS: no automatic alternate write; values retained | Live delivery outcome cannot be inferred |
| Success UI and enquiry event | PASS after acknowledged fixture response | Acknowledgement is not a qualified lead/sale |
| Apps Script lock and persistent ID column | PASS in script fixture | Live script/version and column layout not accessible |
| Actual end-to-end sheet submission | NOT TESTED | No live enquiry sent; needs owner-authorized test |
| Google Form URL/embed | Not applicable | Explicitly superseded by native Sheets form |
| GA4/GTM | No configured ID/tag found | External analytics account/configuration NOT TESTED |

`justgrow:analytics` CustomEvents separate phone/email clicks, CTAs and acknowledged enquiries. No form contents or personal query strings are included. A CustomEvent alone does not transmit analytics or prove a conversion. The enquiry API is no-store; invalid `{}` requests and disallowed methods were checked without reaching Google.

The server's deduplication cache is process-local and temporary. Persistent prevention across restarts/instances needs the supplied `scripts/google-apps-script.gs` logic deployed into the existing Apps Script project, after checking the real sheet columns. Neither that project nor the live sheet was modified. See [handover instructions](../README.md#google-sheets-and-the-duplicate-fix).

## Evidence and reproduction

| Evidence | Location |
| --- | --- |
| Full route browser checks, axe findings and console errors | [final browser report](../.qa/audit/final/route-audit.json) |
| 95 layouts and mocked form/navigation interactions | [responsive report](../.qa/audit/final/responsive.json) |
| Touch, reflow, no-JS and anchor checks | [additional checks](../.qa/audit/final/extra/checks.json) |
| Preview status/metadata/redirects/compression | [preview HTTP](../.qa/audit/final/http.json) |
| Indexable build verification | [indexable HTTP](../.qa/audit/indexable-build/http.json) |
| Public route failures and wrong canonical | [public routes](../.qa/audit/production-routes.json) |
| Public hostname/HTTPS and missing sitemap/robots | [public HTTP](../.qa/audit/production-http.json) |
| Homepage hydration before/after | `.qa/hydration/before.html`, `.qa/hydration/after.html`, baseline/final browser reports |
| Home comparison | [before mobile](../.qa/audit/baseline/home-390.png), [after mobile](../.qa/audit/final/home-390.png) |
| SEO overview comparison | [before desktop](../.qa/audit/baseline/-seo--1440.png), [after desktop](../.qa/audit/final/-seo--1440.png) |
| SEO detail comparison | [before AEO mobile](../.qa/audit/baseline/-seo-aeo--390.png), [after AEO mobile](../.qa/audit/final/-seo-aeo--390.png) |
| SEM detail comparison | [before Google Ads desktop](../.qa/audit/baseline/-sem-google-ads--1440.png), [after Google Ads desktop](../.qa/audit/final/-sem-google-ads--1440.png) |
| Website comparison | [before desktop](../.qa/audit/baseline/-website-development--1440.png), [after desktop](../.qa/audit/final/-website-development--1440.png) |
| Company comparison | [before About mobile](../.qa/audit/baseline/-about--390.png), [after About mobile](../.qa/audit/final/-about--390.png) |
| Contact comparison | [before desktop](../.qa/audit/baseline/-contact--1440.png), [after desktop](../.qa/audit/final/-contact--1440.png) |
| Legal comparison | [before terms mobile](../.qa/audit/baseline/-terms--390.png), [after terms mobile](../.qa/audit/final/-terms--390.png) |

Raw `.qa/` evidence is local/ignored; preserve or archive it separately when sharing the report. The `screenshots/` subfolders also contain earlier project captures; use the fresh files directly in baseline/final for this audit's before/after comparisons. The detailed reports/CSVs are in `docs/`.

Build/typecheck and 12 automated tests passed in both indexable and preview configurations. The deliberate indexing-mismatch startup test failed as intended. Reproduce with `npm run typecheck`, `npm run build`, `npm test`; then run `PORT=3100` with `npm start` (set the environment using the host shell). Keep `SITE_INDEXABLE` identical at build and runtime.

Audit-only dependencies: `npm install --prefix .qa/audit-tools --no-save --package-lock=false lighthouse@12.8.2 axe-core@4.10.3`. Run `node scripts/audit-http.mjs <phase>`, `node scripts/audit-browser.mjs <phase>`, `node scripts/audit-extra.mjs` and `node scripts/browser-qa.mjs` against the local server. Run performance separately using `node scripts/audit-performance.mjs <new-phase>`; saved phase files are reused, so choose a fresh phase for a changed build. The repeat configuration uses `AUDIT_ROUTES` JSON for `/`, `/sem/`, `/seo/local-seo/`, `/sem/chatgpt-ads/`, `AUDIT_PROFILE=mobile` and `AUDIT_RUNS=2`. These scripts use the installed Windows Chrome path. `node scripts/audit-report.mjs` aggregates the saved baseline/final evidence.

## Remaining launch requirements

1. **BLOCKED: hosting deployment.** Identify the intended production host/runtime and deploy the verified Node server plus assets, preserving `/api/submit-lead`. A static upload alone does not provide the tested API/server behavior. No deployment was attempted.
2. **BLOCKED: production indexing configuration.** Set `SITE_INDEXABLE=true` during both build and runtime for the real domain, rebuild, then repeat route/canonical/robots/sitemap checks on the deployed URL. Keep previews false. The current workspace artifact is intentionally noindex.
3. **BLOCKED: Apps Script account verification.** Review the existing sheet columns, deployed script version/access, acknowledgement format and persistent submission-ID protection. With explicit authorization, submit one labelled test and verify a replay creates no second row. Current tests are fixtures only.
4. **NOT TESTED: field and account evidence.** Search Console indexing, CrUX/INP, GA4/GTM collection and actual advertising eligibility require account access or real-user data. No IDs were invented.
5. **NOT TESTED: broader accessibility/browser coverage.** Schedule real-device and screen-reader checks before claiming conformance. The owner should also validate business details and retention/engagement practices against policy copy.

Local checks support handing this build over for deployment review. They do not make the currently deployed site production-ready. The failed live route/canonical checks and unverified end-to-end sheet behavior remain explicit release gates.
