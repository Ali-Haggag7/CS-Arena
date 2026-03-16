import { Suspense } from "react";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import HeroSection from "@/components/shared/HeroSection";
import ProjectsGrid from "@/components/shared/ProjectsGrid";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tech?: string }>;
}) {
  const { query, tech } = await searchParams;
  const params = { search: query || null, tech: tech || null };
  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });
  const locale = await getLocale();
  const t = await getTranslations("home");

  return (
    <>
      <HeroSection query={query} locale={locale} />

      <section className="section_container">
        <div className="flex items-center justify-between mb-7">
          <p className="text-[22px] font-bold text-black dark:text-white">
            {query
              ? `${t("results")} "${query}"`
              : tech
                ? `${t("projects_in")} ${tech}`
                : t("explore")}
          </p>
          <p className="text-[14px] font-medium text-black/30 dark:text-white/30">
            {posts?.length ?? 0} {t("projects_count")}
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