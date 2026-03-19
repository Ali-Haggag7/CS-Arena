import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ThumbsUp, Eye, Medal, Flame, Hexagon, Crown, Globe, GraduationCap, AlertCircle } from "lucide-react";
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

const GLOBAL_QUERY = `*[_type == "project"] | order(upvotes desc, views desc)[0...50] {
  _id, title, upvotes, views, techStack,
  author->{_id, username, image}
}`;

const UNI_QUERY = `*[_type == "project" && author->university._ref == $uniId] | order(upvotes desc, views desc)[0...50] {
  _id, title, upvotes, views, techStack,
  author->{_id, username, image}
}`;

const USER_UNI_QUERY = `*[_type == "author" && _id == $id][0]{ "uniId": university._ref }`;

const RankBadge = ({ index }: { index: number }) => {
    return (
        <div className="flex items-center justify-center size-10 sm:size-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 pointer-events-none" />
            <span className="text-lg sm:text-xl font-black text-slate-400 dark:text-white/40 group-hover:text-primary transition-colors">
                #{index + 1}
            </span>
        </div>
    );
};

const PodiumCard = ({ project, rank }: { project: LeaderboardProject; rank: number }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    const heightClass = isFirst ? "h-[340px] sm:h-[380px]" : isSecond ? "h-[300px] sm:h-[340px]" : "h-[280px] sm:h-[320px]";
    const marginClass = isFirst ? "z-30 scale-105 shadow-2xl shadow-yellow-500/20" : isSecond ? "z-20 sm:-mr-6 shadow-xl shadow-slate-500/10" : "z-10 sm:-ml-6 shadow-xl shadow-amber-700/10";
    const glowClass = isFirst ? "from-yellow-500/20 via-yellow-500/5 to-transparent border-yellow-500/50" : isSecond ? "from-slate-400/20 via-slate-400/5 to-transparent border-slate-400/50" : "from-amber-600/20 via-amber-600/5 to-transparent border-amber-600/50";
    const iconColor = isFirst ? "text-yellow-500" : isSecond ? "text-slate-400" : "text-amber-600";

    return (
        <Link
            href={`/project/${project._id}`}
            className={`relative flex flex-col items-center p-6 rounded-[2.5rem] bg-white dark:bg-[#161618] border transition-all duration-500 hover:-translate-y-4 group w-full sm:w-[280px] backdrop-blur-xl ${heightClass} ${marginClass} ${glowClass}`}
        >
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${glowClass} opacity-20 rounded-[2.5rem] pointer-events-none`} />

            <div className="absolute -top-6">
                <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-45 group-hover:rotate-0 transition-all duration-500 bg-white dark:bg-[#111115] border ${isFirst ? "border-yellow-500 shadow-yellow-500/30" : isSecond ? "border-slate-400 shadow-slate-400/30" : "border-amber-600 shadow-amber-600/30"}`}>
                    <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                        {isFirst ? <Crown className={`size-7 ${iconColor}`} /> : <Medal className={`size-6 ${iconColor}`} />}
                    </div>
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center text-center w-full relative z-10">
                <div className="relative mb-4">
                    <div className={`absolute inset-0 blur-md rounded-full opacity-50 ${isFirst ? "bg-yellow-500" : isSecond ? "bg-slate-400" : "bg-amber-600"}`} />
                    <Image
                        src={project.author?.image || "https://placehold.co/80x80"}
                        alt={project.author?.username ?? "Author"}
                        width={80} height={80}
                        className={`relative rounded-full object-cover ring-4 size-20 transition-transform duration-500 group-hover:scale-110 ${isFirst ? "ring-yellow-500/50" : isSecond ? "ring-slate-400/50" : "ring-amber-600/50"}`}
                    />
                </div>

                <h3 className={`text-lg font-black truncate w-full px-2 mb-1 ${isFirst ? "text-yellow-600 dark:text-yellow-400" : isSecond ? "text-slate-700 dark:text-slate-300" : "text-amber-700 dark:text-amber-500"}`}>
                    {project.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-white/40 mb-6 truncate w-full">
                    @{project.author?.username ?? "unknown"}
                </p>

                <div className="w-full grid grid-cols-2 gap-2 mt-auto">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <ThumbsUp className={`size-4 mb-1.5 ${iconColor}`} />
                        <span className="text-base font-black text-black dark:text-white leading-none">{project.upvotes ?? 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <Eye className="size-4 mb-1.5 text-slate-400" />
                        <span className="text-base font-black text-black dark:text-white leading-none">{project.views ?? 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const RankedProjects = ({ projects, emptyMessage }: { projects: LeaderboardProject[], emptyMessage?: string }) => {
    if (!projects?.length) {
        return (
            <div className="text-center py-20 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm dark:shadow-none backdrop-blur-sm mt-10 relative z-10">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Trophy className="size-10 text-slate-300 dark:text-white/20" aria-hidden="true" />
                </div>
                <p className="text-xl font-bold text-black dark:text-white">{emptyMessage || "No projects found"}</p>
            </div>
        );
    }

    const podiumProjects = projects.slice(0, 3);
    const listProjects = projects.slice(3);

    return (
        <div className="mt-16 sm:mt-24 relative z-10 w-full flex flex-col items-center" role="list">

            {podiumProjects.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-12 sm:gap-0 w-full max-w-5xl mb-16 sm:mb-24 px-4 pt-8">
                    {podiumProjects[1] && <PodiumCard project={podiumProjects[1]} rank={2} />}
                    {podiumProjects[0] && <PodiumCard project={podiumProjects[0]} rank={1} />}
                    {podiumProjects[2] && <PodiumCard project={podiumProjects[2]} rank={3} />}
                </div>
            )}

            {listProjects.length > 0 && (
                <div className="flex flex-col gap-4 w-full max-w-4xl">
                    {listProjects.map((project, index) => {
                        const globalRank = index + 3;

                        return (
                            <Link
                                href={`/project/${project._id}`}
                                key={project._id}
                                role="listitem"
                                aria-label={`#${globalRank + 1} - ${project.title}`}
                                className="relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 transition-all duration-300 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm dark:shadow-none group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex items-center justify-center shrink-0">
                                    <RankBadge index={globalRank} />
                                </div>

                                <div className="relative shrink-0">
                                    <Image
                                        src={project.author?.image || "https://placehold.co/56x56"}
                                        alt={project.author?.username ?? "Author"}
                                        width={56} height={56}
                                        className="rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 size-12 sm:size-14"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111115] rounded-full p-1 border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 sm:scale-100">
                                        <Hexagon className="size-3 text-primary fill-primary/20" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-base sm:text-xl font-bold truncate text-black dark:text-white group-hover:text-primary transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        {project.techStack?.[0] && (
                                            <span className="hidden sm:inline-flex px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 dark:border-white/5">
                                                {project.techStack[0]}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-white/40 truncate mt-1 font-medium">
                                        @{project.author?.username ?? "unknown"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-6 shrink-0 relative z-10">
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 sm:px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                                        <ThumbsUp className="size-3.5 sm:size-4 text-primary" />
                                        <span className="text-sm sm:text-lg font-black text-black dark:text-white">{project.upvotes ?? 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 sm:px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 hidden sm:flex">
                                        <Eye className="size-3.5 sm:size-4 text-slate-400" />
                                        <span className="text-sm sm:text-lg font-black text-black dark:text-white">{project.views ?? 0}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const LeaderboardSkeleton = () => (
    <div className="flex flex-col gap-4 mt-24 relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex justify-center gap-8 mb-16 h-[380px]">
            <Skeleton className="w-[280px] h-[340px] rounded-[2.5rem] mt-auto hidden md:block" />
            <Skeleton className="w-[280px] h-[380px] rounded-[2.5rem]" />
            <Skeleton className="w-[280px] h-[320px] rounded-[2.5rem] mt-auto hidden md:block" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[96px] w-full rounded-3xl" />
        ))}
    </div>
);

const LeaderboardDataFetcher = async ({ filter, t }: { filter: string, t: any }) => {
    const session = await auth();

    if (filter === "university") {
        if (!session) {
            return (
                <div className="text-center py-16 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-3xl mt-10 relative z-10">
                    <AlertCircle className="size-10 text-orange-500 mx-auto mb-4" />
                    <p className="text-lg font-bold text-black dark:text-white mb-4">{t("login_required")}</p>
                    <Link href="/api/auth/signin" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">
                        Login
                    </Link>
                </div>
            );
        }

        const userData = await client.fetch(USER_UNI_QUERY, { id: session.id });
        const uniId = userData?.uniId;

        if (!uniId) {
            return (
                <div className="text-center py-16 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-3xl mt-10 relative z-10">
                    <GraduationCap className="size-10 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-bold text-black dark:text-white mb-4">{t("no_uni_set")}</p>
                    <Link href="/dashboard?tab=settings" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition-colors">
                        {t("set_uni_btn")}
                    </Link>
                </div>
            );
        }

        const uniProjects = await client.fetch(UNI_QUERY, { uniId });
        return <RankedProjects projects={uniProjects} emptyMessage={t("no_uni_projects")} />;
    }

    const globalProjects = await client.fetch(GLOBAL_QUERY);
    return <RankedProjects projects={globalProjects} emptyMessage={t("empty_title")} />;
};

export default async function LeaderboardPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>;
}) {
    const t = await getTranslations("leaderboard");
    const resolvedParams = await searchParams;
    const filter = resolvedParams.filter || "global";

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none flex justify-center opacity-40 dark:opacity-20">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[10vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[10vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[10vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent mx-[10vw]" />
            </div>

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #eab308 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-32 relative z-10">

                <div className="text-center mb-10 sm:mb-16 relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
                        <Flame className="size-4 animate-pulse" />
                        <span>{t("badge")}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-black dark:text-white tracking-tighter leading-none mb-6">
                        {t("heading1")} <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500">
                            {t("heading2")}
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-white/40 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
                        {t("subtitle")}
                    </p>

                    <div className="inline-flex p-1.5 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm relative z-20">
                        <Link
                            href="/leaderboard?filter=global"
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${filter === "global" ? "bg-primary text-white shadow-md" : "text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}
                        >
                            <Globe className="size-4" />
                            {t("filter_global")}
                        </Link>
                        <Link
                            href="/leaderboard?filter=university"
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${filter === "university" ? "bg-primary text-white shadow-md" : "text-slate-500 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"}`}
                        >
                            <GraduationCap className="size-4" />
                            {t("filter_uni")}
                        </Link>
                    </div>
                </div>

                <Suspense fallback={<LeaderboardSkeleton />}>
                    <LeaderboardDataFetcher filter={filter} t={t} />
                </Suspense>

            </div>
        </main>
    );
}