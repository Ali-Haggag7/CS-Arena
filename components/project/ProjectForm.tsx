"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Send, AlertCircle, Loader2, FileCode2 } from "lucide-react";
import { createProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

// Import UIW Editor and its commands to customize the toolbar
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as commands from "@uiw/react-md-editor/commands";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type FieldErrors = Record<string, string[] | undefined>;

// Clean and premium input styling
const inputClass = (hasError: boolean) =>
  `w-full p-4 rounded-xl border text-[15px] font-medium
   bg-white dark:bg-[#111115]
   text-black dark:text-white
   placeholder:text-slate-400 dark:placeholder:text-white/30
   focus:outline-none focus:ring-2 focus:ring-primary/50 
   shadow-sm dark:shadow-none
   transition-all duration-300
   ${hasError
    ? "border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-500/5"
    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
  }`;

const labelClass = "text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest block mb-2";

const FieldError = ({ errors }: { errors?: string[] }) => {
  if (!errors?.length) return null;
  return (
    <p className="text-[13px] text-red-500 mt-2 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="size-4 shrink-0" />
      {errors[0]}
    </p>
  );
};

// ─── Custom Toolbar for Markdown (Mobile Friendly) ───
// We remove full-screen, preview toggles, and heavy stuff that breaks the UI
const editorCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
];

// Re-adding the view toggle buttons (Edit, Live, Preview) without the Fullscreen button
const editorExtraCommands = [
  commands.codeEdit,
  commands.codeLive,
  commands.codePreview,
];

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
            title: "Project deployed successfully! 🚀",
            description: "Redirecting to your new project page...",
            className: "bg-emerald-500 text-white border-none",
          });
          setTimeout(() => {
            router.push(`/project/${result.data?.projectId}`);
          }, 1500);
        } else {
          if (result.validationErrors) {
            setFieldErrors(result.validationErrors);
            setGeneralError("Please fix the highlighted fields below.");
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
      className="bg-white dark:bg-[#161618] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl space-y-8 font-work-sans"
      noValidate
    >
      {/* Form Header Inside Card */}
      <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileCode2 className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            Project Details
          </h2>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
            Fill in the information below to submit your repository.
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
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
      <div>
        <label htmlFor="description" className={labelClass}>
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description" name="description" required rows={3}
          placeholder="Briefly describe what your project does and the problem it solves..."
          className={`${inputClass(!!fieldErrors.description)} resize-none`}
        />
        <FieldError errors={fieldErrors.description} />
      </div>

      {/* Tech Stack & Image (Grid) */}
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <label htmlFor="techStack" className={labelClass}>
            Tech Stack <span className="text-red-500">*</span>
          </label>
          <input
            id="techStack" name="techStack" required
            placeholder="Next.js, Tailwind, MongoDB..."
            className={inputClass(!!fieldErrors.techStack)}
          />
          <p className="text-xs text-slate-400 dark:text-white/30 mt-2 font-medium">
            Separate technologies with commas
          </p>
          <FieldError errors={fieldErrors.techStack} />
        </div>

        <div>
          <label htmlFor="image" className={labelClass}>
            Cover Image URL <span className="text-red-500">*</span>
          </label>
          <input
            id="image" name="image" type="url" required
            placeholder="https://example.com/cover-image.jpg"
            className={inputClass(!!fieldErrors.image)}
          />
          <FieldError errors={fieldErrors.image} />
        </div>
      </div>

      {/* GitHub Link */}
      <div>
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
      <div data-color-mode="dark"> {/* Using dark mode to keep the editor sleek */}
        <label className={labelClass}>
          Project Architecture & Pitch <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-slate-500 dark:text-white/40 mb-3">
          Use Markdown to describe your architecture, core features, and setup instructions.
        </p>

        {/* Wrapper to fix mobile overflow */}
        <div className={`rounded-xl overflow-hidden transition-all duration-300 w-full max-w-full ${fieldErrors.pitch
          ? "border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          : "border border-slate-200 dark:border-white/10 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
          }`}>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value ?? "")}
            preview="live" // Set to live by default so you can see the split screen
            height={400} // Increased height for better split view experience
            commands={editorCommands}
            extraCommands={editorExtraCommands} // Re-added the preview toggle buttons
            style={{ borderRadius: 0, border: "none", backgroundColor: "transparent" }}
            textareaProps={{
              placeholder: "## Project Architecture\n\nExplain how you built this...",
              "aria-label": "Project pitch editor",
            }}
            previewOptions={{
              disallowedElements: ["style", "script"],
            }}
          />
        </div>
        <FieldError errors={fieldErrors.pitch} />
      </div>

      {/* General Error Banner */}
      {generalError && (
        <div
          role="alert"
          className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 animate-in fade-in slide-in-from-bottom-2"
        >
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm font-semibold">{generalError}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-2 bg-primary text-white py-4 rounded-xl text-base font-bold transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <span>Deploying to Arena...</span>
          </>
        ) : (
          <>
            <span>Submit Project</span>
            <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}