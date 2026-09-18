import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const CATEGORIES = [
  { slug: "lipsticks", label: "Lipsticks", blurb: "Satin, matte and cream finishes" },
  { slug: "lip-gloss", label: "Lip Gloss", blurb: "Shine, tint and everyday shimmer" },
  { slug: "lip-care", label: "Lip Care", blurb: "Oils and balms that keep lips soft" },
  { slug: "gift-sets", label: "Gift Sets", blurb: "Ready-to-give bundles and duos" },
];

export const metadata = {
  title: "CAT Shop — Lip products for every match",
  description:
    "Find your perfect match and redefine your lip routine today. Lipsticks, glosses, lip care and gift sets.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "CAT Shop — Lip products for every match",
    description:
      "Find your perfect match and redefine your lip routine today.",
    url: SITE_URL,
    type: "website",
  },
};


async function getNewArrivals() {
  const { rows } = await pool.query(
    `SELECT slug, name, price_cents, image_url
     FROM products
     ORDER BY created_at DESC
     LIMIT 4`
  );
  return rows;
}

function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function HomePage() {
  const newArrivals = await getNewArrivals();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <section className="py-12 text-center sm:py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          CAT Shop
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
          Find your perfect match
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
          Redefine your lip routine today. A small, considered range of
          lipsticks, glosses, lip care and gift sets.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="w-full rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700 sm:w-auto"
          >
            Shop all products
          </Link>
        
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-neutral-900">Shop by category</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/products/category/${cat.slug}`}
                className="flex h-full flex-col rounded-xl border border-neutral-200 p-5 transition hover:border-neutral-900 hover:shadow-md"
              >
                <span className="font-medium text-neutral-900">{cat.label}</span>
                <span className="mt-1 text-sm text-neutral-600">{cat.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">New Arrivals</h2>
          <Link href="/products" className="text-sm text-neutral-600 hover:underline">
            View all
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {newArrivals.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/products/${item.slug}`}
                className="group block overflow-hidden rounded-xl border border-neutral-200 transition hover:shadow-md"
              >
                <div className="relative aspect-square bg-neutral-100">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-600">
                    {formatPrice(item.price_cents)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}