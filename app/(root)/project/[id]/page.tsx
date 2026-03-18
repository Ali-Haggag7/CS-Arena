import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_ID_QUERY, RELATED_PROJECTS_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/shadcn/skeleton";
import View from "@/components/shared/View";
import UpvoteButton from "@/components/project/UpvoteButton";
import GithubStats from "@/components/shared/GithubStats";
import JoinTeamButton from "@/components/shared/JoinTeamButton";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import { Calendar, Layers, Sparkles, Activity } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

const md = markdownit({ html: false, linkify: true, typographer: true });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await client
    .withConfig({ useCdn: false })
    .fetch(PROJECT_BY_ID_QUERY, { id });
  if (!post) return {};
  return {
    title: `${post.title} | CS-Arena`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

async function ProjectContent({ id }: { id: string }) {
  const [post, relatedProjects] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(PROJECT_BY_ID_QUERY, { id }),
    client.fetch(RELATED_PROJECTS_QUERY, { id, techStack: [] }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post.pitch || "");
  const t = await getTranslations("project_details");
  const locale = await getLocale();

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-48 px-4 sm:px-6 bg-white dark:bg-[#0a0a0c] border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="absolute inset-0 grid-bg opacity-20 dark:opacity-30" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-30 dark:opacity-20 blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-6 shadow-sm dark:shadow-none backdrop-blur-sm">
            <Calendar className="size-3.5 text-primary" />
            <span>{t("published", { date: formatDate(post._createdAt, locale) })}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white leading-tight tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {post.description}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        {post.image && (
          <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#111115] mb-8 group">
            <Image
              src={post.image}
              alt={post.title ?? "Project thumbnail"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/60 to-transparent pointer-events-none" />
          </div>
        )}

        <div className="bg-white dark:bg-[#111115] rounded-[1.5rem] p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-sm mb-10">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-3 sm:gap-4 items-center group"
              aria-label={`View ${post.author?.name}'s profile`}
            >
              <Image
                src={post.author?.image || "https://placehold.co/48x48"}
                alt={post.author?.name ?? "Author"}
                width={48} height={48}
                className="rounded-full ring-2 ring-slate-100 dark:ring-white/5 group-hover:ring-primary/40 transition-all duration-300 shrink-0 object-cover"
              />
              <div>
                <p className="text-base font-bold text-black dark:text-white group-hover:text-primary transition-colors duration-200">
                  {post.author?.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-white/40 font-medium mt-0.5">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            {post.isLookingForContributors && (
              <JoinTeamButton
                projectName={post.title}
                ownerEmail={post.author?.email ?? ""}
              />
            )}
          </div>

          {post.githubLink && (
            <Suspense fallback={<Skeleton className="h-20 w-full mt-5 rounded-xl bg-slate-100 dark:bg-white/5" />}>
              <div className="w-full mt-3">
                <GithubStats githubLink={post.githubLink} />
              </div>
            </Suspense>
          )}
        </div>

        {post.techStack && post.techStack.length > 0 && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 text-lg font-bold text-black dark:text-white mb-4">
              <Layers className="size-5 text-primary" />
              {t("tech_stack")}
            </h3>
            <div className="flex gap-2.5 flex-wrap">
              {post.techStack.map((tech: string) => (
                <Link
                  key={tech}
                  href={`/?tech=${tech.toLowerCase()}`}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white dark:hover:bg-primary rounded-lg text-sm font-semibold border border-slate-200 dark:border-white/5 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  {tech}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#111115] rounded-[2rem] p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-sm mb-8">
          <h3 className="flex items-center gap-2 text-xl font-bold text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
            <Sparkles className="size-5 text-primary" />
            {t("architecture")}
          </h3>

          {parsedContent ? (
            <article
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-a:text-primary hover:prose-a:text-blue-500 prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 dark:prose-img:border-white/10 prose-code:text-primary dark:prose-code:text-blue-300 prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-white/40 text-sm">
                {t("no_architecture")}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#111115] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="size-5 text-slate-400 dark:text-white/30 hidden sm:block" />
            <span className="text-sm font-semibold text-slate-500 dark:text-white/50">
              {t("engagement")}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Suspense fallback={<Skeleton className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-white/5" />}>
              <View id={id} />
            </Suspense>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
            <UpvoteButton projectId={post._id} initialUpvotes={post.upvotes ?? 0} />
          </div>
        </div>
      </div>

      {relatedProjects?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-10">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-8">
            {t("similar_projects")}
          </h3>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((project: ProjectTypeCard) => (
              <ProjectCard key={project._id} post={project} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

const ProjectDetailsSkeleton = () => (
  <div className="w-full">
    <section className="relative overflow-hidden pt-32 pb-48 px-4 sm:px-6 bg-white dark:bg-[#0a0a0c] border-b border-slate-200 dark:border-white/5">
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 rounded-full mb-6" />
        <Skeleton className="h-14 sm:h-16 md:h-20 w-3/4 mb-6 rounded-xl" />
        <Skeleton className="h-6 w-1/2 mb-2 rounded-lg" />
        <Skeleton className="h-6 w-2/3 rounded-lg" />
      </div>
    </section>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
      <Skeleton className="w-full h-[250px] sm:h-[400px] md:h-[500px] rounded-[2rem] mb-8" />
      <Skeleton className="h-28 w-full rounded-[1.5rem] mb-10" />
      <Skeleton className="h-10 w-48 mb-4 rounded-lg" />
      <div className="flex gap-2.5 flex-wrap mb-12">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-[2rem] mb-8" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  </div>
);

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0d0d0f] font-work-sans pb-24 transition-colors duration-300">
      <Suspense fallback={<ProjectDetailsSkeleton />}>
        <ProjectContent id={id} />
      </Suspense>
    </main>
  );
}