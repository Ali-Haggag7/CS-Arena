import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { LEADERBOARD_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ThumbsUp, Eye, Medal } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Leaderboard",
    description: "Top ranked computer science projects based on community upvotes.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaderboardProject {
    _id: string;
    title: string;
    upvotes: number;
    views: number;
    techStack?: string[];
    author?: {
        image?: string;
        username?: string;
        _id?: string;
    };
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────

const RankBadge = ({ index }: { index: number }) => {
    if (index === 0) return <Trophy className="size-8 text-yellow-500 fill-yellow-500" aria-label="1st place" />;
    if (index === 1) return <Medal className="size-8 text-gray-400 fill-gray-400" aria-label="2nd place" />;
    if (index === 2) return <Medal className="size-8 text-amber-700 fill-amber-700" aria-label="3rd place" />;
    return <span className="text-24-black text-black/30 dark:text-white/30 w-8 text-center">#{index + 1}</span>;
};

// ─── Ranked Projects ──────────────────────────────────────────────────────────

const RankedProjects = async () => {
    const topProjects: LeaderboardProject[] = await client.fetch(LEADERBOARD_QUERY);

    if (!topProjects?.length) {
        return (
            <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10">
                <Trophy className="size-16 text-black/20 dark:text-white/20 mx-auto mb-4" aria-hidden="true" />
                <p className="text-20-medium">The arena is quiet...</p>
                <p className="text-16-medium text-black/40 dark:text-white/40 mt-2">
                    No projects have been upvoted yet. Be the first!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-10" role="list" aria-label="Leaderboard rankings">
            {topProjects.map((project, index) => {
                const isFirst = index === 0;

                return (
                    <Link
                        href={`/project/${project._id}`}
                        key={project._id}
                        role="listitem"
                        aria-label={`#${index + 1} - ${project.title}`}
                        className={`flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1
              bg-white dark:bg-white/5
              ${isFirst
                                ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                                : "border-black/5 dark:border-white/10"
                            }`}
                    >
                        {/* Rank */}
                        <div className="flex items-center justify-center min-w-[50px]">
                            <RankBadge index={index} />
                        </div>

                        {/* Avatar */}
                        <Image
                            src={project.author?.image || "https://placehold.co/48x48"}
                            alt={project.author?.username ?? "Author avatar"}
                            width={48}
                            height={48}
                            className={`rounded-full object-cover shrink-0 ${isFirst ? "ring-2 ring-yellow-500 ring-offset-2 dark:ring-offset-black" : ""
                                }`}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`text-20-medium truncate ${isFirst ? "text-yellow-600 font-bold" : "text-black dark:text-white"
                                    }`}>
                                    {project.title}
                                </h3>
                                {project.techStack?.[0] && (
                                    <span className="hidden sm:inline-block px-2 py-1 bg-primary/10 text-primary text-12-medium rounded-full whitespace-nowrap">
                                        {project.techStack[0]}
                                    </span>
                                )}
                            </div>
                            <p className="text-14-normal text-black/40 dark:text-white/40 truncate mt-1">
                                by @{project.author?.username ?? "unknown"}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1.5 text-primary">
                                    <ThumbsUp className={`size-5 ${isFirst ? "fill-primary" : ""}`} aria-hidden="true" />
                                    <span className="text-16-bold">{project.upvotes ?? 0}</span>
                                </div>
                                <span className="text-12-medium text-black/30 dark:text-white/30 uppercase tracking-wider hidden sm:block mt-1">
                                    Votes
                                </span>
                            </div>

                            <div className="w-px h-8 bg-black/10 dark:bg-white/10 hidden sm:block" />

                            <div className="hidden sm:flex flex-col items-center">
                                <div className="flex items-center gap-1.5 text-black/50 dark:text-white/50">
                                    <Eye className="size-5" aria-hidden="true" />
                                    <span className="text-16-bold">{project.views ?? 0}</span>
                                </div>
                                <span className="text-12-medium text-black/30 dark:text-white/30 uppercase tracking-wider mt-1">
                                    Views
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
    return (
        <main className="min-h-screen bg-white dark:bg-black font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
                        <Trophy className="size-10 text-yellow-600" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight mb-4">
                        Global <span className="text-primary">Leaderboard</span>
                    </h1>
                    <p className="text-20-medium text-black/50 dark:text-white/50 max-w-2xl mx-auto">
                        The most upvoted projects in CS-Arena. Does your code have what it takes to reach #1?
                    </p>
                </div>

                {/* List */}
                <Suspense
                    fallback={
                        <div className="flex flex-col gap-4 mt-10">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                            ))}
                        </div>
                    }
                >
                    <RankedProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default LeaderboardPage;