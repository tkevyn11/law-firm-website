# DESIGN.md — TAN, KONG & ASSOCIATES

## Product
Bilingual (EN/ZH) marketing and enquiry website for a boutique Malaysian law firm at Publika, Mont Kiara, Kuala Lumpur. Two partners: Kenny Tan (criminal defence) and Melvin Kong (civil/corporate/PI/family).

## Brand
- **Firm:** TAN, KONG & ASSOCIATES · 陈和江律师事务所
- **Titles:** Peguambela & Peguamcara · Advocates & Solicitors
- **Aesthetic:** Prestige & trust — classical legal authority with modern clarity

## Color tokens
| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#1a2238` | Primary text, header, footer |
| Navy light | `#2a3550` | Hover / secondary surfaces |
| Gold | `#b8925a` | Accents, CTAs, dividers, Malay/English titles |
| Gold light | `#c9a227` | Highlights |
| Ivory | `#f8f6f1` | Page background |
| Slate text | `#0F172A` | Body (high contrast) |

## Typography
- **Display / headings:** EB Garamond (serif) — legal, authoritative
- **Body:** Source Sans 3 / Lato (sans) — readable, modern
- **Chinese:** Noto Serif SC (headings), Noto Sans SC (body)

## Layout principles
- Generous whitespace; max content width ~1120–1280px
- Thin gold rules and diamond ornaments echoing the logo
- No AI purple gradients, no emoji icons (Lucide SVGs only)
- Social proof and credentials visible; CTA in hero + after partners

## Components
- Header: logo left, nav, language switch, WhatsApp CTA
- Hero: firm name, bilingual tagline, dual CTAs (Enquire / WhatsApp)
- Practice area cards with gold accent border
- Partner profile cards
- Contact form + WhatsApp deep links + map

## Anti-patterns (from ui-ux-pro-max + Impeccable)
- No Inter/Arial as brand fonts
- No nested cards-in-cards
- No gray text on colored backgrounds
- No bounce/elastic easing
- cursor-pointer on all interactive elements
- Respect prefers-reduced-motion

## References
- Logo: `/public/logo.png`
- Design system: `design-system/tan-kong-associates/MASTER.md`
- Brand seeds: `.cursor/skills/awesome-design-md/` (bmw, apple prestige refs)
