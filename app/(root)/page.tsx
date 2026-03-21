import { Suspense } from "react";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import HeroSection from "@/components/shared/HeroSection";
import ProjectsGrid from "@/components/shared/ProjectsGrid";
import { getLocale, getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/shadcn/skeleton";

async function ProjectsFetcher({ params, query, tech, t }: any) {
  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });

  return (
    <>
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

      <ProjectsGrid posts={posts} />
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; tech?: string; university?: string; domain?: string }>;
}) {
  const { query, tech, university, domain } = await searchParams;

  const params = {
    search: query || null,
    tech: tech || null,
    universityId: university || null,
    domainId: domain || null
  };

  const locale = await getLocale();
  const t = await getTranslations("home");

  const universities = await client.fetch(`*[_type == "university"] | order(name asc) { _id, name }`);
  const domains = await client.fetch(`*[_type == "domain"] | order(name asc) { _id, name }`);

  return (
    <>
      <HeroSection query={query} locale={locale} universities={universities} domains={domains} />

      <section className="section_container overflow-x-hidden w-full max-w-full">
        <Suspense fallback={<ProjectsGridSkeleton />}>
          <ProjectsFetcher params={params} query={query} tech={tech} t={t} />
        </Suspense>
      </section>

      <SanityLive />
    </>
  );
}

const ProjectsGridSkeleton = () => (
  <>
    <div className="flex items-center justify-between mb-7">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-24" />
    </div>
    <ul className="card_grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex flex-col rounded-2xl bg-white dark:bg-[#111115] border border-gray-200 dark:border-white/10 p-5 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>

          {/* Title & Description */}
          <Skeleton className="h-6 w-3/4 rounded-md mb-3" />
          <Skeleton className="h-4 w-full rounded-md mb-2" />
          <Skeleton className="h-4 w-5/6 rounded-md mb-5" />

          {/* Image Placeholder */}
          <Skeleton className="h-[160px] w-full rounded-xl mb-5" />

          {/* Footer Tags */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  </>
);