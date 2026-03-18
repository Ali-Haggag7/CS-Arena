import React, { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/project/ProjectForm";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/shadcn/skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("create_project");
  return {
    title: t("title"),
    description: t("description"),
  };
}

async function AuthenticatedForm() {
  const session = await auth();
  if (!session?.id) redirect("/");

  return <ProjectForm />;
}

export default async function CreateProjectPage() {
  const t = await getTranslations("create_project");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 transition-colors duration-300">

      <section className="relative overflow-hidden min-h-[280px] flex flex-col items-center justify-center pt-24 pb-12 px-6 bg-white dark:bg-[#0a0a0c] border-b border-slate-200 dark:border-white/5">
        <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-50" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 dark:opacity-10 blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="size-4" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight leading-tight">
            {t("hero_title1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{t("hero_title2")}</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-white/50 max-w-2xl leading-relaxed">
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <Suspense
          fallback={
            <div className="bg-white dark:bg-[#111115] rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <Skeleton className="h-10 w-full mb-6 rounded-xl" />
              <Skeleton className="h-32 w-full mb-6 rounded-xl" />
              <Skeleton className="h-10 w-full mb-6 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          }
        >
          <AuthenticatedForm />
        </Suspense>
      </div>

    </main>
  );
}