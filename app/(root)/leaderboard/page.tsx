import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { LEADERBOARD_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { Trophy, ThumbsUp, Eye, Medal } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Leaderboard | CS-Arena",
    description: "Top ranked computer science projects based on community upvotes.",
};

// Component to fetch and render the ranked list
const RankedProjects = async () => {
    const topProjects = await client.fetch(LEADERBOARD_QUERY);

    if (!topProjects || topProjects.length === 0) {
        return (
            <div className="text-center py-20 bg-black-100/5 rounded-3xl border border-black-100/10">
                <Trophy className="size-16 text-black-200 mx-auto mb-4 opacity-50" />
                <p className="text-20-medium text-black-300">The arena is quiet...</p>
                <p className="text-16-medium text-black-200 mt-2">No projects have been upvoted yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-10">
            {topProjects.map((project: any, index: number) => {
                // Determine the rank badge based on position
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                let rankBadge;
                if (isFirst) rankBadge = <Trophy className="size-8 text-yellow-500 fill-yellow-500" />;
                else if (isSecond) rankBadge = <Medal className="size-8 text-gray-400 fill-gray-400" />;
                else if (isThird) rankBadge = <Medal className="size-8 text-amber-700 fill-amber-700" />;
                else rankBadge = <span className="text-24-black text-black-200 w-8 text-center">#{index + 1}</span>;

                return (
                    <Link href={`/project/${project._id}`} key={project._id}>
                        <div className={`flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white
                        ${isFirst ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-black-100/10'}
                        `}>

                            {/* Rank Position */}
                            <div className="flex items-center justify-center min-w-[50px]">
                                {rankBadge}
                            </div>

                            {/* Author Avatar */}
                            <Image
                                src={project.author?.image || "https://placehold.co/48x48"}
                                alt="author"
                                width={48}
                                height={48}
                                className={`rounded-full object-cover ${isFirst ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
                            />

                            {/* Project Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-20-medium truncate ${isFirst ? 'text-yellow-600 font-bold' : 'text-black-300'}`}>
                                        {project.title}
                                    </h3>
                                    {/* Tech Stack Badge */}
                                    {project.techStack && project.techStack[0] && (
                                        <span className="hidden sm:inline-block px-2 py-1 bg-primary/10 text-primary text-12-medium rounded-full whitespace-nowrap">
                                            {project.techStack[0]}
                                        </span>
                                    )}
                                </div>
                                <p className="text-14-normal !text-black-200 truncate mt-1">
                                    by @{project.author?.username}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <ThumbsUp className={`size-5 ${isFirst ? 'fill-primary' : ''}`} />
                                        <span className="text-16-bold">{project.upvotes || 0}</span>
                                    </div>
                                    <span className="text-12-medium text-black-100 uppercase tracking-wider hidden sm:block mt-1">Votes</span>
                                </div>

                                <div className="w-[1px] h-8 bg-black-100/20 hidden sm:block" />

                                <div className="flex flex-col items-center hidden sm:flex">
                                    <div className="flex items-center gap-1.5 text-black-200">
                                        <Eye className="size-5" />
                                        <span className="text-16-bold">{project.views || 0}</span>
                                    </div>
                                    <span className="text-12-medium text-black-100 uppercase tracking-wider mt-1">Views</span>
                                </div>
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
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-6">
                        <Trophy className="size-10 text-yellow-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 tracking-tight mb-4">
                        Global <span className="text-primary">Leaderboard</span>
                    </h1>
                    <p className="text-20-medium text-black-200 max-w-2xl mx-auto">
                        The most upvoted and celebrated projects in the CS-Arena. Does your code have what it takes to reach #1?
                    </p>
                </div>

                {/* The List */}
                <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-2xl" />}>
                    <RankedProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default LeaderboardPage;