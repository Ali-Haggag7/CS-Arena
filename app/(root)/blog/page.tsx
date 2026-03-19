import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { CHANGELOG_QUERY } from "@/sanity/lib/queries";
import { Sparkles, Zap, Bug, Trash2, Plus, Clock, Rocket } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("changelog");
    return {
        title: t("title"),
        description: t("description"),
    };
}

interface ChangeItem {
    type: "new" | "improved" | "fixed" | "removed";
    description: string;
    descriptionAr?: string;
}

interface ChangelogEntry {
    _id: string;
    version: string;
    title: string;
    titleAr?: string;
    summary?: string;
    summaryAr?: string;
    publishedAt: string;
    changes?: ChangeItem[];
}

const formatDate = (dateStr: string, locale: string) =>
    new Date(dateStr).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

const ChangelogList = async () => {
    const entries: ChangelogEntry[] = await client.fetch(CHANGELOG_QUERY);
    const t = await getTranslations("changelog");
    const locale = await getLocale();

    const changeConfig = {
        new: { label: t("type_new"), icon: <Plus className="size-3" />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        improved: { label: t("type_improved"), icon: <Zap className="size-3" />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        fixed: { label: t("type_fixed"), icon: <Bug className="size-3" />, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        removed: { label: t("type_removed"), icon: <Trash2 className="size-3" />, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    };

    if (!entries?.length) {
        return (
            <div className="text-center py-20 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-sm backdrop-blur-md relative z-10">
                <Clock className="size-12 text-slate-300 dark:text-white/10 mx-auto mb-5" />
                <p className="text-xl font-bold text-black dark:text-white">{t("empty_title")}</p>
                <p className="text-sm text-slate-500 dark:text-white/40 mt-2">{t("empty_sub")}</p>
            </div>
        );
    }

    return (
        <div className="relative pb-20">
            <div className={`absolute top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-slate-200 dark:via-white/10 to-transparent hidden sm:block ${locale === "ar" ? "right-[15px]" : "left-[15px]"}`} aria-hidden="true" />

            <div className="flex flex-col gap-16 sm:gap-24">
                {entries.map((entry, index) => {
                    const isLatest = index === 0;
                    const displayTitle = locale === "ar" ? entry.titleAr || entry.title : entry.title;
                    const displaySummary = locale === "ar" ? entry.summaryAr || entry.summary : entry.summary;

                    return (
                        <div key={entry._id} className="flex gap-8 sm:gap-12 relative group">
                            <div className="hidden sm:flex flex-col items-center shrink-0 relative">
                                <div className={`size-8 rounded-full border-4 flex items-center justify-center z-10 bg-white dark:bg-[#0a0a0c] transition-all duration-500 group-hover:scale-125 ${isLatest ? "border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]" : "border-slate-200 dark:border-white/10"}`}>
                                    <div className={`size-2 rounded-full ${isLatest ? "bg-purple-500 animate-pulse" : "bg-slate-300 dark:bg-white/20"}`} />
                                </div>
                            </div>

                            <div className={`flex-1 relative transition-all duration-500 ${isLatest ? "scale-[1.02] sm:scale-105" : ""}`}>
                                {isLatest && (
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                                )}

                                <div className={`relative bg-white dark:bg-[#111115] border rounded-[2rem] p-6 sm:p-10 shadow-xl dark:shadow-2xl transition-all duration-300 group-hover:border-purple-500/30 ${isLatest ? "border-purple-500/20" : "border-slate-200 dark:border-white/10"}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-black px-4 py-1.5 rounded-full border tracking-wider ${isLatest ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10"}`}>
                                                v{entry.version}
                                            </span>
                                            {isLatest && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in zoom-in duration-500">
                                                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                                                    {t("latest")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-white/30 text-sm font-bold bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                                            <Clock className="size-4" />
                                            <span>{formatDate(entry.publishedAt, locale)}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white mb-4 group-hover:text-purple-500 transition-colors">
                                        {displayTitle}
                                    </h2>

                                    {displaySummary && (
                                        <p className="text-base sm:text-lg text-slate-600 dark:text-white/50 leading-relaxed mb-8 font-medium">
                                            {displaySummary}
                                        </p>
                                    )}

                                    {entry.changes && entry.changes.length > 0 && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {entry.changes.map((change, i) => {
                                                const config = changeConfig[change.type];
                                                const displayDescription = locale === "ar" ? change.descriptionAr || change.description : change.description;
                                                return (
                                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-purple-500/20 transition-all group/item">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg} border ${config.border} group-hover/item:scale-110 transition-transform`}>
                                                            <div className={config.color}>{config.icon}</div>
                                                        </div>
                                                        <div className="pt-1">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${config.color} mb-1 block`}>
                                                                {config.label}
                                                            </span>
                                                            <p className="text-sm sm:text-base text-slate-700 dark:text-white/70 font-semibold leading-snug">
                                                                {displayDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ChangelogPage = async () => {
    const t = await getTranslations("changelog");

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-purple-500/30 transition-colors duration-300 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none flex justify-center opacity-40 dark:opacity-20" aria-hidden="true">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent mx-[20vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent mx-[20vw]" />
            </div>

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">
                <div className="flex flex-col items-center text-center mb-20 relative">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-bold mb-8 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform cursor-default">
                        <Rocket className="size-4 animate-bounce" />
                        <span>{t("hero_badge")}</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-black dark:text-white tracking-tighter leading-none mb-8">
                        {t("heading1")}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500">
                            {t("heading2")}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t("subtitle")}
                    </p>
                </div>

                <Suspense fallback={
                    <div className="space-y-12">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />
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