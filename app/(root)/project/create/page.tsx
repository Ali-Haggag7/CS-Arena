import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/project/ProjectForm";
import { Rocket, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Project | CS-Arena",
  description: "Pitch your computer science project to the global developer community.",
};

const CreateProjectPage = async () => {
  const session = await auth();
  if (!session?.id) redirect("/");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 transition-colors duration-300">

      {/* ─── Premium Header Section ─── */}
      <section className="relative overflow-hidden min-h-[280px] flex flex-col items-center justify-center pt-24 pb-12 px-6 bg-white dark:bg-[#0a0a0c] border-b border-slate-200 dark:border-white/5">

        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg opacity-30 dark:opacity-50" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 dark:opacity-10 blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-sm shadow-sm">
            <Sparkles className="size-4" />
            <span>Enter the Arena</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight leading-tight">
            Pitch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Code</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-white/50 max-w-2xl leading-relaxed">
            Showcase your architecture, tech stack, and features to the global developer community. Let your hard work shine!
          </p>
        </div>
      </section>

      {/* ─── Form Container ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <ProjectForm />
      </div>

    </main>
  );
};

export default CreateProjectPage;