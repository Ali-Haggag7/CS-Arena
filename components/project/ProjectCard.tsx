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
    _createdAt, views, upvotes, author,
    title, description, image, techStack,
    githubLink, isLookingForContributors, _id,
  } = post;

  return (
    <li className="startup-card group relative">

      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.2), 0 0 30px rgba(59,130,246,0.05)" }}
      />

      {/* Header */}
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-3">
          <div className="flex gap-1 items-center text-black/30 dark:text-white/40">
            <Eye className="size-3.5" />
            <span className="text-12-medium">{views ?? 0}</span>
          </div>
          <div className="flex gap-1 items-center text-black/30 dark:text-white/40">
            <ThumbsUp className="size-3.5" />
            <span className="text-12-medium">{upvotes ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Author + Title */}
      <div className="flex-between mt-4 gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/user/${author?._id}`}
            className="text-black/50 dark:text-white/50 hover:text-primary transition-colors duration-200 text-sm font-medium"
          >
            {author?.name}
          </Link>
          <Link href={`/project/${_id}`}>
            <h3 className="text-[18px] font-bold text-black dark:text-white line-clamp-1 mt-0.5 group-hover:text-primary transition-colors duration-200">
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
            src={author?.image || "https://placehold.co/40x40"}
            alt={author?.name || "Author"}
            width={40} height={40}
            className="rounded-full ring-1 ring-black/10 dark:ring-white/10 group-hover:ring-primary/40 transition-all duration-300"
          />
        </Link>
      </div>

      {/* Description + Image */}
      <Link href={`/project/${_id}`} className="block mt-3">
        <p className="startup-card_desc">{description}</p>
        {image && (
          <div className="relative w-full h-[160px] mt-3 overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={title ?? "Project thumbnail"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 to-transparent" />
          </div>
        )}
      </Link>

      {/* Tech Stack + Badges */}
      <div className="flex-between gap-3 mt-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {(techStack?.length ?? 0) > 0 ? (
            techStack?.slice(0, 3).map((tech) => (
              <Link
                key={tech}
                href={`/?tech=${tech.toLowerCase()}`}
                className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {tech}
              </Link>
            ))
          ) : (
            <span className="text-[11px] text-black/30 dark:text-white/20">No stack</span>
          )}
          {(techStack?.length ?? 0) > 3 && (
            <span className="text-[11px] text-black/30 dark:text-white/30 px-1">
              +{(techStack?.length ?? 0) - 3}
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {isLookingForContributors && (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Users className="size-3" />
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
              <Github className="size-4 text-black/20 dark:text-white/20 hover:text-primary transition-colors duration-200" />
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-between mt-4 pt-4 border-t border-black/5 dark:border-white/5">
        {techStack?.[0] ? (
          <Link
            href={`/?tech=${techStack[0].toLowerCase()}`}
            className="text-[13px] font-medium text-black/40 dark:text-white/30 hover:text-primary transition-colors duration-200"
          >
            {techStack[0]}
          </Link>
        ) : (
          <span className="text-[13px] text-black/30 dark:text-white/20">Project</span>
        )}
        <Button className="startup-card_btn" asChild>
          <Link href={`/project/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default ProjectCard;