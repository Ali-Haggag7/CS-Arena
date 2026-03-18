import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const DOCS_PATH = path.join(process.cwd(), "content/docs");

export async function getDocBySlug(slug: string[], locale: string = "en") {
    const localizedPath = path.join(DOCS_PATH, ...slug) + `.${locale}.mdx`;
    const fallbackPathEn = path.join(DOCS_PATH, ...slug) + `.en.mdx`;
    const fallbackPathOld = path.join(DOCS_PATH, ...slug) + `.mdx`;

    let filePath = localizedPath;

    if (!fs.existsSync(filePath)) {
        if (fs.existsSync(fallbackPathEn)) {
            filePath = fallbackPathEn;
        } else if (fs.existsSync(fallbackPathOld)) {
            filePath = fallbackPathOld;
        } else {
            return null;
        }
    }

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
            const rel = path.relative(DOCS_PATH, full).replace(/\.(ar|en)?\.?mdx$/, "");
            return [rel.split(path.sep)];
        });
    };
    const allSlugs = walk(DOCS_PATH);
    const uniqueSlugs = Array.from(new Set(allSlugs.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));

    return uniqueSlugs;
}