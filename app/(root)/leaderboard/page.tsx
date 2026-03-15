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

interface LeaderboardProject {
    _id: string;
    title: string;
    upvotes: number;
    views: number;
    techStack?: string[];
    author?: { image?: string; username?: string; _id?: string };
}

const RankBadge = ({ index }: { index: number }) => {
    if (index === 0) return <Trophy className="size-7 text-yellow-500 fill-yellow-500" />;
    if (index === 1) return <Medal className="size-7 text-gray-400 fill-gray-400" />;
    if (index === 2) return <Medal className="size-7 text-amber-600 fill-amber-600" />;
    return <span className="text-[16px] font-bold text-white/20 w-7 text-center">#{index + 1}</span>;
};

const RankedProjects = async () => {
    const topProjects: LeaderboardProject[] = await client.fetch(LEADERBOARD_QUERY);

    if (!topProjects?.length) {
        return (
            <div className="text-center py-20 glass-card rounded-3xl">
                <Trophy className="size-16 text-white/10 mx-auto mb-4" aria-hidden="true" />
                <p className="text-[18px] font-semibold text-white/50">The arena is quiet...</p>
                <p className="text-[14px] text-white/30 mt-2">No projects upvoted yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 mt-10" role="list">
            {topProjects.map((project, index) => {
                const isFirst = index === 0;
                return (
                    <Link
                        href={`/project/${project._id}`}
                        key={project._id}
                        role="listitem"
                        aria-label={`#${index + 1} - ${project.title}`}
                        className={`flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 glass-card glass-hover
              ${isFirst
                                ? "border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.08)]"
                                : "border-white/[0.06]"
                            }`}
                    >
                        {/* Rank */}
                        <div className="flex items-center justify-center min-w-[44px]">
                            <RankBadge index={index} />
                        </div>

                        {/* Avatar */}
                        <Image
                            src={project.author?.image || "https://placehold.co/44x44"}
                            alt={project.author?.username ?? "Author"}
                            width={44} height={44}
                            className={`rounded-full object-cover shrink-0 ring-1 ${isFirst ? "ring-yellow-500/50" : "ring-white/10"
                                }`}
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`text-[16px] font-semibold truncate ${isFirst ? "text-yellow-400" : "text-white"
                                    }`}>
                                    {project.title}
                                </h3>
                                {project.techStack?.[0] && (
                                    <span className="hidden sm:inline-block px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-full border border-primary/20">
                                        {project.techStack[0]}
                                    </span>
                                )}
                            </div>
                            <p className="text-[13px] text-white/30 truncate mt-0.5">
                                @{project.author?.username ?? "unknown"}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 text-primary">
                                    <ThumbsUp className={`size-4 ${isFirst ? "fill-primary" : ""}`} />
                                    <span className="text-[15px] font-bold">{project.upvotes ?? 0}</span>
                                </div>
                                <span className="text-[10px] text-white/20 uppercase tracking-wider hidden sm:block mt-0.5">Votes</span>
                            </div>

                            <div className="w-px h-7 bg-white/[0.06] hidden sm:block" />

                            <div className="hidden sm:flex flex-col items-center">
                                <div className="flex items-center gap-1 text-white/30">
                                    <Eye className="size-4" />
                                    <span className="text-[15px] font-bold">{project.views ?? 0}</span>
                                </div>
                                <span className="text-[10px] text-white/20 uppercase tracking-wider mt-0.5">Views</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const LeaderboardPage = () => {
    return (
        <main className="min-h-screen bg-[#0d0d0f] font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center size-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl mb-6">
                        <Trophy className="size-8 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Global <span className="text-primary">Leaderboard</span>
                    </h1>
                    <p className="text-[17px] text-white/40 max-w-2xl mx-auto">
                        The most upvoted projects in CS-Arena. Does your code have what it takes to reach #1?
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex flex-col gap-3 mt-10">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
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