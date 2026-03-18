import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { LEADERBOARD_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ThumbsUp, Eye, Medal, Flame } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("leaderboard");
    return {
        title: t("title"),
        description: t("description"),
    };
}

interface LeaderboardProject {
    _id: string;
    title: string;
    upvotes: number;
    views: number;
    techStack?: string[];
    author?: { image?: string; username?: string; _id?: string };
}

// ─── Visual Components ────────────────────────────────────────────────────

const RankBadge = ({ index }: { index: number }) => {
    if (index === 0) {
        return (
            <div className="flex items-center justify-center size-10 sm:size-12 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-600 dark:text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                <Trophy className="size-5 sm:size-6" />
            </div>
        );
    }
    if (index === 1) {
        return (
            <div className="flex items-center justify-center size-9 sm:size-10 rounded-full bg-slate-200 dark:bg-slate-400/20 border border-slate-400/50 text-slate-600 dark:text-slate-300">
                <Medal className="size-5" />
            </div>
        );
    }
    if (index === 2) {
        return (
            <div className="flex items-center justify-center size-9 sm:size-10 rounded-full bg-amber-100 dark:bg-amber-600/20 border border-amber-500/50 text-amber-700 dark:text-amber-500">
                <Medal className="size-5" />
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center size-8 sm:size-10">
            <span className="text-lg sm:text-xl font-bold text-slate-400 dark:text-white/20">
                #{index + 1}
            </span>
        </div>
    );
};

// ─── Data Fetching Component ──────────────────────────────────────────────

const RankedProjects = async () => {
    const topProjects: LeaderboardProject[] = await client.fetch(LEADERBOARD_QUERY);
    const t = await getTranslations("leaderboard");

    if (!topProjects?.length) {
        return (
            <div className="text-center py-20 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm mt-10">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Trophy className="size-10 text-slate-300 dark:text-white/20" aria-hidden="true" />
                </div>
                <p className="text-xl font-bold text-black dark:text-white">{t("empty_title")}</p>
                <p className="text-sm text-slate-500 dark:text-white/40 mt-2">{t("empty_sub")}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-10 relative z-10" role="list">
            {topProjects.map((project, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                let cardStyles = "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/10";
                if (isFirst) cardStyles = "bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-500/10 dark:to-white/5 border-yellow-400/50 shadow-[0_4px_20px_rgba(234,179,8,0.15)] scale-[1.02] sm:scale-100 sm:hover:scale-[1.02]";
                else if (isSecond) cardStyles = "bg-gradient-to-r from-slate-50 to-white dark:from-slate-400/10 dark:to-white/5 border-slate-300 dark:border-slate-500/50";
                else if (isThird) cardStyles = "bg-gradient-to-r from-amber-50 to-white dark:from-amber-600/10 dark:to-white/5 border-amber-300 dark:border-amber-600/50";

                return (
                    <Link
                        href={`/project/${project._id}`}
                        key={project._id}
                        role="listitem"
                        aria-label={`#${index + 1} - ${project.title}`}
                        className={`flex items-center gap-3 sm:gap-5 p-3 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm dark:shadow-none group ${cardStyles}`}
                    >
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center min-w-[40px] sm:min-w-[50px] shrink-0">
                            <RankBadge index={index} />
                        </div>

                        {/* Avatar */}
                        <Image
                            src={project.author?.image || "https://placehold.co/48x48"}
                            alt={project.author?.username ?? "Author"}
                            width={48} height={48}
                            className={`rounded-full object-cover shrink-0 ring-2 transition-colors duration-300 size-10 sm:size-12 ${isFirst ? "ring-yellow-400 shadow-sm" : "ring-transparent group-hover:ring-primary/30"}`}
                        />

                        {/* Project Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`text-base sm:text-lg font-bold truncate transition-colors duration-300 ${isFirst ? "text-yellow-700 dark:text-yellow-400" : "text-black dark:text-white group-hover:text-primary"}`}>
                                    {project.title}
                                </h3>
                                {project.techStack?.[0] && (
                                    <span className="hidden sm:inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70 text-[11px] font-semibold rounded-full border border-slate-200 dark:border-white/5">
                                        {project.techStack[0]}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/40 truncate mt-0.5 sm:mt-1 font-medium">
                                @{project.author?.username ?? "unknown"}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 sm:gap-8 shrink-0 pr-2 sm:pr-4">

                            {/* Upvotes */}
                            <div className="flex flex-col items-end sm:items-center">
                                <div className={`flex items-center gap-1.5 ${isFirst ? "text-yellow-600 dark:text-yellow-400" : "text-primary"}`}>
                                    <ThumbsUp className={`size-4 sm:size-5 ${isFirst ? "fill-yellow-600 dark:fill-yellow-400" : ""}`} />
                                    <span className="text-base sm:text-xl font-black">{project.upvotes ?? 0}</span>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-white/30 uppercase tracking-wider mt-0.5 font-semibold">
                                    {t("votes")}
                                </span>
                            </div>

                            {/* Vertical Divider */}
                            <div className="w-px h-8 bg-slate-200 dark:bg-white/10 hidden sm:block" />

                            {/* Views */}
                            <div className="flex flex-col items-end sm:items-center">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-white/50">
                                    <Eye className="size-4 sm:size-5" />
                                    <span className="text-sm sm:text-lg font-bold">{project.views ?? 0}</span>
                                </div>
                                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-white/30 uppercase tracking-wider mt-0.5 font-semibold hidden sm:block">
                                    {t("views")}
                                </span>
                            </div>

                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

// ─── Main Page Component ──────────────────────────────────────────────────

const LeaderboardPage = async () => {
    const t = await getTranslations("leaderboard");

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #eab308 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                {/* Hero Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm shadow-sm">
                        <Flame className="size-4" />
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-tight mb-4 sm:mb-6">
                        {t("heading1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">{t("heading2")}</span>
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed px-2">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Ranked List */}
                <Suspense fallback={
                    <div className="flex flex-col gap-4 mt-10 relative z-10">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none relative overflow-hidden h-[88px]">
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100 dark:via-white/5 to-transparent" />
                                <Skeleton className="size-10 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                                <Skeleton className="size-12 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/3 rounded-md bg-slate-200 dark:bg-white/10" />
                                    <Skeleton className="h-3 w-1/4 rounded-md bg-slate-200 dark:bg-white/10" />
                                </div>
                                <Skeleton className="h-8 w-16 rounded-md bg-slate-200 dark:bg-white/10 shrink-0" />
                            </div>
                        ))}
                    </div>
                }>
                    <RankedProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default LeaderboardPage;