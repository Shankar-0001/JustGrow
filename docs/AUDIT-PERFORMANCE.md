# JustGrow performance evidence

This is a saved measurement snapshot from before the removal of sections after FAQs and installation of Google Tag Manager. Keep it for the before/after comparison; its scores are not a fresh measurement of later builds or the externally managed GTM container. See [verification history](QA.md) for subsequent checks.

Recorded 2026-10-25T16:34:20.206Z through 2026-10-26T02:14:39.498Z (UTC). All results are local production-build laboratory measurements, not measurements of the currently deployed website or field Core Web Vitals.

Lighthouse 12.8.2; Chrome 155 on Windows; http://127.0.0.1:3100. Mobile: Moto G Power emulation, 412 × 823, DPR 1.75, simulated 150 ms RTT / 1,638.4 Kbps / 4× CPU slowdown. Desktop: 1350 × 940, DPR 1, simulated 40 ms RTT / 10,240 Kbps / 1× CPU. Storage reset enabled. No concurrent browser audit or build ran during measurement.

Baseline and final each cover all 19 routes on both profiles. Home, SEM, local SEO and ChatGPT Ads each have two additional mobile runs because initial baseline results were noisy; those rows report the median of three runs for each metric. AEO also received two additional final mobile runs after its first final TBT was unusually high; its baseline remains a single run. Remaining rows are single runs and should not be treated as statistical estimates. Scores and metrics use their own medians, not the best run. The 38-run final sweep measured the compression/indexing/content fixes before the last removal of redundant logo aria-labels; final-repeat measures the rebuilt artifact after that accessibility-only correction. This small markup change is disclosed rather than presenting every sample as the identical build. Final all-route browser/axe checks cover the rebuilt artifact. A disk-full interruption during the desktop sweep was resolved by clearing only temporary audit Chrome profiles; completed reports were retained and the two unwritten results were rerun.

## Mobile

| Route | Runs before / after | Score | LCP seconds | FCP seconds | TBT ms | CLS | Transfer KiB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 3 / 3 | 79 → 99 | 3.96 → 1.71 | 3.81 → 1.71 | 45 → 56 | 0.000 → 0.000 | 601.5 → 163.6 |
| /seo/ | 1 / 1 | 80 → 99 | 3.81 → 1.72 | 3.81 → 1.72 | 14 → 39 | 0.000 → 0.000 | 585.8 → 161.3 |
| /sem/ | 3 / 3 | 78 → 98 | 3.95 → 1.71 | 3.95 → 1.71 | 52 → 93 | 0.000 → 0.000 | 605.8 → 165.2 |
| /seo/search-engine-optimization/ | 1 / 1 | 80 → 98 | 3.81 → 1.72 | 3.81 → 1.72 | 53 → 113 | 0.000 → 0.000 | 604.8 → 164.8 |
| /seo/aeo/ | 1 / 3 | 80 → 99 | 3.81 → 1.71 | 3.81 → 1.71 | 39 → 40 | 0.000 → 0.000 | 601.3 → 164.5 |
| /seo/geo/ | 1 / 1 | 80 → 97 | 3.81 → 1.73 | 3.81 → 1.73 | 31 → 122 | 0.000 → 0.000 | 603.2 → 164.9 |
| /seo/on-page-seo/ | 1 / 1 | 79 → 98 | 3.85 → 1.73 | 3.85 → 1.73 | 47 → 113 | 0.000 → 0.000 | 601.4 → 164.3 |
| /seo/off-page-seo/ | 1 / 1 | 80 → 99 | 3.80 → 1.73 | 3.80 → 1.73 | 20 → 43 | 0.000 → 0.000 | 603.6 → 165.1 |
| /seo/local-seo/ | 3 / 3 | 79 → 99 | 3.81 → 1.71 | 3.81 → 1.71 | 111 → 44 | 0.000 → 0.000 | 601.3 → 164.4 |
| /seo/hire-seo-expert/ | 1 / 1 | 80 → 99 | 3.81 → 1.72 | 3.81 → 1.72 | 46 → 68 | 0.000 → 0.000 | 602.3 → 164.7 |
| /sem/google-ads/ | 1 / 1 | 80 → 98 | 3.80 → 1.72 | 3.80 → 1.72 | 37 → 107 | 0.000 → 0.000 | 602.8 → 164.8 |
| /sem/social-media-ads/ | 1 / 1 | 80 → 98 | 3.81 → 1.73 | 3.81 → 1.73 | 61 → 122 | 0.000 → 0.000 | 603.6 → 164.9 |
| /sem/bing-ads/ | 1 / 1 | 80 → 98 | 3.81 → 1.73 | 3.81 → 1.73 | 46 → 119 | 0.000 → 0.000 | 603.1 → 164.8 |
| /sem/chatgpt-ads/ | 3 / 3 | 80 → 99 | 3.80 → 1.71 | 3.80 → 1.71 | 36 → 50 | 0.000 → 0.000 | 603.0 → 164.7 |
| /website-development/ | 1 / 1 | 80 → 99 | 3.80 → 1.72 | 3.80 → 1.72 | 0 → 32 | 0.000 → 0.000 | 584.3 → 161.3 |
| /about/ | 1 / 1 | 80 → 99 | 3.76 → 1.73 | 3.76 → 1.73 | 9 → 41 | 0.000 → 0.000 | 587.0 → 161.7 |
| /contact/ | 1 / 1 | 80 → 99 | 3.81 → 1.73 | 3.81 → 1.73 | 49 → 84 | 0.000 → 0.000 | 583.3 → 161.2 |
| /privacy-policy/ | 1 / 1 | 80 → 99 | 3.86 → 1.73 | 3.65 → 1.73 | 73 → 2 | 0.000 → 0.000 | 573.7 → 159.1 |
| /terms/ | 1 / 1 | 81 → 99 | 3.66 → 1.72 | 3.66 → 1.72 | 9 → 24 | 0.000 → 0.000 | 573.4 → 159.0 |

