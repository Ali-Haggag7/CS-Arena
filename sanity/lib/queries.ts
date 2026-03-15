import { defineQuery } from "next-sanity";

// Shared fragment — add a field once, applies everywhere
const PROJECT_FIELDS = `
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
`;

const PROJECT_FIELDS_FULL = `
  ${PROJECT_FIELDS},
  pitch
`;

const AUTHOR_FIELDS = `
  _id,
  id,
  name,
  username,
  email,
  image,
  bio
`;

// Supports both search and tech stack filtering
export const PROJECTS_QUERY = defineQuery(`
  *[
    _type == "project" &&
    defined(slug.current) &&
    (!defined($search) || title match $search + "*" || author->name match $search + "*" || $search in techStack) &&
    (!defined($tech) || $tech in techStack)
  ] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

export const PROJECT_BY_ID_QUERY = defineQuery(`
  *[_type == "project" && _id == $id][0]{
    ${PROJECT_FIELDS_FULL},
    author -> {
      _id, name, username, image, bio
    }
  }
`);

// Lightweight query — returns views count only, optimized for PPR
export const PROJECT_VIEWS_QUERY = defineQuery(`
  *[_type == "project" && _id == $id][0]{
    _id, views
  }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
    ${AUTHOR_FIELDS}
  }
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
    ${AUTHOR_FIELDS}
  }
`);

export const PROJECTS_BY_AUTHOR_QUERY = defineQuery(`
  *[_type == "project" && author._ref == $id] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

export const PROJECTS_LOOKING_FOR_TEAM_QUERY = defineQuery(`
  *[_type == "project" && isLookingForContributors == true] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

// Top 50 projects by upvotes
export const LEADERBOARD_QUERY = defineQuery(`
  *[_type == "project"] | order(upvotes desc) [0...50] {
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
  }
`);

// Related projects based on shared tech stack — used on project detail page
export const RELATED_PROJECTS_QUERY = defineQuery(`
  *[
    _type == "project" &&
    _id != $id &&
    count((techStack)[@ in $techStack]) > 0
  ] | order(_createdAt desc) [0...4] {
    ${PROJECT_FIELDS}
  }
`);

// Aggregated stats for the home page hero section
export const PROJECTS_STATS_QUERY = defineQuery(`
  {
    "total": count(*[_type == "project"]),
    "contributors": count(*[_type == "project" && isLookingForContributors == true]),
    "developers": count(*[_type == "author"])
  }
`);