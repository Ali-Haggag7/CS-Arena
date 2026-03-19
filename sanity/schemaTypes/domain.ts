import { defineField, defineType } from "sanity";

export const domain = defineType({
    name: "domain",
    title: "Tech Domain",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Domain Name",
            type: "string",
            description: "e.g., Web Development, AI, Cybersecurity, Data Science",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
            validation: (Rule) => Rule.required(),
        }),
    ]
});