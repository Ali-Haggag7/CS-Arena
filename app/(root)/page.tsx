import { Suspense } from "react";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import HeroSection from "@/components/shared/HeroSection";
import ProjectsGrid from "@/components/shared/ProjectsGrid";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tech?: string }>;
}) {
  const { query, tech } = await searchParams;
  const params = { search: query || null, tech: tech || null };

  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });

  return (
    <>
      <HeroSection query={query} />

      <section className="section_container">
        <div className="flex items-center justify-between mb-7">
          <p className="text-30-semibold">
            {query
              ? `Results for "${query}"`
              : tech
                ? `Projects in ${tech}`
                : "Explore Top Projects"}
          </p>
          <p className="text-16-medium text-black/40 dark:text-white/40">
            {posts?.length ?? 0} projects
          </p>
        </div>

        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsGrid posts={posts} />
        </Suspense>
      </section>

      <SanityLive />
    </>
  );
}

const ProjectsGridSkeleton = () => (
  <ul className="mt-7 card_grid">
    {Array.from({ length: 6 }).map((_, i) => (
      <li
        key={i}
        className="w-full h-[300px] rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse"
      />
    ))}
  </ul>
);