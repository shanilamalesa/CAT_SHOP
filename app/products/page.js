import pool from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "All Products | CAT Shop",
  description: "Browse our full range of lipsticks, glosses and lip care.",
};

export default async function ProductsPage() {
  const { rows: products } = await pool.query(
    "SELECT id, slug, name, price_cents, image_url, category FROM products ORDER BY name"
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">All Products</h1>
      <p className="text-gray-600 mb-8">
        Find your perfect match and redefine your lip routine today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}>
            <div className="border rounded-lg p-4 h-full transition hover:shadow-lg hover:-translate-y-1">
              <Image
                src={p.image_url}
                alt={p.name}
                width={400}
                height={400}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-600 mt-1">
                ${(p.price_cents / 100).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}