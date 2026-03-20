import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_PATH = path.join(process.cwd(), "content/docs");

function walk(dir: string): string[] {
    return fs.readdirSync(dir).flatMap((file) => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) return walk(full);
        if (file.endsWith(".mdx")) return [full];
        return [];
    });
}

export async function GET(req: NextRequest) {
    const locale = req.nextUrl.searchParams.get("locale") || "en";
    const query = req.nextUrl.searchParams.get("q") || "";

    if (!query.trim()) return NextResponse.json([]);

    const allFiles = walk(DOCS_PATH);
    const results: { slug: string; title: string; excerpt: string }[] = [];

    for (const filePath of allFiles) {
        if (!filePath.endsWith(`.${locale}.mdx`)) continue;

        const raw = fs.readFileSync(filePath, "utf-8");
        const { content, data } = matter(raw);

        const slug = filePath
            .replace(DOCS_PATH + path.sep, "")
            .replace(`.${locale}.mdx`, "")
            .split(path.sep)
            .join("/");

        const plainText = content.replace(/[#*`>\[\]]/g, "").replace(/\n+/g, " ").trim();

        if (
            data.title?.toLowerCase().includes(query.toLowerCase()) ||
            plainText.toLowerCase().includes(query.toLowerCase())
        ) {
            const idx = plainText.toLowerCase().indexOf(query.toLowerCase());
            const excerpt = idx !== -1
                ? "..." + plainText.slice(Math.max(0, idx - 40), idx + 80) + "..."
                : plainText.slice(0, 120) + "...";

            results.push({ slug, title: data.title || slug, excerpt });
        }
    }

    return NextResponse.json(results);
}