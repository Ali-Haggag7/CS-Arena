import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const DOCS_PATH = path.join(process.cwd(), "content/docs");

export async function getDocBySlug(slug: string[]) {
    const filePath = path.join(DOCS_PATH, ...slug) + ".mdx";
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(raw);
    const compiled = await compile(content, {
        outputFormat: "function-body",
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
    });
    return { compiledSource: String(compiled), frontmatter: data };
}

export function getAllDocSlugs() {
    const walk = (dir: string): string[][] => {
        return fs.readdirSync(dir).flatMap((file) => {
            const full = path.join(dir, file);
            if (fs.statSync(full).isDirectory()) return walk(full);
            if (!file.endsWith(".mdx")) return [];
            const rel = path.relative(DOCS_PATH, full).replace(/\.mdx$/, "");
            return [rel.split(path.sep)];
        });
    };
    return walk(DOCS_PATH);
}