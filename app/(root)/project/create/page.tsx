import React from "react";
import ProjectForm from "@/components/project/ProjectForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Project | CS-Arena",
  description: "Pitch your computer science project to the world.",
};

const CreateProjectPage = () => {
  return (
    <main className="min-h-screen bg-white font-work-sans pb-24 relative">

      {/* Header Banner */}
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Pitch Your Code</h1>
        <p className="sub-heading !max-w-3xl mt-4">
          Showcase your architecture, stack, and features to the global developer community.
        </p>
      </section>

      {/* The Form */}
      <div className="px-6 lg:px-8 ">
        <ProjectForm />
      </div>

    </main>
  );
};

export default CreateProjectPage;