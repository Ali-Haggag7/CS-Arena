"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { createProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type FieldErrors = Record<string, string[] | undefined>;

const inputClass = (hasError: boolean) =>
  `w-full p-4 rounded-xl border bg-black/5 dark:bg-white/5 text-16-medium 
   text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30
   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
   transition-all duration-200
   ${hasError ? "border-red-500 ring-1 ring-red-500" : "border-black/10 dark:border-white/10"}`;

const FieldError = ({ errors }: { errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <p className="text-14-medium text-red-500 mt-2 flex items-center gap-1">
      <AlertCircle className="size-4 shrink-0" />
      {errors[0]}
    </p>
  );
};

export default function ProjectForm() {
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setGeneralError("");
      setFieldErrors({});

      const formData = new FormData(e.currentTarget);

      try {
        const result = await createProject(formData, pitch);

        if (result.success) {
          toast({
            title: "Project submitted successfully!",
            description: "Redirecting to your project page...",
            className: "bg-green-500 text-white border-none",
          });
          setTimeout(() => {
            router.push(`/project/${result.data?.projectId}`);
          }, 1500);
        } else {
          if (result.validationErrors) {
            setFieldErrors(result.validationErrors);
            setGeneralError("Please fix the errors below.");
            document.querySelector(".border-red-500")?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          } else {
            setGeneralError(result.error ?? "Failed to create project.");
          }
        }
      } catch {
        setGeneralError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [pitch, router, toast]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[30px] shadow-xl border border-black/5 dark:border-white/10 mt-10 space-y-8 font-work-sans"
      noValidate
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-black dark:text-white">
          Submit Your Project
        </h2>
        <p className="text-16-medium text-black/50 dark:text-white/50 mt-2">
          Share your code with the world and find collaborators.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-3">
        <label htmlFor="title" className="text-16-bold text-black dark:text-white uppercase tracking-wide">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g., Flurry Social Media App"
          className={inputClass(!!fieldErrors.title)}
          aria-describedby="title-error"
        />
        <FieldError errors={fieldErrors.title} />
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label htmlFor="description" className="text-16-bold text-black dark:text-white uppercase tracking-wide">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Briefly describe what your project does in 1-2 sentences..."
          className={`${inputClass(!!fieldErrors.description)} resize-none`}
          aria-describedby="description-error"
        />
        <FieldError errors={fieldErrors.description} />
      </div>

      {/* Tech Stack + Image */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="techStack" className="text-16-bold text-black dark:text-white uppercase tracking-wide">
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <input
            id="techStack"
            name="techStack"
            required
            placeholder="Next.js, Tailwind, MongoDB..."
            className={inputClass(!!fieldErrors.techStack)}
            aria-describedby="techStack-error"
          />
          <p className="text-12-medium text-black/30 dark:text-white/30">
            Separate with commas
          </p>
          <FieldError errors={fieldErrors.techStack} />
        </div>

        <div className="space-y-3">
          <label htmlFor="image" className="text-16-bold text-black dark:text-white uppercase tracking-wide">
            Cover Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            placeholder="https://example.com/image.jpg"
            className={inputClass(!!fieldErrors.image)}
            aria-describedby="image-error"
          />
          <FieldError errors={fieldErrors.image} />
        </div>
      </div>

      {/* GitHub Link */}
      <div className="space-y-3">
        <label htmlFor="githubLink" className="text-16-bold text-black dark:text-white uppercase tracking-wide">
          GitHub Repository <span className="text-red-500">*</span>
        </label>
        <input
          id="githubLink"
          name="githubLink"
          type="url"
          required
          placeholder="https://github.com/your-username/your-repo"
          className={inputClass(!!fieldErrors.githubLink)}
          aria-describedby="githubLink-error"
        />
        <FieldError errors={fieldErrors.githubLink} />
      </div>

      {/* Markdown Editor */}
      <div className="space-y-3" data-color-mode="light">
        <label className="text-16-bold text-black dark:text-white uppercase tracking-wide">
          Project Details <span className="text-red-500">*</span>
        </label>
        <p className="text-14-normal text-black/40 dark:text-white/40">
          Use Markdown to describe your architecture, features, and setup instructions.
        </p>
        <div
          className={`rounded-xl overflow-hidden transition-all ${fieldErrors.pitch
            ? "border-2 border-red-500"
            : "border border-black/10 dark:border-white/10"
            }`}
        >
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value ?? "")}
            preview="edit"
            height={300}
            style={{ borderRadius: 12, border: "none" }}
            textareaProps={{
              placeholder: "## Project Architecture\nDescribe your project here...",
              "aria-label": "Project pitch editor",
            }}
            previewOptions={{
              disallowedElements: ["style", "script"],
            }}
          />
        </div>
        <FieldError errors={fieldErrors.pitch} />
      </div>

      {/* General Error */}
      {generalError && (
        <div
          role="alert"
          className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-14-medium">{generalError}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-primary text-white py-4 rounded-xl text-18-bold transition-all duration-300 hover:bg-black/80 dark:hover:bg-white dark:hover:text-black hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Submit Project"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Deploying to Arena...</span>
          </>
        ) : (
          <>
            <span>Submit Project</span>
            <Send className="size-5" />
          </>
        )}
      </button>
    </form>
  );
}