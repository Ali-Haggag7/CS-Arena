import { defineField, defineType } from "sanity";
import { ProjectsIcon } from "@sanity/icons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contributors",
      title: "Team Members / Contributors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      initialValue: [],
    }),
    defineField({
      name: "domain",
      title: "Project Domain",
      type: "reference",
      to: [{ type: "domain" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subDomain",
      title: "Specialization (Sub-domain)",
      type: "string",
    }),
    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      options: {
        list: ["Graduation Project", "Hackathon/Competition", "Open Source", "Personal/Learning"],
      },
      initialValue: "Personal/Learning",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: "githubLink",
      title: "Project Link (Source or Live)",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
    defineField({
      name: "upvotes",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "isLookingForContributors",
      title: "Looking for Team/Contributors?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "rolesNeeded",
      title: "Roles Needed",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.isLookingForContributors,
    }),
    defineField({
      name: "collaborationType",
      title: "Collaboration Type",
      type: "string",
      options: {
        list: ["Online", "Offline (Same University/City)", "Hybrid"],
      },
      hidden: ({ document }) => !document?.isLookingForContributors,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author.name",
    },
  },
  orderings: [
    {
      title: "Most Upvoted",
      name: "upvotesDesc",
      by: [{ field: "upvotes", direction: "desc" }],
    },
    {
      title: "Most Viewed",
      name: "viewsDesc",
      by: [{ field: "views", direction: "desc" }],
    },
    {
      title: "Latest",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
});