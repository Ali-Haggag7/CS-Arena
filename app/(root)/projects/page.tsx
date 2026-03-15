import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import { Skeleton } from "@/components/shadcn/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Projects",
    description: "Discover top computer science graduation projects and startup ideas.",
};

const AllProjects = async () => {
    const projects: ProjectTypeCard[] = await client.fetch(PROJECTS_QUERY, {
        search: null,
        tech: null,
    });

    if (!projects?.length) {
        return (
            <p className="no-result col-span-full">No projects found in the arena yet.</p>
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

const ExploreProjectsPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight">
                        Explore <span className="text-primary">Projects</span>
                    </h1>
                    <p className="text-[17px] text-black/50 dark:text-white/40 mt-4 max-w-2xl">
                        Browse through the most innovative computer science projects
                        submitted by developers worldwide.
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
                    <AllProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default ExploreProjectsPage;