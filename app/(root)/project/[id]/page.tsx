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
import { Calendar, Layers, Sparkles, Activity, Briefcase, MapPin, ExternalLink, Github, ChevronUp } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";

const md = markdownit({ html: false, linkify: true, typographer: true });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await client.withConfig({ useCdn: false }).fetch(PROJECT_BY_ID_QUERY, { id });
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

const getDynamicHeading = (domainName: string, isRtl: boolean, t: any) => {
  const lower = (domainName || "").toLowerCase();

  if (lower.includes("ai") || lower.includes("machine") || lower.includes("ذكاء") || lower.includes("data")) {
    return isRtl ? "تفاصيل النموذج والبيانات" : "Model & Dataset Details";
  }
  if (lower.includes("cyber") || lower.includes("security") || lower.includes("أمن")) {
    return isRtl ? "تفاصيل الثغرة والحماية" : "Vulnerability & Mitigation Details";
  }
  if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("تصميم")) {
    return isRtl ? "رحلة المستخدم والتصميم" : "User Journey & Design Details";
  }
  return t("architecture") || (isRtl ? "معمارية وتفاصيل المشروع" : "Project Architecture & Details");
};

async function ProjectContent({ id }: { id: string }) {
  const [post, relatedProjects, session] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(PROJECT_BY_ID_QUERY, { id }),
    client.fetch(RELATED_PROJECTS_QUERY, { id, techStack: [] }),
    auth(),
  ]);

  if (!post) return notFound();

  const isLoggedIn = !!session?.id;
  const isOwner = session?.id === post.author?._id;

  let hasApplied = false;
  if (isLoggedIn) {
    const existingRequest = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "joinRequest" && project._ref == $projectId && applicant._ref == $userId][0]`,
      { projectId: post._id, userId: session.id }
    );
    hasApplied = !!existingRequest;
  }

  const parsedContent = md.render(post.pitch || "");
  const t = await getTranslations("project_details");
  const locale = await getLocale();
  const isRtl = locale === "ar";

  const isGithubLink = post.githubLink ? post.githubLink.toLowerCase().includes("github.com") : false;
  const dynamicHeading = getDynamicHeading(post.domain?.name, isRtl, t);

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

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-sm backdrop-blur-sm">
              <Calendar className="size-3.5 text-primary" />
              <span>{t("published", { date: formatDate(post._createdAt, locale) })}</span>
            </div>

            {post.domain?.name && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-sm backdrop-blur-sm">
                <Layers className="size-3.5" />
                <span>{post.domain.name}</span>
              </div>
            )}

            {post.projectType && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                <span>{post.projectType}</span>
              </div>
            )}
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

        <div className="bg-white dark:bg-[#111115] rounded-[1.5rem] p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-sm mb-10 overflow-hidden relative">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-3 sm:gap-4 items-center group"
              aria-label={`View ${post.author?.name}'s profile`}
            >
              <Image
                src={post.author?.image || "https://placehold.co/48x48"}
                alt={post.author?.name ?? "Author"}
                width={56} height={56}
                className="rounded-full ring-2 ring-slate-100 dark:ring-white/5 group-hover:ring-primary/40 transition-all duration-300 shrink-0 object-cover"
              />
              <div>
                <p className="text-lg font-bold text-black dark:text-white group-hover:text-primary transition-colors duration-200">
                  {post.author?.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-white/40 font-medium mt-0.5">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            {post.isLookingForContributors && (
              <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto bg-emerald-50 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  {t("hiring") || "Actively Recruiting Team"}
                </div>

                {(post.rolesNeeded?.length > 0 || post.collaborationType) && (
                  <div className="flex flex-col gap-1.5 w-full">
                    {post.rolesNeeded?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <Briefcase className="size-3 text-slate-400 dark:text-white/30" />
                        <span className="text-slate-500 dark:text-white/40">{isRtl ? "الأدوار:" : "Roles:"}</span>
                        {post.rolesNeeded.map((role: string, idx: number) => (
                          <span key={idx} className="bg-white dark:bg-white/10 text-slate-700 dark:text-white/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
                            {role}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.collaborationType && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="size-3 text-slate-400 dark:text-white/30" />
                        <span className="text-slate-500 dark:text-white/40">{isRtl ? "التعاون:" : "Mode:"}</span>
                        <span className="text-slate-700 dark:text-white/80 font-medium">{post.collaborationType}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-1 w-full md:w-auto">
                  {isLoggedIn ? (
                    <JoinTeamButton projectId={post._id} projectName={post.title} rolesNeeded={post.rolesNeeded} hasApplied={hasApplied} isOwner={isOwner} />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 w-full md:w-auto">
                      <button
                        type="button"
                        disabled
                        className="w-full px-6 py-2 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-200 dark:border-white/10 select-none pointer-events-none"
                      >
                        {isRtl ? "انضم للفريق" : "Join Team"}
                      </button>
                      <p className="text-[11px] text-slate-500 dark:text-white/40 font-medium select-none">
                        {isRtl ? "سجل دخول لتقديم طلب انضمام" : "Sign in to request to join"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {post.githubLink && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
              {isGithubLink ? (
                <Suspense fallback={<Skeleton className="h-20 w-full rounded-xl bg-slate-100 dark:bg-white/5" />}>
                  <GithubStats githubLink={post.githubLink} />
                </Suspense>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <ExternalLink className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black dark:text-white">{isRtl ? "رابط المشروع الخارجي" : "External Project Link"}</h4>
                      <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">{isRtl ? "استكشف المصدر أو التصميم الأصلي" : "Explore the source or design files"}</p>
                    </div>
                  </div>
                  <Link
                    href={post.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors text-center"
                  >
                    {isRtl ? "زيارة الرابط" : "Visit Link"}
                  </Link>
                </div>
              )}
            </div>
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
            {dynamicHeading}
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

            {isLoggedIn ? (
              <UpvoteButton projectId={post._id} initialUpvotes={post.upvotes ?? 0} />
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 opacity-60 cursor-not-allowed select-none"
                title={isRtl ? "سجل دخول للتصويت" : "Sign in to upvote"}
              >
                <ChevronUp className="size-5 text-slate-400 dark:text-white/40" />
                <span className="text-sm font-bold text-slate-500 dark:text-white/50">{post.upvotes ?? 0}</span>
              </div>
            )}

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
      <Skeleton className="h-40 w-full rounded-[1.5rem] mb-10" />
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