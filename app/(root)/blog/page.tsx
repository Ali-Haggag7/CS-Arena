import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { CHANGELOG_QUERY } from "@/sanity/lib/queries";
import { Sparkles, Zap, Bug, Trash2, Plus, Clock } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getTranslations, getLocale } from "next-intl/server";

// ─── Dynamic Metadata for i18n ────────────────────────────────────────────
export async function generateMetadata() {
    const t = await getTranslations("changelog");
    return {
        title: t("title"),
        description: t("description"),
    };
}

// ─── Types ────────────────────────────────────────────────────────────────

interface ChangeItem {
    type: "new" | "improved" | "fixed" | "removed";
    description: string;
}

interface ChangelogEntry {
    _id: string;
    version: string;
    title: string;
    summary?: string;
    publishedAt: string;
    changes?: ChangeItem[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────

const formatDate = (dateStr: string, locale: string) =>
    new Date(dateStr).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

// ─── Data Fetching Component ──────────────────────────────────────────────

const ChangelogList = async () => {
    const entries: ChangelogEntry[] = await client.fetch(CHANGELOG_QUERY);
    const t = await getTranslations("changelog");
    const locale = await getLocale();

    const changeConfig = {
        new: {
            label: t("type_new"),
            icon: <Plus className="size-3" />,
            className: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
        },
        improved: {
            label: t("type_improved"),
            icon: <Zap className="size-3" />,
            className: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
        },
        fixed: {
            label: t("type_fixed"),
            icon: <Bug className="size-3" />,
            className: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
        },
        removed: {
            label: t("type_removed"),
            icon: <Trash2 className="size-3" />,
            className: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30",
        },
    };

    if (!entries?.length) {
        return (
            <div className="text-center py-20 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Clock className="size-10 text-slate-300 dark:text-white/20" />
                </div>
                <p className="text-xl font-bold text-black dark:text-white">{t("empty_title")}</p>
                <p className="text-sm text-slate-500 dark:text-white/40 mt-2">{t("empty_sub")}</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute top-2 bottom-2 w-px bg-slate-200 dark:bg-white/10 hidden sm:block ${locale === "ar" ? "right-[11px] sm:right-[15px]" : "left-[11px] sm:left-[15px]"}`} aria-hidden="true" />

            <div className="flex flex-col gap-10 sm:gap-12">
                {entries.map((entry, index) => (
                    <div key={entry._id} className="flex gap-4 sm:gap-8 relative">

                        {/* Timeline Dot */}
                        <div className="hidden sm:flex flex-col items-center shrink-0">
                            <div className={`size-8 rounded-full border-2 flex items-center justify-center z-10 bg-white dark:bg-[#0d0d0f] transition-colors ${index === 0
                                ? "border-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                : "border-slate-300 dark:border-white/20"
                                }`}>
                                <div className={`size-2.5 rounded-full ${index === 0 ? "bg-primary" : "bg-slate-300 dark:bg-white/30"}`} />
                            </div>
                        </div>

                        {/* Card */}
                        <div className={`flex-1 bg-white dark:bg-white/5 border rounded-3xl p-5 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md dark:hover:border-white/20 ${index === 0
                            ? "border-primary/30 dark:border-primary/30"
                            : "border-slate-200 dark:border-white/10"
                            }`}>

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-5">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${index === 0
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10"
                                        }`}>
                                        {entry.version}
                                    </span>
                                    {index === 0 && (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                            </span>
                                            {t("latest")}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/30 text-xs sm:text-sm font-medium shrink-0">
                                    <Clock className="size-3.5" />
                                    <span>{formatDate(entry.publishedAt, locale)}</span>
                                </div>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2 sm:mb-3">
                                {entry.title}
                            </h2>

                            {entry.summary && (
                                <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed mb-4 sm:mb-5">
                                    {entry.summary}
                                </p>
                            )}

                            {/* Change Items */}
                            {entry.changes && entry.changes.length > 0 && (
                                <ul className="flex flex-col gap-2.5">
                                    {entry.changes.map((change, i) => {
                                        const config = changeConfig[change.type];
                                        return (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border shrink-0 mt-0.5 ${config.className}`}>
                                                    {config.icon}
                                                    {config.label}
                                                </span>
                                                <span className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">
                                                    {change.description}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Page Component ──────────────────────────────────────────────────

const ChangelogPage = async () => {
    const t = await getTranslations("changelog");

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm shadow-sm">
                        <Sparkles className="size-3 sm:size-4" />
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-tight mb-4 sm:mb-6">
                        {t("heading1")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">{t("heading2")}</span>
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-xl leading-relaxed px-2">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Changelog List */}
                <Suspense fallback={
                    <div className="flex flex-col gap-10">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-8">
                                <div className="hidden sm:flex flex-col items-center shrink-0">
                                    <Skeleton className="size-8 rounded-full bg-slate-200 dark:bg-white/10" />
                                </div>
                                <div className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-7 space-y-4 shadow-sm">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-white/10" />
                                        <Skeleton className="h-5 w-28 rounded-md bg-slate-200 dark:bg-white/10" />
                                    </div>
                                    <Skeleton className="h-7 w-2/3 rounded-md bg-slate-200 dark:bg-white/10" />
                                    <Skeleton className="h-4 w-full rounded-md bg-slate-200 dark:bg-white/10" />
                                    <div className="space-y-2.5 pt-2">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                            <div key={j} className="flex gap-3">
                                                <Skeleton className="h-5 w-16 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                                                <Skeleton className="h-5 w-full rounded-md bg-slate-200 dark:bg-white/10" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <ChangelogList />
                </Suspense>

            </div>
        </main>
    );
};

export default ChangelogPage;