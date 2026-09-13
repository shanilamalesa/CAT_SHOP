import Link from "next/link";

const WHATSAPP_NUMBER = "447417449196";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Contact — CAT Shop",
  description:
    "Get in touch with CAT Shop on WhatsApp about any lip product, order or question.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact — CAT Shop",
    description: "Get in touch with CAT Shop on WhatsApp.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi CAT Shop, I have a question."
  )}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">Contact</span>
      </nav>

      <h1 className="text-3xl font-semibold text-neutral-900">Get in touch</h1>

      <p className="mt-4 leading-relaxed text-neutral-600">
        Questions about a shade, an order, or which gift set to pick? Message us
        on WhatsApp and we&apos;ll get back to you.
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
        Message us on WhatsApp
      </a>

      <div className="mt-12 rounded-2xl bg-neutral-100 p-6">
        <h2 className="font-semibold text-neutral-900">Before you message</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
          <li>
            Browsing first?{" "}
            <Link href="/products" className="underline">
              See the full range
            </Link>{" "}
            so you can tell us which product you mean.
          </li>
          <li>
            Every product page has its own WhatsApp button that fills in the name
            and price for you.
          </li>
          <li>
            We reply during the day, so an evening message may be answered the
            next morning.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Want to know where the name came from?{" "}
        <Link href="/about" className="underline">
          Read our story
        </Link>
        .
      </p>
    </main>
  );
}