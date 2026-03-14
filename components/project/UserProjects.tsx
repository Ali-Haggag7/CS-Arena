import React from "react";
import { client } from "@/sanity/lib/client";
import { PROJECTS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import ProjectCard from "./ProjectCard";

/**
 * UserProjects Component
 * Fetches and renders a grid of projects created by a specific user.
 */
const UserProjects = async ({ id }: { id: string }) => {
  const projects = await client.fetch(PROJECTS_BY_AUTHOR_QUERY, { id });

  return (
    <>
      {projects.length > 0 ? (
        projects.map((project: any) => (
          <ProjectCard key={project._id} post={project} />
        ))
      ) : (
        <p className="no-result">No projects found for this user.</p>
      )}
    </>
  );
};

export default UserProjects;