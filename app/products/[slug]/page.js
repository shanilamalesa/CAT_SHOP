import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";


const WHATSAPP_NUMBER = "447417449196";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getProduct(slug) {
    const { rows } = await pool.query(
        `SELECT id, slug, name, description, price_cents, image_url, in_stock, category FROM products WHERE slug = $1`, [slug]
    );
    return rows[0] || null;
}

async function getRelated(category, slug) {
    const { rows } = await pool.query(
        `SELECT slug, name, price_cents, image_url FROM products WHERE category = $1 AND slug <> $2 ORDER BY created_at DESC LIMIT 3`, [category, slug]
    );
    return rows;
}

function formatPrice(cents) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100);
}

//pre rendering every product page at build time
export async function generateStaticParams() {
    const { rows } = await pool.query(`SELECT slug FROM products`);
    return rows.map((r) => ({ slug: r.slug }));
    
}

//per-product <title>, description and OG image
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: "Product not found - CAT Shop" };
    }

    const title = `${product.name} - CAT Shop`;
    const description = product.description?.slice(0, 155);

    return {
        title, 
        description,
        alternates: { canonical: `${SITE_URL}/products/${product.slug}`},
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/products/${product.slug}`,
            type: "website",
            images: [
                {
                    url: `${SITE_URL}${product.image_url}`,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${SITE_URL}${product.image_url}`],
        },
    };
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) notFound();

    const related = await getRelated(product.category, product.slug);

     const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name} (${formatPrice(product.price_cents)})`
  )}`;

    const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.image_url}`,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
        <nav className="mb-6 text-sm text-neutral-500">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:underline">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-800">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
                <Image 
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col">
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                    {product.category.replace(/-/g, " ")}
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
                    {product.name}
                </h1>

                <p className="mt-3 text-2xl font-medium text-neutral-900">
                    {formatPrice(product.price_cents)}
                </p>

                <p className={`mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    product.in_stock
                    ? "bg-green-100 text-green-800"
                    : "bg-neutral-200 text-neutral-600"
                }`}
                >
                    {product.in_stock ? "In stock" : "Out of Stock"}
                </p>

                <p className="mt-6 leading-relaxed text-neutral-700">
                    {product.description}
                </p>

                
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.65 4.19 3.71.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
            Enquire on WhatsApp
          </a>
 
          <p className="mt-3 text-xs text-neutral-500">
            Opens WhatsApp with a pre-filled message about this product.
          </p>
        </div>
      </div>
 
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            More in {product.category.replace(/-/g, " ")}
          </h2>
 
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((item) => (
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
                      sizes="(max-width: 640px) 50vw, 33vw"
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
        </section>
      )}
    </main>
  )
}