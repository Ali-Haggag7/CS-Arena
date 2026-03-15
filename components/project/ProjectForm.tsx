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
  `w-full p-4 rounded-xl border text-[15px] font-medium
   bg-gray-50 dark:bg-white/5
   text-black dark:text-white
   placeholder:text-black/30 dark:placeholder:text-white/30
   focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
   transition-all duration-200
   ${hasError
    ? "border-red-500 ring-1 ring-red-500"
    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
  }`;

const labelClass = "text-[13px] font-bold text-black/60 dark:text-white/50 uppercase tracking-widest";

const FieldError = ({ errors }: { errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1">
      <AlertCircle className="size-3.5 shrink-0" />
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
            title: "Project submitted!",
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
      className="glass-card p-8 md:p-10 rounded-2xl mt-10 space-y-7 font-work-sans"
      noValidate
    >
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-[22px] font-bold text-black dark:text-white">
          Submit Your Project
        </h2>
        <p className="text-[14px] text-black/50 dark:text-white/40 mt-1">
          Share your code with the world and find collaborators.
        </p>
      </div>

      <hr className="border-black/5 dark:border-white/5" />

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className={labelClass}>
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title" name="title" required
          placeholder="e.g., Flurry Social Media App"
          className={inputClass(!!fieldErrors.title)}
        />
        <FieldError errors={fieldErrors.title} />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className={labelClass}>
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description" name="description" required rows={3}
          placeholder="Briefly describe what your project does..."
          className={`${inputClass(!!fieldErrors.description)} resize-none`}
        />
        <FieldError errors={fieldErrors.description} />
      </div>

      {/* Tech Stack + Image */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="techStack" className={labelClass}>
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <input
            id="techStack" name="techStack" required
            placeholder="Next.js, Tailwind, MongoDB..."
            className={inputClass(!!fieldErrors.techStack)}
          />
          <p className="text-[12px] text-black/30 dark:text-white/20">
            Separate with commas
          </p>
          <FieldError errors={fieldErrors.techStack} />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className={labelClass}>
            Cover Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="image" name="image" type="url" required
            placeholder="https://example.com/image.jpg"
            className={inputClass(!!fieldErrors.image)}
          />
          <FieldError errors={fieldErrors.image} />
        </div>
      </div>

      {/* GitHub Link */}
      <div className="space-y-2">
        <label htmlFor="githubLink" className={labelClass}>
          GitHub Repository <span className="text-red-500">*</span>
        </label>
        <input
          id="githubLink" name="githubLink" type="url" required
          placeholder="https://github.com/your-username/your-repo"
          className={inputClass(!!fieldErrors.githubLink)}
        />
        <FieldError errors={fieldErrors.githubLink} />
      </div>

      {/* Markdown Editor */}
      <div className="space-y-2" data-color-mode="light">
        <label className={labelClass}>
          Project Details <span className="text-red-500">*</span>
        </label>
        <p className="text-[13px] text-black/40 dark:text-white/30">
          Use Markdown to describe your architecture, features, and setup instructions.
        </p>
        <div className={`rounded-xl overflow-hidden transition-all ${fieldErrors.pitch
          ? "border-2 border-red-500"
          : "border border-gray-200 dark:border-white/10"
          }`}>
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
          <AlertCircle className="size-4 shrink-0" />
          <span className="text-[13px] font-medium">{generalError}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 hover:bg-primary-600 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Deploying to Arena...</span>
          </>
        ) : (
          <>
            <span>Submit Project</span>
            <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}