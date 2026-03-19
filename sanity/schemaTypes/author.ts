import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      type: "string",
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "username",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "url",
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "university",
      title: "University",
      type: "reference",
      to: [{ type: "university" }],
    }),
    defineField({
      name: "specialization",
      title: "Main Specialization",
      type: "reference",
      to: [{ type: "domain" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "username",
      media: "image",
    },
  },
});