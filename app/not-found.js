import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 text-neutral-600">
        The product or page you were looking for may have moved or sold out.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/products"
          className="rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
        >
          Browse products
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-300 px-6 py-3 font-medium text-neutral-900 transition hover:bg-neutral-100"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}