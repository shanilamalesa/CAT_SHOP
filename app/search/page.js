import Image from "next/image";
import Link from "next/link";
import pool from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Search — CAT Shop",
  description:
    "Search our lip products. Find your perfect match and redefine your lip routine today.",
  alternates: { canonical: `${SITE_URL}/search` },
};

async function searchProducts(term) {
  const { rows } = await pool.query(
    `SELECT slug, name, price_cents, image_url, category
     FROM products
     WHERE name ILIKE $1 OR description ILIKE $1
     ORDER BY name`,
    [`%${term}%`]
  );
  return rows;
}

function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const term = (q || "").trim();
  const results = term ? await searchProducts(term) : [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-neutral-900">Search</h1>

      {/* Plain GET form: no client JS needed, and the query lands in the URL
          so results are shareable and bookmarkable. */}
      <form action="/search" method="get" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Try 'matte', 'rose', 'gift'..."
          aria-label="Search products"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-neutral-900 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-700"
        >
          Search
        </button>
      </form>

      {!term && (
        <p className="mt-8 text-neutral-600">
          Enter a word above, or{" "}
          <Link href="/products" className="underline">
            browse everything
          </Link>
          .
        </p>
      )}

      {term && (
        <p className="mt-8 text-neutral-600">
          {results.length === 0
            ? `No matches for "${term}".`
            : `${results.length} ${
                results.length === 1 ? "result" : "results"
              } for "${term}".`}
        </p>
      )}

      {term && results.length === 0 && (
        <p className="mt-3 text-neutral-600">
          Try a shorter word, or{" "}
          <Link href="/products" className="underline">
            browse all products
          </Link>
          .
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((item) => (
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formatPrice(item.price_cents)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}