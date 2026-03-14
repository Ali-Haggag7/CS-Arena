import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp, Github, Users } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { formatDate } from "@/lib/utils";
import { Author, Project } from "@/sanity/types";

/**
 * Type definition for the Project Card.
 * Combines the Project schema with the expanded Author relation.
 */
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
    slug,
    _id,
  } = post;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>

        {/* Analytics Section: Views and Upvotes */}
        <div className="flex gap-4">
          <div className="flex gap-1.5 items-center">
            <Eye className="size-5 text-primary" />
            <span className="text-16-medium">{views || 0}</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <ThumbsUp className="size-5 text-primary" />
            <span className="text-16-medium">{upvotes || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/project/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <Image
            src={author?.image || "https://placehold.co/48x48"}
            alt={author?.name || "Author Avatar"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/project/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <img src={image} alt="Project Thumbnail" className="startup-card_img" />
      </Link>

      {/* CS-Arena Exclusive Features: Tech Stack & GitHub */}
      <div className="flex-between gap-3 mt-5">
        <div className="flex gap-2 flex-wrap">
          {techStack && techStack.length > 0 ? (
            techStack.map((tech, index) => (
              <span
                key={index}
                className="text-12-medium bg-primary-100 text-primary px-2 py-1 rounded-md"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-12-medium text-black-100">Tech Stack N/A</span>
          )}
        </div>

        <div className="flex gap-3 items-center">
          {isLookingForContributors && (
            <span className="flex items-center gap-1 text-12-medium bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
              <Users className="size-4" /> Team
            </span>
          )}
          {githubLink && (
            <Link href={githubLink} target="_blank" rel="noopener noreferrer">
              <Github className="size-6 text-black-200 hover:text-primary transition-colors" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex-between mt-5">
        {/* Dynamic Category based on the primary Tech Stack */}
        <Link href={`/?query=${techStack?.[0]?.toLowerCase() || ''}`}>
          <p className="text-16-medium">{techStack?.[0] || 'Project'}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/project/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default ProjectCard;