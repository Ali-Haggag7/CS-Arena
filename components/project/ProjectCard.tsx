"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp, Github, Users, GraduationCap, Layers } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { formatDate } from "@/lib/utils";
import { Author, Project } from "@/sanity/types";
import { useTranslations, useLocale } from "next-intl";

export type ProjectTypeCard = Omit<Project, "author"> & {
  author?: Author & { university?: { name: string } };
  domain?: { _id: string; name: string };
  projectType?: string;
};

const ProjectCard = ({ post }: { post: ProjectTypeCard }) => {
  const {
    _createdAt, views, upvotes, author,
    title, description, image, techStack,
    githubLink, isLookingForContributors, _id,
    domain, projectType
  } = post;

  const t = useTranslations("project_card");
  const locale = useLocale();

  return (
    <div className="startup-card group relative">
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.2), 0 0 30px rgba(59,130,246,0.05)" }}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <p className="startup_card_date">{formatDate(_createdAt, locale)}</p>
          {projectType && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hidden sm:inline-block">
              {projectType}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 items-center text-black/50 dark:text-white/50">
            <Eye className="size-3.5" />
            <span className="text-12-medium">{views ?? 0}</span>
          </div>
          <div className="flex gap-1 items-center text-black/50 dark:text-white/50">
            <ThumbsUp className="size-3.5" />
            <span className="text-12-medium">{upvotes ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4 gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/user/${author?._id}`}
            className="text-black/60 dark:text-white/60 hover:text-primary transition-colors duration-200 text-sm font-medium line-clamp-1"
          >
            {author?.name}
          </Link>

          {author?.university?.name && (
            <div className="flex items-center gap-1 mt-0.5 text-slate-400 dark:text-slate-500">
              <GraduationCap className="size-3 shrink-0" />
              <span className="text-[11px] font-medium line-clamp-1">{author.university.name}</span>
            </div>
          )}

          <Link href={`/project/${_id}`}>
            <h3 className="text-[18px] font-bold text-black dark:text-white line-clamp-1 mt-1 group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
          </Link>
        </div>

        <Link
          href={`/user/${author?._id}`}
          className="shrink-0 pt-1"
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

      <div className="flex justify-between items-center gap-3 mt-4 flex-wrap">
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
            <span className="text-[11px] text-black/30 dark:text-white/20">{t("no_stack")}</span>
          )}
          {(techStack?.length ?? 0) > 3 && (
            <span className="text-[11px] text-black/30 dark:text-white/30 px-1">
              +{(techStack?.length ?? 0) - 3}
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {isLookingForContributors && (
            <span className="relative flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Users className="size-3" />
              {t("hiring")}
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

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5 dark:border-white/5">
        {domain?.name ? (
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-black/60 dark:text-white/60">
            <Layers className="size-4 text-primary" />
            {domain.name}
          </span>
        ) : techStack?.[0] ? (
          <Link
            href={`/?tech=${techStack[0].toLowerCase()}`}
            className="text-[13px] font-medium text-black/40 dark:text-white/30 hover:text-primary transition-colors duration-200"
          >
            {techStack[0]}
          </Link>
        ) : (
          <span className="text-[13px] text-black/30 dark:text-white/20">{t("project")}</span>
        )}
        <Button className="startup-card_btn" asChild>
          <Link href={`/project/${_id}`}>{t("details")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;