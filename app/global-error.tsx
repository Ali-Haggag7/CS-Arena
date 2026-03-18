"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-sans antialiased flex flex-col items-center justify-center p-6 relative selection:bg-red-500/30">

        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-40 pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(ellipse, #ef4444 0%, transparent 70%)" }}
        />

        {/* Error Card */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg bg-white dark:bg-[#111115] p-10 sm:p-14 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl">

          <div className="size-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative">
            <AlertTriangle className="size-12 text-red-500" />
            <div className="absolute -top-2 -right-2 size-4 bg-red-500 rounded-full animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white mb-4 tracking-tight">
            System Error
          </h1>

          <p className="text-slate-500 dark:text-white/50 mb-10 leading-relaxed text-base">
            An unexpected critical error occurred. Our engineering team has been notified automatically via Sentry to fix this issue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              type="button"
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3.5 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <RefreshCcw className="size-4" />
              Try Again
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 text-black dark:text-white border border-slate-200 dark:border-white/10 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <Home className="size-4" />
              Go Home
            </a>
          </div>
        </div>

      </body>
    </html>
  );
}