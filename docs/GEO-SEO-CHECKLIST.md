# GEO / SEO checklist (geo-seo-claude)

- [x] LegalService + LocalBusiness + Attorney JSON-LD
- [x] FAQPage schema with answerable Q&A
- [x] sitemap.xml with hreflang alternates
- [x] robots.txt allowing major AI crawlers
- [x] public/llms.txt for AI answer engines
- [x] Per-route metadata + Open Graph
- [x] Semantic headings and citability-friendly copy
- [x] Canonical production origin centralized in `SITE_URL` (`src/lib/firm.ts`)
- [x] hreflang `en-MY` / `zh-MY` / `x-default` on every route
- [ ] Remove any stale `NEXT_PUBLIC_SITE_URL` override in Vercel project settings
- [ ] Submit sitemap in Google Search Console after deploy
- [ ] Add a dedicated 1200x630 Open Graph image (currently reuses the logo)
- [ ] Add BreadcrumbList schema to inner pages
