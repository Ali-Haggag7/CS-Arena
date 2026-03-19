import { defineField, defineType } from "sanity";

export const university = defineType({
    name: "university",
    title: "University",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "University Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "governorate",
            title: "Governorate",
            type: "string",
            options: {
                list: [
                    "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea",
                    "Beheira", "Fayoum", "Gharbia", "Ismailia", "Menofia",
                    "Minya", "Qalyubia", "New Valley", "Suez", "Aswan",
                    "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia",
                    "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor",
                    "Qena", "North Sinai", "Sohag"
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        // we can group universities by region to make it easier for students to find nearby universities, and also to analyze the distribution of universities across the country
        defineField({
            name: "region",
            title: "Region (الإقليم)",
            type: "string",
            options: {
                list: [
                    "Greater Cairo",
                    "Alexandria & Matrouh",
                    "Delta",
                    "Suez Canal",
                    "North Upper Egypt",
                    "South Upper Egypt"
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        // to calculate distances between universities and students, we need their coordinates
        defineField({
            name: "location",
            title: "Location Coordinates",
            type: "geopoint",
            description: "خطوط الطول والعرض للجامعة عشان نقدر نحسب المسافات",
        }),
    ]
});