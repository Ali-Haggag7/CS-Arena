import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import TeamFilters from "@/components/project/TeamFilters";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Users, Briefcase, MapPin, ChevronRight, Sparkles, Code2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata() {
    const t = await getTranslations("find_developers");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const RecruitmentCard = ({ post, t }: { post: any; t: any }) => {
    return (
        <div className="relative group bg-white dark:bg-[#161618] rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <Image
                        src={post.author?.image || "https://placehold.co/48x48"}
                        alt={post.author?.name || "Author"}
                        width={48} height={48}
                        className="rounded-full ring-2 ring-slate-100 dark:ring-white/5 object-cover"
                    />
                    <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-white/30 uppercase tracking-wider mb-0.5">
                            {t("project_lead")}
                        </p>
                        <p className="text-sm font-bold text-black dark:text-white">
                            {post.author?.name}
                        </p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    {t("actively_hiring")}
                </div>
            </div>

            <div className="mb-6 flex-1 relative z-10">
                <Link href={`/project/${post._id}`} className="block group/link">
                    <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white mb-2 group-hover/link:text-emerald-500 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-sm text-slate-500 dark:text-white/50 line-clamp-2 leading-relaxed">
                    {post.description}
                </p>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
                {post.rolesNeeded && post.rolesNeeded.length > 0 && (
                    <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider mb-2">
                            <Briefcase className="size-3.5" /> {t("roles_needed")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {post.rolesNeeded.map((role: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 text-xs font-semibold rounded-lg border border-slate-200 dark:border-white/10">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 pt-2">
                    {post.collaborationType && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-white/60">
                            <MapPin className="size-4 text-emerald-500" />
                            <span>{post.collaborationType}</span>
                        </div>
                    )}
                    {post.techStack && post.techStack[0] && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-white/60">
                            <Code2 className="size-4 text-blue-500" />
                            <span>{post.techStack[0]}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5 relative z-10">
                <Link
                    href={`/project/${post._id}`}
                    className="flex items-center justify-between w-full px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white transition-all duration-300 group/btn"
                >
                    <span>{t("view_details")}</span>
                    <ChevronRight className="size-4 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

const TEAM_QUERY = `*[_type == "project" && isLookingForContributors == true 
    && (!defined($search) || title match $search + "*" || author->name match $search + "*" || author->username match $search + "*")
    && (!defined($domain) || domain._ref == $domain)
    && (!defined($university) || author->university._ref == $university)
    && (!defined($collaborationType) || collaborationType == $collaborationType)
    && (!defined($subdomain) || subDomain == $subdomain)
    && (!defined($tech) || $tech in techStack)
    ] | order(_createdAt desc) {
    _id, title, description, views, upvotes, rolesNeeded, collaborationType, techStack,
    author->{_id, name, username, image},
    domain->{name}
}`;

const TeamProjects = async ({
    searchParams
}: {
    searchParams: { query?: string; domain?: string; university?: string; sort?: string; page?: string; collaborationType?: string; subdomain?: string; tech?: string }
}) => {
    const search = searchParams.query || null;
    const domain = searchParams.domain || null;
    const university = searchParams.university || null;
    const collaborationType = searchParams.collaborationType || null;
    const sort = searchParams.sort || "newest";

    const subdomain = searchParams.subdomain || null;
    const tech = searchParams.tech || null;

    const t = await getTranslations("find_developers");

    let projects: any[] = await client.fetch(TEAM_QUERY, {
        search,
        domain,
        university,
        collaborationType,
        subdomain,
        tech,
    });

    if (sort === "popular") {
        projects = projects.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
    } else if (sort === "views") {
        projects = projects.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    if (!projects?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[30px] shadow-sm dark:shadow-none backdrop-blur-sm relative z-10">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />
                    <Users className="size-10 text-emerald-600 dark:text-emerald-400 relative z-10" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{t("empty_title")}</h3>
                <p className="text-base text-slate-500 dark:text-white/40 max-w-md">
                    {t("empty_sub")}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {projects.map((post) => (
                <RecruitmentCard key={post._id} post={post} t={t} />
            ))}
        </div>
    );
};

const RadarBackground = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30 dark:opacity-20" aria-hidden="true">
        <div className="absolute size-[800px] border border-emerald-500/10 rounded-full" />
        <div className="absolute size-[600px] border border-emerald-500/20 rounded-full" />
        <div className="absolute size-[400px] border border-emerald-500/30 rounded-full" />
        <div className="absolute size-[200px] border border-emerald-500/40 rounded-full bg-emerald-500/5" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/20 to-transparent origin-bottom-left animate-[spin_4s_linear_infinite] -translate-x-full -translate-y-full blur-xl" />
    </div>
);

const DevelopersSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 h-[380px] flex flex-col justify-between overflow-hidden relative shadow-sm dark:shadow-none">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100 dark:via-white/5 to-transparent" />
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                        <Skeleton className="size-12 rounded-full bg-slate-200 dark:bg-white/10" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
                            <Skeleton className="h-4 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="space-y-3 mt-6">
                    <Skeleton className="h-6 w-3/4 rounded-md bg-slate-200 dark:bg-white/10" />
                    <Skeleton className="h-4 w-full rounded-md bg-slate-200 dark:bg-white/10" />
                    <Skeleton className="h-4 w-5/6 rounded-md bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="mt-8 space-y-3">
                    <Skeleton className="h-4 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
                        <Skeleton className="h-6 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
                    </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl mt-6 bg-slate-200 dark:bg-white/10" />
            </div>
        ))}
    </div>
);

const FindDevelopersPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
    const resolvedParams = await searchParams;
    const t = await getTranslations("find_developers");

    const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);
    const universities = await client.fetch(`*[_type == "university"] | order(name asc) { _id, name }`);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-emerald-500/30 transition-colors duration-300 overflow-hidden">

            <RadarBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-6 backdrop-blur-sm shadow-sm">
                        <Sparkles className="size-4" />
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black dark:text-white tracking-tighter leading-none max-w-4xl mb-6">
                        {t("heading1")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                            {t("heading2")}
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="mb-10 relative z-20">
                    <TeamFilters domains={domains} universities={universities} />
                </div>

                <Suspense fallback={<DevelopersSkeleton />}>
                    <TeamProjects searchParams={resolvedParams} />
                </Suspense>

            </div>
        </main>
    );
};

export default FindDevelopersPage;