import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project", // Name of the document type in the Sanity Studio
  type: "document",
  icon: UserIcon,
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
        source: "title", // Automatically generates the slug from the title
      },
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
    // professional touch 1: GitHub repository link with validation
    defineField({
      name: "githubLink",
      type: "url",
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (typeof url === 'string' && !url.includes("github.com")) {
            return "Must be a valid GitHub repository URL";
          }
          return true;
        }),
    }),
    // professional touch 2: Tech stack as an array of strings with validation
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).max(5), // at least 1 tech, at most 5
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
    // professional touch 3: Upvotes and views with initial values and read-only in the studio
    defineField({
      name: "upvotes",
      type: "number",
      initialValue: 0,
      readOnly: true, // this field will be updated via API, not manually in the studio
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    // professional touch 4: A boolean field to indicate if the project is actively looking for contributors
    defineField({
      name: "isLookingForContributors",
      type: "boolean",
      initialValue: false,
    }),
  ],
});