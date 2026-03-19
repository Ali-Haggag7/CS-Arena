import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons";

export const changelog = defineType({
    name: "changelog",
    title: "Changelog",
    type: "document",
    icon: BellIcon,
    groups: [
        { name: "en", title: "English Content" },
        { name: "ar", title: "المحتوى العربي" },
    ],
    fields: [
        defineField({
            name: "version",
            title: "Version",
            type: "string",
            description: "e.g. v1.2.0",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "title",
            title: "Title (EN)",
            type: "string",
            group: "en",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "summary",
            title: "Summary (EN)",
            type: "text",
            rows: 3,
            group: "en",
        }),

        defineField({
            name: "titleAr",
            title: "Title (AR)",
            type: "string",
            group: "ar",
        }),
        defineField({
            name: "summaryAr",
            title: "Summary (AR)",
            type: "text",
            rows: 3,
            group: "ar",
        }),

        defineField({
            name: "changes",
            title: "Changes",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "type",
                            title: "Type",
                            type: "string",
                            options: {
                                list: [
                                    { title: "🆕 New", value: "new" },
                                    { title: "✨ Improved", value: "improved" },
                                    { title: "🐛 Fixed", value: "fixed" },
                                    { title: "🗑️ Removed", value: "removed" },
                                ],
                                layout: "radio",
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: "description",
                            title: "Description (EN)",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: "descriptionAr",
                            title: "Description (AR)",
                            type: "string",
                        }),
                    ],
                    preview: {
                        select: { title: "description", subtitle: "type" },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "version",
        },
    },
    orderings: [
        {
            title: "Latest First",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
});