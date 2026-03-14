import { defineQuery } from "next-sanity";

/**
 * Fetches all projects, optionally filtered by search query.
 * Now dynamically searches across Title, Author Name, AND Tech Stack!
 */
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && (!defined($search) || title match $search || author->name match $search || techStack match $search)] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    upvotes,
    description,
    techStack,
    isLookingForContributors,
    image,
    githubLink
  }
`);

/**
 * Fetches a single project by its unique ID.
 * Retrieves comprehensive details including the markdown pitch.
 */
export const PROJECT_BY_ID_QUERY = defineQuery(`
  *[_type == "project" && _id == $id][0]{
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, username, image, bio
    }, 
    views,
    upvotes,
    description,
    techStack,
    isLookingForContributors,
    image,
    githubLink,
    pitch
  }
`);

/**
 * Fetches only the view count for a specific project.
 * Optimized for Partial Prerendering (PPR) dynamic injection.
 */
export const PROJECT_VIEWS_QUERY = defineQuery(`
  *[_type == "project" && _id == $id][0]{
      _id, views
  }
`);

/**
 * Fetches an author based on their GitHub OAuth ID.
 * Used during the authentication flow.
 */
export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
`);

/**
 * Fetches all projects created by a specific author.
 * Used for the user profile page.
 */
export const PROJECTS_BY_AUTHOR_QUERY = defineQuery(`
  *[_type == "project" && author._ref == $id] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    upvotes,
    description,
    techStack,
    isLookingForContributors,
    image,
    githubLink
  }
`);

/**
 * Fetches a specific author by their Sanity document ID.
 * Used for rendering the user profile page.
 */
export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
`);

/**
 * Fetches projects that are actively looking for contributors.
 */
export const PROJECTS_LOOKING_FOR_TEAM_QUERY = defineQuery(`
  *[_type == "project" && isLookingForContributors == true] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    upvotes,
    description,
    techStack,
    isLookingForContributors,
    image,
    githubLink
  }
`);

/**
 * Fetches the top projects ordered by upvotes for the Leaderboard.
 */
export const LEADERBOARD_QUERY = defineQuery(`
  *[_type == "project" && defined(upvotes)] | order(upvotes desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, username
    }, 
    views,
    upvotes,
    description,
    techStack,
    githubLink
  }[0...50]
`);