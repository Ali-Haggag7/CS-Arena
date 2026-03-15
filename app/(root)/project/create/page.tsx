import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/project/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Project",
  description: "Pitch your computer science project to the global developer community.",
};

const CreateProjectPage = async () => {
  const session = await auth();
  if (!session?.id) redirect("/");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24">

      {/* Header */}
      <section className="relative overflow-hidden min-h-[230px] flex flex-col items-center justify-center py-12 px-6 bg-gray-900 dark:bg-[#0d0d0f]">
        <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] rounded-full opacity-10 blur-[60px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Pitch Your <span className="text-primary">Code</span>
          </h1>
          <p className="text-[17px] text-white/50 max-w-2xl">
            Showcase your architecture, stack, and features to the global developer community.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <ProjectForm />
      </div>

    </main>
  );
};

export default CreateProjectPage;