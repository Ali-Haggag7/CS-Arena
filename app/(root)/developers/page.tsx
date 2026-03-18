import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_LOOKING_FOR_TEAM_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import ProjectFilters from "@/components/project/ProjectFilters";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

// ─── Dynamic Metadata for i18n ────────────────────────────────────────────
export async function generateMetadata() {
    const t = await getTranslations("find_developers");
    return {
        title: t("title"),
        description: t("description"),
    };
}

// ─── Data Fetching Component ──────────────────────────────────────────────

const TeamProjects = async ({
    searchParams
}: {
    searchParams: { search?: string; tech?: string; sort?: string; page?: string }
}) => {
    const search = searchParams.search || null;
    const tech = searchParams.tech || null;
    const sort = searchParams.sort || "newest";

    const t = await getTranslations("find_developers");

    let projects: ProjectTypeCard[] = await client.fetch(PROJECTS_LOOKING_FOR_TEAM_QUERY, {
        search,
        tech,
    });

    // Sort after fetch
    if (sort === "popular") {
        projects = projects.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    } else if (sort === "views") {
        projects = projects.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    if (!projects?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 px-4 text-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] shadow-sm dark:shadow-none backdrop-blur-sm relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 md:mb-5">
                    <Users className="size-8 md:size-10 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">{t("empty_title")}</h3>
                <p className="text-sm md:text-base text-slate-500 dark:text-white/40 max-w-sm">
                    {t("empty_sub")}
                </p>
            </div>
        );
    }

    return (
        <ul className="card_grid relative z-10">
            {projects.map((post) => (
                <ProjectCard key={post._id} post={post} />
            ))}
        </ul>
    );
};

// ─── Main Page Component ──────────────────────────────────────────────────

const FindDevelopersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const resolvedParams = await searchParams;
    const t = await getTranslations("find_developers");

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-emerald-500/30 transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #10b981 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-12 md:mb-16">

                    {/* Live Hiring Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-tight max-w-4xl mb-4 sm:mb-6">
                        {t("heading1")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                            {t("heading2")}
                        </span>
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed px-2">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Filters Section (No Suspense Needed) */}
                <div className="mb-8 relative z-10">
                    <ProjectFilters />
                </div>

                {/* Content Section */}
                <Suspense
                    fallback={
                        <ul className="card_grid relative z-10">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <li key={i} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] p-5 h-[420px] flex flex-col justify-between overflow-hidden relative shadow-sm dark:shadow-none">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100 dark:via-white/5 to-transparent" />
                                    <div className="flex justify-between items-start">
                                        <Skeleton className="h-6 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <Skeleton className="size-12 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                                        <div className="space-y-2 w-full">
                                            <Skeleton className="h-6 w-3/4 rounded-md bg-slate-200 dark:bg-white/10" />
                                            <Skeleton className="h-4 w-full rounded-md bg-slate-200 dark:bg-white/10" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-[180px] w-full rounded-xl mt-5 bg-slate-200 dark:bg-white/10" />
                                    <div className="flex justify-between items-center mt-4">
                                        <Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-white/10" />
                                        <Skeleton className="h-10 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                >
                    <TeamProjects searchParams={resolvedParams} />
                </Suspense>

            </div>
        </main>
    );
};

export default FindDevelopersPage;