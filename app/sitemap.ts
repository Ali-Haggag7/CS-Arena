import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await client.fetch(`*[_type == "project"]{ _id, _updatedAt }`);
    const authors = await client.fetch(`*[_type == "author"]{ _id, _updatedAt }`);

    const projectUrls = projects.map((project: any) => ({
        url: `https://csarena.tech/project/${project._id}`,
        lastModified: project._updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const authorUrls = authors.map((author: any) => ({
        url: `https://csarena.tech/user/${author._id}`,
        lastModified: author._updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [
        { url: "https://csarena.tech", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: "https://csarena.tech/projects", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: "https://csarena.tech/leaderboard", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
        { url: "https://csarena.tech/developers", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: "https://csarena.tech/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        ...projectUrls,
        ...authorUrls,
    ];
}