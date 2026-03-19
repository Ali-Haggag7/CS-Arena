"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { deleteProject } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Trash2, ExternalLink, Loader2, Calendar, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

type Project = {
    _id: string;
    title: string;
    _createdAt: string;
    domain?: string;
};

export default function ManageProjects({ projects: initialProjects }: { projects: Project[] }) {
    const [localProjects, setLocalProjects] = useState<Project[]>(initialProjects);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { toast } = useToast();
    const t = useTranslations("manage_projects");
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setLocalProjects(initialProjects);
    }, [initialProjects]);

    useEffect(() => {
        if (projectToDelete) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [projectToDelete]);

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        const previousProjects = [...localProjects];

        setLocalProjects((prev) => prev.filter((p) => p._id !== projectToDelete));

        const result = await deleteProject(projectToDelete);

        if (result.success) {
            toast({
                title: t("delete_success"),
                className: "bg-emerald-500 text-white border-none",
            });
            router.refresh();
        } else {
            setLocalProjects(previousProjects);
            toast({
                title: t("delete_error"),
                description: result.error,
                variant: "destructive",
            });
        }

        setIsDeleting(false);
        setProjectToDelete(null);
    };

    const deleteModal = projectToDelete ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-work-sans">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={() => !isDeleting && setProjectToDelete(null)}
                aria-hidden="true"
            />

            <div className="relative bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    title="Close"
                    type="button"
                    onClick={() => !isDeleting && setProjectToDelete(null)}
                    className="absolute top-4 right-4 rtl:right-auto rtl:left-4 size-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="size-4" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="size-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50/50 dark:ring-red-500/5">
                        <AlertTriangle className="size-8" />
                    </div>
                    <h3 className="text-xl font-black text-black dark:text-white mb-2">
                        {t("confirm_delete_title") || "Delete Project"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-white/50 leading-relaxed mb-8">
                        {t("confirm_delete")}
                    </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full">
                    <button
                        type="button"
                        onClick={() => setProjectToDelete(null)}
                        disabled={isDeleting}
                        className="w-full sm:w-1/2 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-white/70 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        {t("cancel") || "Cancel"}
                    </button>
                    <button
                        type="button"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 shadow-md shadow-red-600/20"
                    >
                        {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Trash2 className="size-4" />
                        )}
                        {t("delete")}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    if (localProjects.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 transition-all animate-in fade-in">
                <p className="text-sm font-medium text-slate-500 dark:text-white/50">
                    No projects found.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 relative z-10">
                {localProjects.map((project) => (
                    <div
                        key={project._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-primary/40 transition-colors shadow-sm dark:shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-black dark:text-white truncate">
                                {project.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-slate-500 dark:text-white/40">
                                {project.domain && (
                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-md">
                                        {project.domain}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5" />
                                    {new Date(project._createdAt).toLocaleDateString(locale, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 border-t border-slate-100 dark:border-white/5 sm:border-none pt-4 sm:pt-0 mt-2 sm:mt-0">
                            <Link
                                href={`/project/${project._id}`}
                                className="flex items-center justify-center p-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
                                title={t("view")}
                            >
                                <ExternalLink className="size-4" />
                            </Link>

                            <Link
                                href={`/project/${project._id}/edit`}
                                className="flex items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-colors"
                                title={t("edit")}
                            >
                                <Edit3 className="size-4" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setProjectToDelete(project._id)}
                                className="flex items-center justify-center p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors"
                                title={t("delete")}
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {mounted && createPortal(deleteModal, document.body)}
        </>
    );
}