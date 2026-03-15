"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp, Github, Users } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { formatDate } from "@/lib/utils";
import { Author, Project } from "@/sanity/types";

export type ProjectTypeCard = Omit<Project, "author"> & { author?: Author };

const ProjectCard = ({ post }: { post: ProjectTypeCard }) => {
  const {
    _createdAt,
    views,
    upvotes,
    author,
    title,
    description,
    image,
    techStack,
    githubLink,
    isLookingForContributors,
    _id,
  } = post;

  return (
    <li className="startup-card group">

      {/* Header: Date + Stats */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-4">
          <div className="flex gap-1.5 items-center" title="Views">
            <Eye className="size-4 text-primary" />
            <span className="text-16-medium">{views ?? 0}</span>
          </div>
          <div className="flex gap-1.5 items-center" title="Upvotes">
            <ThumbsUp className="size-4 text-primary" />
            <span className="text-16-medium">{upvotes ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Author + Title */}
      <div className="flex-between mt-5 gap-5">
        <div className="flex-1 min-w-0">
          <Link
            href={`/user/${author?._id}`}
            className="hover:text-primary transition-colors duration-200"
          >
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/project/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1 hover:text-primary transition-colors duration-200">
              {title}
            </h3>
          </Link>
        </div>

        <Link
          href={`/user/${author?._id}`}
          className="shrink-0"
          aria-label={`View ${author?.name}'s profile`}
        >
          <Image
            src={author?.image || "https://placehold.co/48x48"}
            alt={author?.name || "Author"}
            width={48}
            height={48}
            className="rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all duration-300"
          />
        </Link>
      </div>

      {/* Description + Image */}
      <Link href={`/project/${_id}`} className="block mt-3">
        <p className="startup-card_desc line-clamp-2">{description}</p>
        {image && (
          <div className="relative w-full h-[180px] mt-3 overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={title ?? "Project thumbnail"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </Link>

      {/* Tech Stack + Badges */}
      <div className="flex-between gap-3 mt-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(techStack?.length ?? 0) > 0 ? (
            techStack?.slice(0, 3).map((tech) => (
              <Link
                key={tech}
                href={`/?tech=${tech.toLowerCase()}`}
                className="text-12-medium bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-all duration-200"
              >
                {tech}
              </Link>
            ))
          ) : (
            <span className="text-12-medium text-black/40 dark:text-white/40">
              No stack listed
            </span>
          )}
          {(techStack?.length ?? 0) > 3 && (
            <span className="text-12-medium text-black/40 dark:text-white/40 px-2 py-1">
              +{(techStack?.length ?? 0) - 3} more
            </span>
          )}
        </div>

        <div className="flex gap-3 items-center">
          {isLookingForContributors && (
            <span className="flex items-center gap-1 text-12-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full border border-green-200 dark:border-green-800">
              <Users className="size-3.5" />
              Hiring
            </span>
          )}
          {githubLink && (
            <Link
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="size-5 text-black/40 dark:text-white/40 hover:text-primary transition-colors duration-200" />
            </Link>
          )}
        </div>
      </div>

      {/* Footer: Category + CTA */}
      <div className="flex-between mt-5">
        {techStack?.[0] ? (
          <Link
            href={`/?tech=${techStack[0].toLowerCase()}`}
            className="text-16-medium hover:text-primary transition-colors duration-200"
          >
            {techStack[0]}
          </Link>
        ) : (
          <span className="text-16-medium text-black/30 dark:text-white/30">
            Project
          </span>
        )}

        <Button className="startup-card_btn" asChild>
          <Link href={`/project/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default ProjectCard;