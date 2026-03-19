"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Send, AlertCircle, Loader2, FileCode2, Users, Briefcase, MapPin, ChevronDown, Check, Link as LinkIcon } from "lucide-react";
import { createProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as commands from "@uiw/react-md-editor/commands";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type FieldErrors = Record<string, string[] | undefined>;
type DropdownItem = { value: string; label: string };

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

const CustomDropdown = ({
  name,
  label,
  options,
  placeholder,
  required = true,
  hasError = false,
}: {
  name: string;
  label: string | React.ReactNode;
  options: DropdownItem[];
  placeholder: string;
  required?: boolean;
  hasError?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type="hidden" name={name} value={selected?.value || ""} required={required} />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-xl border flex items-center justify-between text-[15px] font-medium transition-all duration-300
          ${isOpen ? "border-primary ring-1 ring-primary bg-white dark:bg-[#111115]" : hasError ? "border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-500/5" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#111115] hover:border-slate-300 dark:hover:border-white/20"}
          ${selected ? "text-black dark:text-white" : "text-slate-400 dark:text-white/30"}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between
                  ${selected?.value === option.value ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"}`}
              >
                {option.label}
                {selected?.value === option.value && <Check className="size-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const editorCommands = [commands.bold, commands.italic, commands.strikethrough, commands.divider, commands.link, commands.quote, commands.code, commands.codeBlock, commands.divider, commands.unorderedListCommand, commands.orderedListCommand];
const editorExtraCommands = [commands.codeEdit, commands.codeLive, commands.codePreview];

const getDynamicPlaceholders = (domainName: string, isRtl: boolean) => {
  const lower = domainName.toLowerCase();

  if (lower.includes("ai") || lower.includes("artificial") || lower.includes("machine") || lower.includes("data") || lower.includes("ذكاء") || lower.includes("بيانات")) {
    return {
      title: isRtl ? "e.g., Sentiment Analysis Model, Smart Recommender..." : "e.g., Sentiment Analysis Model, Smart Recommender...",
      tech: isRtl ? "e.g., Python, TensorFlow, Pandas..." : "e.g., Python, TensorFlow, Pandas...",
      linkLabel: isRtl ? "Project Link (GitHub, Kaggle, Hugging Face)" : "Project Link (GitHub, Kaggle, Hugging Face)",
      linkPlaceholder: "https://kaggle.com/...",
      pitchHint: isRtl ? "Describe your Dataset, Model Architecture, Accuracy, and Training results." : "Describe your Dataset, Model Architecture, Accuracy, and Training results.",
    };
  } else if (lower.includes("cyber") || lower.includes("security") || lower.includes("أمن") || lower.includes("سيبراني")) {
    return {
      title: isRtl ? "e.g., Vulnerability Scanner, Custom Encryption Algo..." : "e.g., Vulnerability Scanner, Custom Encryption Algo...",
      tech: isRtl ? "e.g., Python, Bash, Wireshark, C++..." : "e.g., Python, Bash, Wireshark, C++...",
      linkLabel: isRtl ? "Script / Research Paper Link" : "Script / Research Paper Link",
      linkPlaceholder: "https://github.com/... or Google Drive link",
      pitchHint: isRtl ? "Describe the vulnerability, exploitation method, and mitigation steps." : "Describe the vulnerability, exploitation method, and mitigation steps.",
    };
  } else if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("تصميم")) {
    return {
      title: isRtl ? "e.g., Banking App Redesign, Full Brand Identity..." : "e.g., Banking App Redesign, Full Brand Identity...",
      tech: isRtl ? "e.g., Figma, Adobe XD, Illustrator..." : "e.g., Figma, Adobe XD, Illustrator...",
      linkLabel: isRtl ? "Design Link (Figma, Behance, Dribbble)" : "Design Link (Figma, Behance, Dribbble)",
      linkPlaceholder: "https://www.figma.com/file/...",
      pitchHint: isRtl ? "Describe the User Journey, color psychology, and the problem you solved." : "Describe the User Journey, color psychology, and the problem you solved.",
    };
  }

  return {
    title: isRtl ? "e.g., Social Media App, Task Manager..." : "e.g., Social Media App, Task Manager...",
    tech: isRtl ? "e.g., Next.js, React, Node.js, MongoDB..." : "e.g., Next.js, React, Node.js, MongoDB...",
    linkLabel: isRtl ? "Source Code (GitHub, GitLab) or Live URL" : "Source Code (GitHub, GitLab) or Live URL",
    linkPlaceholder: "https://github.com/...",
    pitchHint: isRtl ? "Use Markdown to describe your project architecture, core features, and setup instructions." : "Use Markdown to describe your project architecture, core features, and setup instructions.",
  };
};

export default function ProjectForm({
  domains,
  userDomainName = ""
}: {
  domains: { _id: string, name: string }[],
  userDomainName?: string
}) {
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLookingForTeam, setIsLookingForTeam] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("create_project");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const dynamicTexts = getDynamicPlaceholders(userDomainName, isRtl);

  const domainOptions = domains.map(d => ({ value: d._id, label: d.name }));

  const projectTypeOptions = [
    { value: "Graduation Project", label: t("type_grad") },
    { value: "Hackathon/Competition", label: t("type_hack") },
    { value: "Open Source", label: t("type_open") },
    { value: "Personal/Learning", label: t("type_personal") },
  ];

  const collabOptions = [
    { value: "Online", label: t("collab_online") },
    { value: "Offline (Same University/City)", label: t("collab_offline") },
    { value: "Hybrid", label: t("collab_hybrid") },
  ];

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setGeneralError("");
      setFieldErrors({});

      const formData = new FormData(e.currentTarget);
      formData.append("isLookingForContributors", isLookingForTeam.toString());

      try {
        const result = await createProject(formData, pitch);

        if (result.success) {
          toast({
            title: t("toast_success_title"),
            description: t("toast_success_desc"),
            className: "bg-emerald-500 text-white border-none",
          });
          setTimeout(() => {
            router.push(`/project/${result.data?.projectId}`);
          }, 1500);
        } else {
          if (result.validationErrors) {
            setFieldErrors(result.validationErrors);
            setGeneralError(t("error_general"));
            document.querySelector(".border-red-500")?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            setGeneralError(result.error ?? t("error_fallback"));
          }
        }
      } catch {
        setGeneralError(t("error_unexpected"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [pitch, isLookingForTeam, router, toast, t]
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161618] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl space-y-8 font-work-sans" noValidate>
      <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileCode2 className="size-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">{t("form_header")}</h2>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">{t("form_sub")}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <label htmlFor="title" className={labelClass}>{t("label_title")} <span className="text-red-500">*</span></label>
          <input id="title" name="title" required placeholder={dynamicTexts.title} className={inputClass(!!fieldErrors.title)} />
          <FieldError errors={fieldErrors.title} />
        </div>
        <div>
          <CustomDropdown
            name="projectType"
            label={t("label_project_type")}
            options={projectTypeOptions}
            placeholder={t("placeholder_project_type")}
            hasError={!!fieldErrors.projectType}
          />
          <FieldError errors={fieldErrors.projectType} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <CustomDropdown
            name="domainId"
            label={t("label_domain")}
            options={domainOptions}
            placeholder={t("placeholder_domain")}
            hasError={!!fieldErrors.domainId}
          />
          <FieldError errors={fieldErrors.domainId} />
        </div>
        <div>
          <label htmlFor="techStack" className={labelClass}>{t("label_tech")} <span className="text-red-500">*</span></label>
          <input id="techStack" name="techStack" required placeholder={dynamicTexts.tech} className={inputClass(!!fieldErrors.techStack)} />
          <p className="text-xs text-slate-400 dark:text-white/30 mt-2 font-medium">{t("hint_tech")}</p>
          <FieldError errors={fieldErrors.techStack} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <label htmlFor="projectLink" className={`${labelClass} flex items-center gap-2`}>
            {dynamicTexts.linkLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 rtl:right-4 rtl:left-auto" />
            <input id="projectLink" name="projectLink" type="url" required placeholder={dynamicTexts.linkPlaceholder} className={`${inputClass(!!fieldErrors.projectLink)} ltr:pl-10 rtl:pr-10`} />
          </div>
          <FieldError errors={fieldErrors.projectLink} />
        </div>
        <div>
          <label htmlFor="image" className={labelClass}>{t("label_image")} <span className="text-red-500">*</span></label>
          <input id="image" name="image" type="url" required placeholder={t("placeholder_image")} className={inputClass(!!fieldErrors.image)} />
          <FieldError errors={fieldErrors.image} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>{t("label_desc")} <span className="text-red-500">*</span></label>
        <textarea id="description" name="description" required rows={3} placeholder={t("placeholder_desc")} className={`${inputClass(!!fieldErrors.description)} resize-none`} />
        <FieldError errors={fieldErrors.description} />
      </div>

      <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg"><Users className="size-5 text-primary" /></div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">{t("team_title")}</h3>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">{t("team_subtitle")}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" aria-label="Looking for team members" className="sr-only peer" checked={isLookingForTeam} onChange={(e) => setIsLookingForTeam(e.target.checked)} />
            <div className="w-11 h-6 bg-slate-300 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {isLookingForTeam && (
          <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-primary/20 animate-in fade-in slide-in-from-top-2">
            <div>
              <label htmlFor="rolesNeeded" className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-white/60 uppercase tracking-widest mb-2">
                <Briefcase className="size-4" /> {t("label_roles")} <span className="text-red-500">*</span>
              </label>
              <input id="rolesNeeded" name="rolesNeeded" placeholder={t("placeholder_roles")} required={isLookingForTeam} className={inputClass(false)} />
              <p className="text-[11px] font-medium text-slate-500 dark:text-white/40 mt-2">{t("hint_roles")}</p>
            </div>
            <div>
              <CustomDropdown
                name="collaborationType"
                label={<span className="inline-flex items-center gap-2"><MapPin className="size-4" /> {t("label_collab")}</span>}
                options={collabOptions}
                placeholder={t("placeholder_collab")}
                required={isLookingForTeam}
              />
            </div>
          </div>
        )}
      </div>

      <div data-color-mode="dark" dir={isRtl ? "rtl" : "ltr"}>
        <label className={labelClass}>{t("label_pitch")} <span className="text-red-500">*</span></label>
        <p className="text-sm text-slate-500 dark:text-white/40 mb-3">{dynamicTexts.pitchHint}</p>

        <div className={`rounded-xl overflow-hidden transition-all duration-300 ${fieldErrors.pitch ? "border-2 border-red-500" : "border border-slate-200 dark:border-white/10 focus-within:border-primary"}`}>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value ?? "")}
            preview="live"
            height={400}
            commands={editorCommands}
            extraCommands={editorExtraCommands}
            style={{ borderRadius: 0, border: "none", direction: isRtl ? "rtl" : "ltr" }}
            textareaProps={{
              placeholder: t("placeholder_pitch"),
              "aria-label": "Project pitch editor",
              dir: isRtl ? "rtl" : "ltr",
            }}
          />
        </div>
        <FieldError errors={fieldErrors.pitch} />
      </div>

      {generalError && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 animate-in fade-in">
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm font-semibold">{generalError}</span>
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 bg-primary text-white py-4 rounded-xl text-base font-bold transition-all hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed group mt-4">
        {isSubmitting ? <><Loader2 className="size-5 animate-spin" /><span>{t("btn_submitting")}</span></> : <><Send className="size-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" /><span>{t("btn_submit")}</span></>}
      </button>
    </form>
  );
}