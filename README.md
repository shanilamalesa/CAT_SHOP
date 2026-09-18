# CAT Shop

A small product catalogue for lip products — lipsticks, lip gloss, lip care and gift sets.

> **Find your perfect match and redefine your lip routine today.**

**Live URL:** https://cat-shop-wheat.vercel.app

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

- **Next.js 15** (App Router, JavaScript, no `src` directory)
- **Tailwind CSS**
- **PostgreSQL** via the `pg` driver — local in development, Neon in production
- **Vercel** for hosting

## Routes

| Route | What it does |
|---|---|
| `/` | Hero, category tiles, new arrivals |
| `/products` | Full product grid |
| `/products/[slug]` | Product detail, WhatsApp enquiry, related products |
| `/products/category/[cat]` | Products filtered by category |
| `/search?q=` | Search across product name and description |
| `/about` | The story behind the name |
| `/contact` | WhatsApp contact |
| `/sitemap.xml` | Generated from the database |
| `/robots.txt` | Crawler rules |

Plus `loading.js`, `not-found.js` and `error.js` boundaries.

## Lighthouse

Measured against the live site in an incognito window:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 |
| `/products` | 95 | 100 | 100 | 100 |

Browser extensions distort these numbers badly — an ordinary window scored 63 on
performance for the same page. Incognito is the honest measurement.

## SEO and sharing

- Per-product `generateMetadata` supplies title, description, canonical URL and Open Graph tags, so pasting a product link into WhatsApp produces a preview card with the product photo.
- Product pages embed schema.org `Product` JSON-LD, which lets search engines show price and availability directly in results.
- `sitemap.js` builds the sitemap from the database, so adding a product adds it to the sitemap with no manual editing.

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

## Deployment

Hosted on Vercel, with Postgres on Neon.

- The Vercel **Framework Preset must be Next.js**. Setting it to "Other" produces sitewide 404s with no useful error.
- Neon requires SSL. `lib/db.js` switches it on automatically when the host contains `neon.tech`, so the same file works locally and in production.
- The six environment variables above must be set in Vercel too, since `.env.local` is gitignored and never deployed.
- `NEXT_PUBLIC_SITE_URL` must be the real deployed domain. If it is missing, the code falls back to `localhost`, which silently breaks the sitemap and every Open Graph image.
- Environment variables are read at build time, so changing one requires a redeploy before it takes effect.

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
Unsplash License:

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

Original filenames, which carry the photographer attributions, are preserved in
`credits-raw.txt`.

## What I'd add next

- **A brand palette.** The site currently runs on Tailwind's default neutral greys. A custom palette defined in the Tailwind config would let every button, heading and border change together.
- **A working contact form.** `/contact` is a WhatsApp link only. A real form needs a POST handler and somewhere to deliver messages.
- **Better search.** Search uses `ILIKE '%term%'`, so "glosses" will not match "gloss" and typos find nothing. Postgres full-text search with `tsvector` would fix both.
- **A `featured` column.** The home page shows new arrivals by `created_at`. A Featured section was built and then removed, because with all ten products seeded in one transaction it returned exactly the same four items — a genuine "featured" list needs the shopkeeper to choose.
- **Cart and checkout.** The catalogue is deliberately read-only for now.
- **Product variants.** Shades and sizes are currently separate products.
- **Generated OG images.** Open Graph tags point at the product photo rather than a composed image via `next/og`.
- **A restricted database user.** The app connects as the owner role; it only ever reads, so a `cat_app` user with `SELECT` alone would be tighter.

## Notes

Prices, product names and descriptions are fictional — this is a portfolio
project, not a working shop.
