import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PROJECT_BY_ID_QUERY,
  RELATED_PROJECTS_QUERY,
} from "@/sanity/lib/queries";
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

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await client.fetch(PROJECT_BY_ID_QUERY, { id });

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

// ─── Page ─────────────────────────────────────────────────────────────────────

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
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      {/* Main Content */}
      <section className="section_container">

        {/* Project Image */}
        {post.image && (
          <div className="relative w-full max-h-[600px] h-[400px] rounded-xl overflow-hidden shadow-lg mb-10">
            <Image
              src={post.image}
              alt={post.title ?? "Project thumbnail"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="space-y-10 max-w-4xl mx-auto">

          {/* Author + Join Team */}
          <div className="flex flex-col bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 transition-all hover:shadow-md">
            <div className="flex justify-between items-center gap-5 flex-wrap">

              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-4 items-center group"
                aria-label={`View ${post.author?.name}'s profile`}
              >
                <Image
                  src={post.author?.image || "https://placehold.co/64x64"}
                  alt={post.author?.name ?? "Author avatar"}
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <p className="text-20-medium group-hover:text-primary transition-colors duration-200">
                    {post.author?.name}
                  </p>
                  <p className="text-16-medium text-black/40 dark:text-white/40">
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
              <Suspense
                fallback={
                  <Skeleton className="h-20 w-full mt-5 rounded-xl" />
                }
              >
                <GithubStats githubLink={post.githubLink} />
              </Suspense>
            )}
          </div>

          {/* Tech Stack */}
          {post.techStack && post.techStack.length > 0 && (
            <div>
              <h3 className="text-30-bold mb-3">Tech Stack</h3>
              <div className="flex gap-3 flex-wrap">
                {post.techStack.map((tech: string) => (
                  <Link
                    key={tech}
                    href={`/?tech=${tech.toLowerCase()}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-md text-16-medium hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    {tech}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* Pitch / Project Details */}
          <div>
            <h3 className="text-30-bold mb-5">Project Details</h3>
            {parsedContent ? (
              <article
                className="prose dark:prose-invert max-w-4xl font-work-sans break-words"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="no-result">No details provided for this project.</p>
            )}
          </div>

          <hr className="divider" />

          {/* Upvotes + Views */}
          <div className="flex justify-between items-center">
            <UpvoteButton
              projectId={post._id}
              initialUpvotes={post.upvotes ?? 0}
            />
            <Suspense fallback={<Skeleton className="view_skeleton" />}>
              <View id={id} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects?.length > 0 && (
        <section className="section_container mt-10">
          <h3 className="text-30-bold mb-7">Related Projects</h3>
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