"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center font-sans">
        <h1 className="text-4xl font-extrabold text-black mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
          An unexpected error occurred. Our team has been notified automatically.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-primary transition-all duration-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-black text-black px-6 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}