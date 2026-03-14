import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_LOOKING_FOR_TEAM_QUERY } from "@/sanity/lib/queries";
import ProjectCard from "@/components/project/ProjectCard";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find Developers | CS-Arena",
    description: "Connect with projects looking for open-source contributors and team members.",
};

const TeamProjects = async () => {
    const projects = await client.fetch(PROJECTS_LOOKING_FOR_TEAM_QUERY);

    return (
        <ul className="mt-7 card_grid">
            {projects?.length > 0 ? (
                projects.map((post: any) => (
                    <ProjectCard key={post?._id} post={post} />
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-black-100/5 rounded-2xl border border-black-100/10">
                    <Users className="size-16 text-black-200 mb-4 opacity-50" />
                    <p className="text-20-medium text-black-300">No projects are currently looking for a team.</p>
                    <p className="text-16-medium text-black-200 mt-2">Check back later or submit your own project!</p>
                </div>
            )}
        </ul>
    );
};

const FindDevelopersPage = () => {
    return (
        <main className="min-h-screen bg-white font-work-sans pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header with Badge */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black-300 tracking-tight">
                            Find <span className="text-primary">Developers</span>
                        </h1>
                        <span className="bg-green-100 text-green-700 text-14-bold px-4 py-2 rounded-full border border-green-200 flex items-center gap-2">
                            <Users className="size-4" /> Hiring Now
                        </span>
                    </div>
                    <p className="text-20-medium text-black-200 max-w-2xl">
                        These projects are actively looking for contributors. Find a tech stack you love and join the team!
                    </p>
                </div>

                {/* Dynamic Content */}
                <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
                    <TeamProjects />
                </Suspense>

            </div>
        </main>
    );
};

export default FindDevelopersPage;