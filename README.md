# TAN, KONG & ASSOCIATES

Bilingual (EN / 中文) marketing and enquiry website for **TAN, KONG & ASSOCIATES** (陈和江律师事务所) — Advocates & Solicitors at Publika, Mont Kiara, Kuala Lumpur.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- next-intl (English / Chinese)
- Resend (contact form email)
- Deploy: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local
# Add RESEND_API_KEY and CONTACT_TO_EMAIL when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/en`).

## Environment

See [`.env.example`](.env.example):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap / OG |
| `RESEND_API_KEY` | Email delivery (optional in dev — enquiries are logged) |
| `CONTACT_TO_EMAIL` | Inbox for form submissions |
| `CONTACT_FROM_EMAIL` | Verified Resend from-address |

## Design system

- [`DESIGN.md`](DESIGN.md) — brand tokens and UI rules
- [`design-system/tan-kong-associates/MASTER.md`](design-system/tan-kong-associates/MASTER.md) — ui-ux-pro-max output
- Logo: [`public/logo.png`](public/logo.png)

## Agent skills (project-local)

Installed under `.cursor/skills/` via starshop: ui-ux-pro-max, awesome-design-md, awesome-shadcn-ui, geo-seo-claude, impeccable.
