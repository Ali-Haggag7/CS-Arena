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

  // Redirect unauthenticated users instead of showing a broken form
  if (!session?.id) redirect("/");

  return (
    <main className="min-h-screen bg-white dark:bg-black font-work-sans pb-24">

      {/* Header */}
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Pitch Your Code</h1>
        <p className="sub-heading !max-w-3xl mt-4">
          Showcase your architecture, stack, and features to the global developer community.
        </p>
      </section>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <ProjectForm />
      </div>

    </main>
  );
};

export default CreateProjectPage;