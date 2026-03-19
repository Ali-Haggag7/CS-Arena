import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import ProjectFilters from "@/components/project/ProjectFilters";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

// ─── Dynamic Metadata for i18n ────────────────────────────────────────────
export async function generateMetadata() {
    const t = await getTranslations("explore");
    return {
        title: t("title"),
        description: t("description"),
    };
}

// ─── Data Fetching Component ──────────────────────────────────────────────

const AllProjects = async ({
    searchParams
}: {
    searchParams: { search?: string; tech?: string; sort?: string; page?: string; domain?: string; university?: string }
}) => {
    const search = searchParams.search || null;
    const tech = searchParams.tech || null;
    const sort = searchParams.sort || "newest";
    const domain = searchParams.domain || null;
    const university = searchParams.university || null;

    const t = await getTranslations("explore");

    let projects: ProjectTypeCard[] = await client.fetch(PROJECTS_QUERY, {
        search,
        tech,
        universityId: university,
        domainId: domain
    });

    if (sort === "popular") {
        projects = projects.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    } else if (sort === "views") {
        projects = projects.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    if (!projects?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 px-4 text-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[30px] shadow-sm dark:shadow-none backdrop-blur-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 md:mb-5">
                    <Sparkles className="size-8 md:size-10 text-primary/50" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">{t("no_projects")}</h3>
                <p className="text-sm md:text-base text-slate-500 dark:text-white/40 max-w-sm">
                    {t("no_projects_sub")}
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

const ExploreProjectsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const resolvedParams = await searchParams;
    const t = await getTranslations("explore");

    const universities = await client.fetch(`*[_type == "university"] | order(name asc) { _id, name }`);
    const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300 overflow-x-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 dark:bg-white/5 border border-primary/20 dark:border-white/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
                        <Sparkles className="size-3 sm:size-4" />
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-black dark:text-white tracking-tight leading-tight max-w-4xl">
                        {t("heading1")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                            {t("heading2")}
                        </span>
                    </h1>

                    <p className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-white/50 mt-3 sm:mt-6 max-w-2xl leading-relaxed px-2">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Filters Section (No Suspense needed for Client Components) */}
                <div className="mb-8 relative z-40">
                    <ProjectFilters domains={domains} universities={universities} />
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
                                </li>
                            ))}
                        </ul>
                    }
                >
                    <AllProjects searchParams={resolvedParams} />
                </Suspense>

            </div>
        </main>
    );
};

export default ExploreProjectsPage;