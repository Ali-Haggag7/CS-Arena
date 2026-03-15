import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_LOOKING_FOR_TEAM_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find Developers",
    description: "Connect with projects looking for open-source contributors and team members.",
};

const TeamProjects = async () => {
    const projects: ProjectTypeCard[] = await client.fetch(PROJECTS_LOOKING_FOR_TEAM_QUERY);

    if (!projects?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center p-12 glass-card rounded-2xl">
                <Users className="size-16 text-white/10 mb-4" aria-hidden="true" />
                <p className="text-[18px] font-semibold text-black dark:text-white">No projects looking for a team yet.</p>
                <p className="text-[14px] text-black/40 dark:text-white/30 mt-2">Check back later or submit your own project!</p>
            </div>
        );
    }

    return (
        <ul className="mt-7 card_grid">
            {projects.map((post) => (
                <ProjectCard key={post._id} post={post} />
            ))}
        </ul>
    );
};

const FindDevelopersPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight">
                            Find <span className="text-primary">Developers</span>
                        </h1>
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[13px] font-semibold px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Hiring Now
                        </span>
                    </div>
                    <p className="text-[17px] text-black/50 dark:text-white/40 max-w-2xl">
                        These projects are actively looking for contributors. Find a tech stack you love and join the team!
                    </p>
                </div>

                <Suspense
                    fallback={
                        <ul className="mt-7 card_grid">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-[300px] w-full rounded-2xl bg-white/5" />
                            ))}
                        </ul>
                    }
                >
                    <TeamProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default FindDevelopersPage;