import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import ProjectCard from "@/components/project/ProjectCard";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Projects | CS-Arena",
    description: "Discover top computer science graduation projects and startup ideas.",
};

// Component to fetch and render projects
const AllProjects = async () => {
    // We pass null for the search query to get everything
    const projects = await client.fetch(PROJECTS_QUERY, { search: null });

    return (
        <ul className="mt-7 card_grid">
            {projects?.length > 0 ? (
                projects.map((post: any) => (
                    <ProjectCard key={post?._id} post={post} />
                ))
            ) : (
                <p className="no-result">No projects found in the arena yet.</p>
            )}
        </ul>
    );
};

const ExploreProjectsPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 tracking-tight">
                        Explore <span className="text-primary">Projects</span>
                    </h1>
                    <p className="text-20-medium text-black-200 mt-4 max-w-2xl">
                        Browse through the most innovative computer science projects submitted by developers worldwide.
                    </p>
                </div>

                {/* Dynamic Content */}
                <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
                    <AllProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default ExploreProjectsPage;