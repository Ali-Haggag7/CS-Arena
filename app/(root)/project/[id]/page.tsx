import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Github, Users, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/shadcn/skeleton";
import View from "@/components/shared/View";
import UpvoteButton from "@/components/project/UpvoteButton";
import GithubStats from "@/components/shared/GithubStats";
import JoinTeamButton from "@/components/shared/JoinTeamButton";

const md = markdownit();

export const experimental_ppr = true;

/**
 * Project Details Page
 * Displays comprehensive information about a specific CS-Arena project.
 */
const ProjectDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Fetch complete project details using the specific query
  const post = await client.fetch(PROJECT_BY_ID_QUERY, { id });

  if (!post) return notFound();

  // Parse the markdown pitch into HTML for rendering
  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      {/* Hero Section */}
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      {/* Main Content Section */}
      <section className="section_container">
        <img
          src={post.image}
          alt="Project Thumbnail"
          className="w-full h-auto rounded-xl shadow-lg mb-10 max-h-[600px] object-cover"
        />

        <div className="space-y-10 max-w-4xl mx-auto">
          {/* Project Meta Information Card */}
          <div className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-black-100 transition-all hover:shadow-md">

            <div className="flex justify-between items-center gap-5 flex-wrap">
              {/* Author Profile Link */}
              <Link
                href={`/user/${post.author?._id}`}
                className="flex gap-4 items-center group"
              >
                <Image
                  src={post.author?.image || "https://placehold.co/64x64"}
                  alt="author avatar"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <p className="text-20-medium group-hover:text-primary transition-colors">{post.author?.name}</p>
                  <p className="text-16-medium text-black-300">
                    @{post.author?.username}
                  </p>
                </div>
              </Link>

              {/* Team Recruitment Button (Interactive Email Notification) */}
              {post.isLookingForContributors && (
                <JoinTeamButton
                  projectName={post.title}
                  ownerEmail="ali.haggag2005@gmail.com" // In a real app, this would be dynamic based on the project owner's email
                />
              )}
            </div>

            {/* Suspense is used because GithubStats fetches data asynchronously */}
            {post.githubLink && (
              <Suspense fallback={<Skeleton className="h-20 w-full mt-5 rounded-xl" />}>
                <GithubStats githubLink={post.githubLink} />
              </Suspense>
            )}
          </div>

          {/* Tech Stack Display */}
          {post.techStack && post.techStack.length > 0 && (
            <div>
              <h3 className="text-30-bold mb-3">Tech Stack</h3>
              <div className="flex gap-3 flex-wrap">
                {post.techStack.map((tech: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-primary-100 text-primary rounded-md text-16-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="divider" />

          {/* Markdown Pitch Rendering */}
          <div>
            <h3 className="text-30-bold mb-5">Project Details</h3>
            {parsedContent ? (
              <article
                className="prose max-w-4xl font-work-sans break-all"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="no-result">No details provided for this project.</p>
            )}
          </div>

          <hr className="divider" />

          {/* Engagement Section: Upvotes & Views */}
          <div className="flex justify-between items-center mt-10">
            <UpvoteButton projectId={post._id} initialUpvotes={post.upvotes || 0} />

            <Suspense fallback={<Skeleton className="view_skeleton" />}>
              <View id={id} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetails;