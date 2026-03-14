"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { createProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast"; // Shadcn UI Toast

// Dynamically import MDEditor to avoid SSR (Server-Side Rendering) hydration errors
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

/**
 * ProjectForm Component
 * A highly interactive, accessible form for users to submit their projects.
 * Features comprehensive Zod validation and a rich Markdown editor.
 */
export default function ProjectForm() {
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  const router = useRouter();
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");
    setFieldErrors({}); // Reset previous errors

    const formData = new FormData(e.currentTarget);

    try {
      // Pass formData and the markdown state to our Server Action
      const result = await createProject(formData, pitch);

      if (result.success) {
        // Trigger a beautiful success toast using Shadcn
        toast({
          title: "Success! 🎉",
          description: "Your project has been deployed successfully. Redirecting to the arena...",
          className: "bg-green-500 text-white border-none",
        });

        // Delay redirect slightly so the user can see the success message
        setTimeout(() => {
          router.push(`/project/${result.projectId}`);
        }, 2000);
      } else {
        // Handle field-specific Zod validation errors
        if (result.validationErrors) {
          setFieldErrors(result.validationErrors);
          setGeneralError("Please fix the errors highlighted below.");
        } else {
          setGeneralError(result.error || "Failed to create project.");
        }
      }
    } catch (error) {
      console.error(error);
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Helper function to render specific field error messages
   */
  const renderError = (fieldName: string) => {
    const errors = fieldErrors[fieldName];
    if (!errors || errors.length === 0) return null;
    return (
      <p className="text-14-medium text-red-500 mt-2 flex items-center gap-1">
        <AlertCircle className="size-4" />
        {errors[0]}
      </p>
    );
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[30px] shadow-xl border border-black-100/10 mt-10 space-y-8 font-work-sans"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-black-300">Submit Your Project</h2>
        <p className="text-16-medium text-black-200 mt-2">Share your code with the world and find collaborators.</p>
      </div>

      <div className="space-y-3">
        <label htmlFor="title" className="text-16-bold text-black-300 uppercase tracking-wide">Project Title</label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g., Flurry Social Media App"
          className={`w-full p-4 rounded-xl border bg-black-100/5 text-16-medium text-black-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${fieldErrors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-black-100/20'}`}
        />
        {renderError("title")}
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="text-16-bold text-black-300 uppercase tracking-wide">Short Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Briefly describe what your project does in 1-2 sentences..."
          className={`w-full p-4 rounded-xl border bg-black-100/5 text-16-medium text-black-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${fieldErrors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-black-100/20'}`}
        />
        {renderError("description")}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="techStack" className="text-16-bold text-black-300 uppercase tracking-wide">Tech Stack</label>
          <input
            id="techStack"
            name="techStack"
            required
            placeholder="Next.js, Tailwind, MongoDB..."
            className={`w-full p-4 rounded-xl border bg-black-100/5 text-16-medium text-black-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${fieldErrors.techStack ? 'border-red-500 ring-1 ring-red-500' : 'border-black-100/20'}`}
          />
          {renderError("techStack")}
        </div>

        <div className="space-y-3">
          <label htmlFor="image" className="text-16-bold text-black-300 uppercase tracking-wide">Cover Image URL</label>
          <input
            id="image"
            name="image"
            type="url"
            required
            placeholder="https://example.com/image.jpg"
            className={`w-full p-4 rounded-xl border bg-black-100/5 text-16-medium text-black-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${fieldErrors.image ? 'border-red-500 ring-1 ring-red-500' : 'border-black-100/20'}`}
          />
          {renderError("image")}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="githubLink" className="text-16-bold text-black-300 uppercase tracking-wide">GitHub Repository</label>
        <input
          id="githubLink"
          name="githubLink"
          type="url"
          required
          placeholder="https://github.com/your-username/your-repo"
          className={`w-full p-4 rounded-xl border bg-black-100/5 text-16-medium text-black-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${fieldErrors.githubLink ? 'border-red-500 ring-1 ring-red-500' : 'border-black-100/20'}`}
        />
        {renderError("githubLink")}
      </div>

      {/* Rich Markdown Editor restored! */}
      <div className="space-y-3" data-color-mode="light">
        <label htmlFor="pitch" className="text-16-bold text-black-300 uppercase tracking-wide">Project Details (Pitch)</label>
        <p className="text-14-normal text-black-200 mb-2">
          Use Markdown to format your project architecture, features, and how to run it locally.
        </p>
        <div className={`rounded-xl overflow-hidden transition-all ${fieldErrors.pitch ? 'border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border border-black-100/20'}`}>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 12, border: 'none' }}
            textareaProps={{
              placeholder: "## Project Architecture\nDescribe your project here...",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
        </div>
        {renderError("pitch")}
      </div>

      {generalError && (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">
          <AlertCircle className="size-5" />
          <span className="text-14-medium">{generalError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-primary text-white py-4 rounded-xl text-18-bold transition-all duration-300 hover:bg-black-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-6 animate-spin" />
            <span>Deploying to Arena...</span>
          </>
        ) : (
          <>
            <span>Submit Project</span>
            <Send className="size-6" />
          </>
        )}
      </button>
    </form>
  );
}