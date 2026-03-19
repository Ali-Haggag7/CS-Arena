import { defineQuery } from "next-sanity";

// Shared fragment — add a field once, applies everywhere
const PROJECT_FIELDS = `
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio, 
    university -> { _id, name, region },
    specialization -> { _id, name }
  },
  domain -> { _id, name, slug },
  projectType,
  views,
  upvotes,
  description,
  techStack,
  isLookingForContributors,
  rolesNeeded,
  collaborationType,
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
  bio,
  university -> { _id, name, slug, region, location },
  specialization -> { _id, name, slug }
`;

// Supports search, tech stack filtering, university filtering, and domain filtering
export const PROJECTS_QUERY = defineQuery(`
  *[
    _type == "project" &&
    defined(slug.current) &&
    (!defined($search) || title match $search + "*" || author->name match $search + "*" || $search in techStack) &&
    (!defined($tech) || $tech in techStack) &&
    (!defined($universityId) || author->university._ref == $universityId) &&
    (!defined($domainId) || domain._ref == $domainId)
  ] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

export const PROJECT_BY_ID_QUERY = defineQuery(`
  *[_type == "project" && _id == $id][0]{
    ${PROJECT_FIELDS_FULL},
    author -> {
      _id, name, username, image, bio,
      university -> { _id, name, region },
      specialization -> { _id, name }
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
  *[
    _type == "project" &&
    defined(slug.current) &&
    isLookingForContributors == true &&
    (!defined($search) || title match $search + "*" || author->name match $search + "*" || $search in techStack) &&
    (!defined($tech) || $tech in techStack)
  ] | order(_createdAt desc) {
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
      _id, name, image, username,
      university -> { name },
      specialization -> { name }
    },
    domain -> { name },
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

// Changelog query
export const CHANGELOG_QUERY = `*[_type == "changelog"] | order(publishedAt desc) {
  _id,
  version,
  title,
  titleAr,
  summary,
  summaryAr,
  publishedAt,
  changes[] {
    type,
    description,
    descriptionAr
  }
}`;

// Onboarding Queries
export const UNIVERSITIES_QUERY = defineQuery(`
  *[_type == "university"] | order(name asc) { _id, name }
`);

export const DOMAINS_QUERY = defineQuery(`
  *[_type == "domain"] | order(name asc) { _id, name }
`);