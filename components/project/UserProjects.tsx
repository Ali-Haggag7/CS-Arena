import React from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "./ProjectCard";

const UserProjects = async ({ id }: { id: string }) => {
  const projects: ProjectTypeCard[] = await client.fetch(
    PROJECTS_BY_AUTHOR_QUERY,
    { id }
  );

  if (!projects?.length) {
    return (
      <p className="no-result col-span-full">
        No projects submitted yet.
      </p>
    );
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project._id} post={project} />
      ))}
    </>
  );
};

export default UserProjects;