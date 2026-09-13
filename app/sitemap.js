import pool from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const CATEGORIES = ["lipsticks", "lip-gloss", "lip-care", "gift-sets"];

export default async function sitemap() {
  const { rows } = await pool.query(
    `SELECT slug, created_at FROM products`
  );

  const staticPages = ["", "/products", "/search", "/about", "/contact"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/products/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productPages = rows.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.created_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}