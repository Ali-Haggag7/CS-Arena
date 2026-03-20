import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const joinRequest = defineType({
    name: "joinRequest",
    title: "Join Request",
    type: "document",
    icon: UserIcon,
    fields: [
        defineField({
            name: "project",
            title: "Project",
            type: "reference",
            to: [{ type: "project" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "applicant",
            title: "Applicant",
            type: "reference",
            to: [{ type: "author" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "role",
            title: "Requested Role",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "message",
            title: "Pitch / Message",
            type: "text",
            validation: (Rule) => Rule.required().min(10).max(500),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending ⏳", value: "pending" },
                    { title: "Accepted ✅", value: "accepted" },
                    { title: "Rejected ❌", value: "rejected" },
                ],
                layout: "radio",
            },
            initialValue: "pending",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            applicantName: "applicant.name",
            projectName: "project.title",
            status: "status",
            role: "role",
        },
        prepare({ applicantName, projectName, status, role }) {
            const statusEmoji = status === 'accepted' ? '✅' : status === 'rejected' ? '❌' : '⏳';
            return {
                title: `${applicantName} ➡️ ${projectName}`,
                subtitle: `${statusEmoji} ${status.toUpperCase()} | Role: ${role}`,
            };
        },
    },
});