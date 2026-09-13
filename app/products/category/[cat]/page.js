import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";

const CATEGORY_LABELS = {
  lipsticks: "Lipsticks",
  "lip-gloss": "Lip Gloss",
  "lip-care": "Lip Care",
  "gift-sets": "Gift Sets",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getByCategory(cat) {
  const { rows } = await pool.query(
    `SELECT slug, name, price_cents, image_url, in_stock
     FROM products
     WHERE category = $1
     ORDER BY name`,
    [cat]
  );
  return rows;
}

function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export async function generateStaticParams() {
  const { rows } = await pool.query(
    `SELECT DISTINCT category FROM products`
  );
  return rows.map((r) => ({ cat: r.category }));
}

export async function generateMetadata({ params }) {
  const { cat } = await params;
  const label = CATEGORY_LABELS[cat];

  if (!label) return { title: "Category not found — CAT Shop" };

  const title = `${label} — CAT Shop`;
  const description = `Shop our ${label.toLowerCase()} collection. Find your perfect match and redefine your lip routine today.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/category/${cat}` },
    openGraph: { title, description, url: `${SITE_URL}/products/category/${cat}` },
  };
}

export default async function CategoryPage({ params }) {
  const { cat } = await params;
  const label = CATEGORY_LABELS[cat];

  if (!label) notFound();

  const products = await getByCategory(cat);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{label}</span>
      </nav>

      <h1 className="text-3xl font-semibold text-neutral-900">{label}</h1>
      <p className="mt-2 text-neutral-600">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {Object.entries(CATEGORY_LABELS).map(([slug, name]) => (
          <li key={slug}>
            <Link
              href={`/products/category/${slug}`}
              className={`inline-block rounded-full px-4 py-1.5 text-sm transition ${
                slug === cat
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>

      {products.length === 0 ? (
        <p className="mt-12 text-neutral-600">
          Nothing here yet.{" "}
          <Link href="/products" className="underline">
            Browse everything
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((item) => (
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
                  {!item.in_stock && (
                    <p className="mt-1 text-xs text-neutral-500">Out of stock</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}