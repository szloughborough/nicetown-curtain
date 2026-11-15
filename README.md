# nicetown-curtain.com

Static brand showcase for NICETOWN curtains (US market). Product discovery happens here; every purchase is completed on Amazon.com. No cart, no checkout, no server-side code.

## Structure

- `index.html` and every page in `folder/index.html` form — clean URLs for Cloudflare Pages.
- `assets/` — self-hosted variable fonts, CSS, JS and 183 WebP product images.
- `sitemap.xml`, `robots.txt`, `_headers`, `llms.txt`, `404.html`.
- 114 indexable pages: home, catalog, 12 category pages, 95 product family pages, deal hub, about, contact, privacy, terms.

## Deploy

Cloudflare Pages → **Upload assets** (or connect this repo), framework preset `None`, no build command, output directory `/`. The custom domain is `nicetown-curtain.com`; canonical tags, sitemap and robots all use the non-www HTTPS host.

## Notes

- Prices, ratings and discounts are a dated snapshot. Amazon is the final source for price and availability.
- Product buttons use exact-ASIN Amazon Attribution links; there are no bare `/dp/` links.
- Analytics: GA4 and Microsoft Clarity. Search Console verification meta is on the homepage only.
- This repository contains **only the published static site**. Research data, affiliate link ledgers, keyword exports and build scripts are kept locally and are intentionally not versioned here.

Generated as build `nt20261115bf3`.
