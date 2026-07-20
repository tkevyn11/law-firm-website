# TAN, KONG & ASSOCIATES — Website Design Spec

**Date:** 2026-07-20  
**Status:** Approved for implementation (plan attached)

## Purpose
Marketing + enquiry website for a boutique KL law firm. Goals: promote partners, capture enquiries (form + WhatsApp), SEO/GEO visibility. English + Chinese.

## Stack
Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, next-intl, Resend, Vercel.

## Toolchain (starshop)
- ui-ux-pro-max → `design-system/tan-kong-associates/MASTER.md`
- awesome-design-md → prestige brand references in `.cursor/skills/awesome-design-md/`
- awesome-shadcn-ui → component patterns reference
- Impeccable → DESIGN.md + anti-slop enforcement
- geo-seo-claude → schema, AI crawlers, citability

## Pages
| Route | Content |
|-------|---------|
| `/[locale]` | Hero, intro, practice grid, why us, partners, CTA |
| `/[locale]/about` | Story, values, Kenny Tan + Melvin Kong bios |
| `/[locale]/practice-areas` | 8 practice areas with anchors |
| `/[locale]/contact` | Form, WhatsApp, office details, map |

## Brand
Navy `#1a2238` + Gold `#b8925a` + Ivory `#f8f6f1`. EB Garamond + Source Sans 3. Logo `/public/logo.png`.

## Contact
Zod-validated API → Resend; honeypot + rate limit. WhatsApp deep links per partner. Placeholders for firm email/domain until confirmed.

## SEO / GEO
Per-route metadata, hreflang, sitemap, robots (AI crawlers allowed), JSON-LD LegalService + Attorney ×2 + FAQPage.
