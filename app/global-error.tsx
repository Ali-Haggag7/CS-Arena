"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { RefreshCcw, Home, Terminal, ShieldAlert } from "lucide-react";

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
    <html lang="en" dir="ltr" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-sans antialiased flex flex-col items-center justify-center p-6 relative selection:bg-red-500/30 overflow-x-hidden">

        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          aria-hidden="true" />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none animate-pulse"
          style={{ background: "radial-gradient(ellipse, #ef4444 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center w-full max-w-3xl bg-white dark:bg-[#111115] p-8 md:p-14 rounded-[2.5rem] border border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="flex items-center gap-4 mb-10">
            <div className="size-16 md:size-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative group">
              <ShieldAlert className="size-8 md:size-10 text-red-500 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1.5 -right-1.5 size-3.5 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1.5 -right-1.5 size-3.5 bg-red-500 rounded-full" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 w-full border-b border-slate-200 dark:border-white/10 pb-10 mb-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-slate-200 dark:bg-white/10 hidden md:block" />

            <div className="text-left flex flex-col justify-center">
              <h1 className="text-3xl font-black text-black dark:text-white mb-3 tracking-tight">System Error</h1>
              <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed font-medium">
                A critical error has occurred. Our engineering team has been notified via Sentry to resolve this issue.
              </p>
            </div>

            <div className="text-right flex flex-col justify-center" dir="rtl">
              <h1 className="text-3xl font-black text-black dark:text-white mb-3 tracking-tight">خطأ في النظام</h1>
              <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed font-medium">
                حدث خطأ حرج غير متوقع. تم إبلاغ فريق الهندسة لدينا عبر Sentry لحل هذه المشكلة فوراً.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-[#0a0a0c] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 dark:text-white/40 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
              <Terminal className="size-4 text-red-500" />
              <span>ERR_DIGEST: {error.digest || "CRITICAL_FAILURE"}</span>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => reset()}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-6 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <RefreshCcw className="size-4" />
                Retry
              </button>
              <a
                href="/"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-black dark:bg-white/10 text-white dark:text-white border border-transparent dark:border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white/20 transition-all duration-300"
              >
                <Home className="size-4" />
                Home
              </a>
            </div>
          </div>

        </div>
      </body>
    </html>
  );
}