## Desktop

| Route | Runs before / after | Score | LCP seconds | FCP seconds | TBT ms | CLS | Transfer KiB |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 601.5 → 163.6 |
| /seo/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 585.8 → 161.3 |
| /sem/ | 1 / 1 | 99 → 100 | 0.74 → 0.38 | 0.74 → 0.38 | 0 → 0 | 0.000 → 0.000 | 605.8 → 165.2 |
| /seo/search-engine-optimization/ | 1 / 1 | 99 → 100 | 0.75 → 0.39 | 0.75 → 0.39 | 0 → 0 | 0.000 → 0.000 | 604.8 → 164.8 |
| /seo/aeo/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 601.3 → 164.5 |
| /seo/geo/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 603.2 → 164.9 |
| /seo/on-page-seo/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 601.4 → 164.3 |
| /seo/off-page-seo/ | 1 / 1 | 99 → 100 | 0.75 → 0.40 | 0.75 → 0.40 | 0 → 0 | 0.000 → 0.000 | 603.6 → 165.1 |
| /seo/local-seo/ | 1 / 1 | 99 → 100 | 0.74 → 0.38 | 0.74 → 0.38 | 0 → 0 | 0.000 → 0.000 | 601.3 → 164.4 |
| /seo/hire-seo-expert/ | 1 / 1 | 99 → 100 | 0.75 → 0.39 | 0.75 → 0.39 | 0 → 0 | 0.000 → 0.000 | 602.3 → 164.7 |
| /sem/google-ads/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 602.8 → 164.8 |
| /sem/social-media-ads/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 603.6 → 164.9 |
| /sem/bing-ads/ | 1 / 1 | 99 → 100 | 0.74 → 0.38 | 0.74 → 0.38 | 0 → 0 | 0.000 → 0.000 | 603.1 → 164.8 |
| /sem/chatgpt-ads/ | 1 / 1 | 99 → 100 | 0.74 → 0.38 | 0.74 → 0.38 | 0 → 0 | 0.000 → 0.000 | 603.0 → 164.7 |
| /website-development/ | 1 / 1 | 99 → 100 | 0.73 → 0.38 | 0.73 → 0.38 | 0 → 0 | 0.000 → 0.000 | 584.3 → 161.3 |
| /about/ | 1 / 1 | 99 → 100 | 0.74 → 0.38 | 0.74 → 0.38 | 0 → 0 | 0.000 → 0.000 | 587.0 → 161.7 |
| /contact/ | 1 / 1 | 99 → 100 | 0.74 → 0.39 | 0.74 → 0.39 | 0 → 0 | 0.000 → 0.000 | 583.3 → 161.2 |
| /privacy-policy/ | 1 / 1 | 99 → 100 | 0.70 → 0.38 | 0.70 → 0.38 | 0 → 0 | 0.000 → 0.000 | 573.7 → 159.1 |
| /terms/ | 1 / 1 | 100 → 100 | 0.69 → 0.39 | 0.69 → 0.39 | 0 → 0 | 0.000 → 0.000 | 573.4 → 159.0 |

[CSV with all metrics](audit-performance.csv) includes TTFB, separate script/style/image/font transfer bytes, sample counts and exact timestamps. Raw Lighthouse reports, audit diagnostics and environment settings are under ../.qa/audit/{baseline,baseline-repeat,final,final-repeat}/lighthouse/.

TTFB here measures a localhost Node server, not hosting latency. TBT is a lab metric, not INP. No real-user/CrUX data or Search Console access was available. Field evaluation requires the 75th percentile of actual visits, separately for mobile and desktop ([Web Vitals guidance](https://web.dev/articles/vitals)). Lighthouse uses simulated throttling ([method](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)).
