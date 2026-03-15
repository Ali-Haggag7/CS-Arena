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
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: "githubLink",
      type: "url",
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (typeof url === "string" && !url.includes("github.com")) {
            return "Must be a valid GitHub repository URL";
          }
          return true;
        }),
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
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author.name",
      media: "image",
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