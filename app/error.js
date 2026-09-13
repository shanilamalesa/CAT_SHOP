"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-neutral-900">
        Something went wrong
      </h1>
      <p className="mt-3 text-neutral-600">
        We hit an unexpected problem loading this page. Trying again often works.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-xl bg-neutral-900 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
        >
          Try again
        </button>
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