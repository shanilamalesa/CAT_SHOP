# CAT Shop

A small product catalogue for lip products — lipsticks, lip gloss, lip care and gift sets.

> **Find your perfect match and redefine your lip routine today.**

**Live URL:** _(to be added after deployment)_

---

## About the name

CAT Shop is named after three siblings — **C**atherine, **A**aliya and **T**ravis.

## Niche

Lip products, priced in USD, across four categories:

| Category | Slug |
|---|---|
| Lipsticks | `lipsticks` |
| Lip Gloss | `lip-gloss` |
| Lip Care | `lip-care` |
| Gift Sets | `gift-sets` |

Ten products are seeded. There is no cart or checkout — enquiries go through
WhatsApp, with each product page pre-filling the product name and price into
the message.

## Tech stack

- **Next.js** (App Router, JavaScript, no `src` directory)
- **Tailwind CSS**
- **PostgreSQL** via the `pg` driver — local in development, Neon in production
- **Vercel** for hosting

## Routes

| Route | What it does |
|---|---|
| `/` | Hero, category tiles, featured products |
| `/products` | Full product grid |
| `/products/[slug]` | Product detail, WhatsApp enquiry, related products |
| `/products/category/[cat]` | Products filtered by category |
| `/search?q=` | Search across product name and description |
| `/about` | The story behind the name |
| `/contact` | WhatsApp contact |
| `/sitemap.xml` | Generated from the database |
| `/robots.txt` | Crawler rules |

Plus `loading.js`, `not-found.js` and `error.js` boundaries.

## Running locally

```bash
npm install
```

Create `.env.local`:

```dotenv
PG_USER=postgres
PG_PASSWORD=your_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=cat_shop
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Create and seed the database:

```bash
psql -U postgres -c "CREATE DATABASE cat_shop"
psql -U postgres -d cat_shop -f db/schema.sql
psql -U postgres -d cat_shop -f db/seed.sql
```

Then:

```bash
npm run dev
```

Restart the dev server after any change to `.env.local` — Next.js only reads it at startup.

## Database

Single `products` table:

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `slug` | text | Unique; used in URLs |
| `name` | text | |
| `description` | text | |
| `price_cents` | integer | Stored in cents to avoid float rounding |
| `image_url` | text | Path under `/public` |
| `in_stock` | boolean | |
| `category` | text | Indexed |
| `created_at` | timestamp | |

Prices are stored as integer cents and formatted at render time with
`Intl.NumberFormat`. Storing money as a float invites rounding errors, so the
conversion happens once, in the UI.

## Image credits

All product photography is from [Unsplash](https://unsplash.com), used under the
Unsplash License. Photographers, in the order products appear in the seed data:

| Product | Photographer |
|---|---|
| Velvet Red Satin Lipstick | Laura Chouette |
| Bare Rose Nude Lipstick | Evangeline Sarney |
| Midnight Berry Matte Lipstick | Nathan Powers |
| Coral Blush Cream Lipstick | Karly Jones |
| Nude Peach Lip Gloss | Lilli P |
| Rosewater Shine Lip Gloss | Theodora Ispas |
| Glow Lip Oil | Devon Vereen |
| Everyday Beauty Gift Set | Johanne Pold Jacobsen |
| Poppy Red Lip Duo | Mockup Free |
| Sugar Plum Gloss Trio | PMV Chamara |

Original filenames are preserved in `credits-raw.txt`.

## What I'd add next

- **A working contact form.** Currently `/contact` is a WhatsApp link only. A real form needs a POST handler and somewhere to deliver messages.
- **Better search.** Search uses `ILIKE '%term%'`, so "glosses" will not match "gloss" and typos find nothing. Postgres full-text search with `tsvector` would fix both.
- **A `featured` column.** The home page currently shows the four most recent in-stock products, which is arbitrary when everything was seeded at once.
- **Cart and checkout.** The catalogue is deliberately read-only for now.
- **Product variants.** Shades and sizes are currently separate products.
- **Generated OG images.** Open Graph tags point at the product photo rather than a composed image via `next/og`.
- **A restricted database user.** The app connects as `postgres`; it only ever reads, so a `cat_app` user with `SELECT` alone would be tighter.

## Notes

Prices, product names and descriptions are fictional — this is a portfolio
project, not a working shop.