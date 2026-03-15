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
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

const ProjectDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [post, relatedProjects] = await Promise.all([
    client.fetch(PROJECT_BY_ID_QUERY, { id }),
    client.fetch(RELATED_PROJECTS_QUERY, { id, techStack: [] }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post.pitch || "");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[280px] flex flex-col items-center justify-center py-16 px-6 bg-[#0d0d0f]">
        <div className="absolute inset-0 grid-bg" aria-hidden="true" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full opacity-10 blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <span className="tag">{formatDate(post._createdAt)}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white max-w-4xl leading-tight">
            {post.title}
          </h1>
          <p className="text-[17px] text-white/50 max-w-2xl">{post.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section_container bg-[#0d0d0f]">

        {/* Project Image */}
        {post.image && (
          <div className="relative w-full max-h-[500px] h-[380px] rounded-2xl overflow-hidden mb-10 border border-white/[0.06]">
            <Image
              src={post.image}
              alt={post.title ?? "Project thumbnail"}
              fill
              className="object-cover opacity-90"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f]/60 to-transparent" />
          </div>
        )}

        <div className="space-y-8 max-w-4xl mx-auto">

          {/* Author + Join Team */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center gap-5 flex-wrap">
              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-4 items-center group"
                aria-label={`View ${post.author?.name}'s profile`}
              >
                <Image
                  src={post.author?.image || "https://placehold.co/56x56"}
                  alt={post.author?.name ?? "Author"}
                  width={56} height={56}
                  className="rounded-full ring-1 ring-white/10 group-hover:ring-primary/40 transition-all duration-300"
                />
                <div>
                  <p className="text-[17px] font-semibold text-white group-hover:text-primary transition-colors duration-200">
                    {post.author?.name}
                  </p>
                  <p className="text-[14px] text-white/30">
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
              <Suspense fallback={<Skeleton className="h-20 w-full mt-5 rounded-xl bg-white/5" />}>
                <GithubStats githubLink={post.githubLink} />
              </Suspense>
            )}
          </div>

          {/* Tech Stack */}
          {post.techStack && post.techStack.length > 0 && (
            <div>
              <h3 className="text-[20px] font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex gap-2 flex-wrap">
                {post.techStack.map((tech: string) => (
                  <Link
                    key={tech}
                    href={`/?tech=${tech.toLowerCase()}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-[14px] font-medium border border-primary/20 hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    {tech}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className="border-white/[0.06]" />

          {/* Pitch */}
          <div>
            <h3 className="text-[20px] font-bold text-white mb-5">Project Details</h3>
            {parsedContent ? (
              <article
                className="prose prose-invert max-w-4xl font-work-sans break-words"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="text-white/30 text-sm">No details provided.</p>
            )}
          </div>

          <hr className="border-white/[0.06]" />

          {/* Upvotes + Views */}
          <div className="flex justify-between items-center py-2">
            <UpvoteButton projectId={post._id} initialUpvotes={post.upvotes ?? 0} />
            <Suspense fallback={<Skeleton className="h-8 w-24 rounded-lg bg-white/5" />}>
              <View id={id} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects?.length > 0 && (
        <section className="section_container bg-[#0d0d0f] mt-4 pb-24">
          <h3 className="text-[22px] font-bold text-white mb-7">Related Projects</h3>
          <ul className="card_grid">
            {relatedProjects.map((project: ProjectTypeCard) => (
              <ProjectCard key={project._id} post={project} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default ProjectDetails;