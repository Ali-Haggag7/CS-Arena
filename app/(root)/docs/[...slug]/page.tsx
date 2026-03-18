import { notFound } from "next/navigation";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { getDocBySlug, getAllDocSlugs } from "@/lib/docs";
import { docsConfig } from "@/config/docs";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { ChevronRight, ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateStaticParams() {
    return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getLocale();
    const doc = await getDocBySlug(slug, locale);

    if (!doc) return {};

    return {
        title: `${doc.frontmatter.title} | CS-Arena Docs`,
        description: doc.frontmatter.description,
    };
}

function getPrevNext(currentSlug: string) {
    const allItems = docsConfig.sections.flatMap((s) => s.items);
    const idx = allItems.findIndex((i) => i.slug === currentSlug);
    return {
        prev: idx > 0 ? allItems[idx - 1] : null,
        next: idx < allItems.length - 1 ? allItems[idx + 1] : null,
    };
}

export default async function DocsPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;
    const locale = await getLocale();
    const doc = await getDocBySlug(slug, locale);

    if (!doc) notFound();

    const { default: DocContent } = await run(doc.compiledSource, {
        ...runtime,
        baseUrl: import.meta.url,
    }) as { default: ComponentType };

    const currentSlug = slug.join("/");
    const { prev, next } = getPrevNext(currentSlug);
    const section = docsConfig.sections.find((s) =>
        s.items.some((i) => i.slug === currentSlug)
    );

    const t = await getTranslations("docs_page");
    const tSections = await getTranslations("docs_sidebar.sections");
    const tItems = await getTranslations("docs_sidebar.items");
    const isRtl = locale === "ar";

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans transition-colors duration-300">

            {/* Top accent bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500 fixed top-[57px] sm:top-[61px] left-0 z-30" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row relative">

                <DocsSidebar currentSlug={currentSlug} />

                {/* Main content */}
                <div className="flex-1 min-w-0 border-s border-slate-200 dark:border-white/5">
                    <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-16 sm:pt-20 pb-24">

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 font-medium mb-8 flex-wrap">
                            <Link href="/docs/getting-started/introduction" className="hover:text-primary transition-colors">
                                {t("docs_breadcrumb")}
                            </Link>
                            {section && (
                                <>
                                    {isRtl ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
                                    <span>{tSections(section.titleKey)}</span>
                                </>
                            )}
                            {isRtl ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
                            <span className="text-slate-600 dark:text-white/60">{doc.frontmatter.title}</span>
                        </div>

                        {/* MDX Content */}
                        <div className="prose prose-slate dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-3
                            prose-h1:text-black prose-h1:dark:text-white
                            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-h2:text-black prose-h2:dark:text-white
                            prose-h2:border-b prose-h2:border-slate-100 prose-h2:dark:border-white/5 prose-h2:pb-2
                            prose-h3:text-lg prose-h3:mt-8 prose-h3:text-black prose-h3:dark:text-white
                            prose-p:text-slate-600 prose-p:dark:text-white/60 prose-p:leading-relaxed prose-p:text-[15px]
                            prose-a:text-primary hover:prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                            prose-code:text-primary-600 dark:prose-code:text-primary
                            prose-code:bg-primary/10 dark:prose-code:bg-primary/20
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[13px]
                            prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-[#111114] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl
                            prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:text-[13px]
                            prose-blockquote:not-italic prose-blockquote:border-s-4 prose-blockquote:border-primary
                            prose-blockquote:bg-primary/5 dark:prose-blockquote:bg-primary/10
                            prose-blockquote:rounded-e-xl prose-blockquote:py-3 prose-blockquote:px-4
                            prose-blockquote:text-slate-600 dark:prose-blockquote:text-white/60
                            prose-hr:border-slate-200 dark:prose-hr:border-white/10 prose-hr:my-8
                            prose-strong:text-black dark:prose-strong:text-white prose-strong:font-semibold
                            prose-li:text-slate-600 dark:prose-li:text-white/60 prose-li:text-[15px]
                            prose-ul:my-4 prose-ol:my-4
                            prose-table:border-collapse prose-table:w-full
                            prose-thead:border-b prose-thead:border-slate-200 dark:prose-thead:border-white/10
                            prose-th:bg-slate-50 dark:prose-th:bg-white/5
                            prose-th:text-start prose-th:text-sm prose-th:font-semibold
                            prose-th:border prose-th:border-slate-200 dark:prose-th:border-white/10 prose-th:px-4 prose-th:py-2.5
                            prose-td:border prose-td:border-slate-200 dark:prose-td:border-white/10 prose-td:px-4 prose-td:py-2.5
                            prose-td:text-[14px] prose-td:text-slate-600 dark:prose-td:text-white/60
                        ">
                            <DocContent />
                        </div>

                        {/* Prev / Next */}
                        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch justify-between gap-4">
                            {prev ? (
                                <Link
                                    href={`/docs/${prev.slug}`}
                                    className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-white dark:hover:bg-white/5 transition-all duration-200 group w-full sm:w-auto min-w-[180px]"
                                >
                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <ArrowLeft className="size-3 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
                                        {t("previous")}
                                    </span>
                                    <span className="text-sm text-black dark:text-white font-medium group-hover:text-primary transition-colors">
                                        {tItems(prev.titleKey)}
                                    </span>
                                </Link>
                            ) : <div />}

                            {next ? (
                                <Link
                                    href={`/docs/${next.slug}`}
                                    className="flex flex-col items-end p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-white dark:hover:bg-white/5 transition-all duration-200 group w-full sm:w-auto min-w-[180px] text-end"
                                >
                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        {t("next")}
                                        <ArrowRight className="size-3 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                                    </span>
                                    <span className="text-sm text-primary font-medium">{tItems(next.titleKey)}</span>
                                </Link>
                            ) : <div />}
                        </div>

                    </article>
                </div>
            </div>
        </main>
    );
}