import { notFound } from "next/navigation";
import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { getDocBySlug, getAllDocSlugs } from "@/lib/docs";
import { docsConfig } from "@/config/docs";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { ChevronRight, ArrowLeft, ArrowRight, ChevronLeft, Github, ThumbsUp, ThumbsDown, Edit3, Book } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateStaticParams() {
    return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
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

export default async function DocsPage({ params }: { params: Promise<{ slug: string[] }> }) {
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
    const section = docsConfig.sections.find((s) => s.items.some((i) => i.slug === currentSlug));

    const t = await getTranslations("docs_page");
    const tSections = await getTranslations("docs_sidebar.sections");
    const tItems = await getTranslations("docs_sidebar.items");
    const isRtl = locale === "ar";

    return (
        <main className="min-h-screen bg-white dark:bg-[#0a0a0c] font-work-sans transition-colors duration-300 relative selection:bg-primary/30">

            {/* Blueprint Topography Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                aria-hidden="true" />

            {/* Cyberpunk Top Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-primary to-cyan-400 fixed top-[57px] sm:top-[61px] left-0 z-30 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

            <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row relative">

                <DocsSidebar currentSlug={currentSlug} />

                <div className="flex-1 min-w-0 pb-24 relative z-10">
                    <article className="max-w-4xl mx-auto px-6 lg:px-16 pt-16 sm:pt-24">

                        {/* Breadcrumb Path */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-white/30 mb-10 flex-wrap">
                            <Link href="/docs/getting-started/introduction" className="hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary/10">
                                <Book className="size-3" />
                                {t("docs_breadcrumb")}
                            </Link>
                            {section && (
                                <>
                                    {isRtl ? <ChevronLeft className="size-3 opacity-50" /> : <ChevronRight className="size-3 opacity-50" />}
                                    <span className="px-2 py-1 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                        {tSections(section.titleKey)}
                                    </span>
                                </>
                            )}
                            {isRtl ? <ChevronLeft className="size-3 opacity-50" /> : <ChevronRight className="size-3 opacity-50" />}
                            <span className="text-primary">{doc.frontmatter.title}</span>
                        </div>

                        {/* Extreme MDX Styling */}
                        <div className="prose prose-slate dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:sm:text-5xl prose-h1:mb-6 prose-h1:text-black prose-h1:dark:text-white
              
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-16 prose-h2:mb-6
              prose-h2:text-black prose-h2:dark:text-white prose-h2:border-b prose-h2:border-slate-200 prose-h2:dark:border-white/10 prose-h2:pb-4
              
              prose-h3:text-xl prose-h3:mt-10 prose-h3:text-slate-800 prose-h3:dark:text-white/90
              prose-p:text-slate-600 prose-p:dark:text-white/60 prose-p:leading-loose prose-p:text-[16px] prose-p:font-medium
              
              prose-a:text-primary hover:prose-a:text-cyan-400 prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-cyan-400 transition-colors
              
              prose-code:text-rose-500 dark:prose-code:text-cyan-400 prose-code:font-bold
              prose-code:bg-slate-100 dark:prose-code:bg-cyan-400/10
              prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[14px]
              prose-code:before:content-none prose-code:after:content-none
              
              prose-pre:bg-[#0d0d12] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
              prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:text-[14px] prose-pre:shadow-2xl prose-pre:shadow-black/50
              
              prose-blockquote:not-italic prose-blockquote:border-s-4 prose-blockquote:border-blue-500
              prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-500/10
              prose-blockquote:rounded-r-2xl prose-blockquote:py-4 prose-blockquote:px-6
              prose-blockquote:text-slate-700 dark:prose-blockquote:text-blue-200 prose-blockquote:font-semibold
              
              prose-hr:border-slate-200 dark:prose-hr:border-white/10 prose-hr:my-12
              prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
              prose-li:text-slate-600 dark:prose-li:text-white/70 prose-li:text-[16px] prose-li:font-medium
              prose-ul:my-6 prose-ol:my-6
              
              prose-table:border-collapse prose-table:w-full prose-table:rounded-2xl prose-table:overflow-hidden prose-table:border prose-table:border-slate-200 dark:prose-table:border-white/10
              prose-thead:bg-slate-50 dark:prose-thead:bg-white/5 prose-thead:border-b prose-thead:border-slate-200 dark:prose-thead:border-white/10
              prose-th:text-start prose-th:text-sm prose-th:font-bold prose-th:text-slate-800 dark:prose-th:text-white prose-th:px-6 prose-th:py-4
              prose-td:border-t prose-td:border-slate-200 dark:prose-td:border-white/10 prose-td:px-6 prose-td:py-4
              prose-td:text-[15px] prose-td:text-slate-600 dark:prose-td:text-white/60
            ">
                            <DocContent />
                        </div>

                        {/* Developer Feedback & Tools */}
                        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Feedback Widget */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-[#111115] border border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl w-full md:w-auto shadow-sm">
                                <span className="text-sm font-bold text-slate-700 dark:text-white/70">{t("feedback_title")}</span>
                                <div className="flex items-center gap-2">
                                    <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                                        <ThumbsUp className="size-3.5" /> {t("feedback_yes")}
                                    </button>
                                    <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all">
                                        <ThumbsDown className="size-3.5" /> {t("feedback_no")}
                                    </button>
                                </div>
                            </div>

                            {/* GitHub Link & Last Updated */}
                            <div className="flex flex-col items-center md:items-end gap-3 text-sm font-medium text-slate-500 dark:text-white/40">
                                <Link href="#" className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors group">
                                    <Edit3 className="size-4 group-hover:text-primary transition-colors" />
                                    {t("edit_github")}
                                </Link>
                                <div className="flex items-center gap-2 text-xs">
                                    <Github className="size-3.5 opacity-50" />
                                    {t("last_updated")}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Cards (Prev/Next) */}
                        <div className="mt-16 grid sm:grid-cols-2 gap-6">
                            {prev ? (
                                <Link
                                    href={`/docs/${prev.slug}`}
                                    prefetch={true}
                                    className="flex flex-col items-start p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                                >
                                    <span className="text-[11px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <ArrowLeft className="size-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform text-primary" />
                                        {t("previous")}
                                    </span>
                                    <span className="text-lg text-black dark:text-white font-bold group-hover:text-primary transition-colors">
                                        {tItems(prev.titleKey)}
                                    </span>
                                </Link>
                            ) : <div />}

                            {next ? (
                                <Link
                                    href={`/docs/${next.slug}`}
                                    prefetch={true}
                                    className="flex flex-col items-end text-end p-6 rounded-[1.5rem] border border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                                >
                                    <span className="text-[11px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        {t("next")}
                                        <ArrowRight className="size-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform text-primary" />
                                    </span>
                                    <span className="text-lg text-black dark:text-white font-bold group-hover:text-primary transition-colors">
                                        {tItems(next.titleKey)}
                                    </span>
                                </Link>
                            ) : <div />}
                        </div>

                    </article>
                </div>
            </div>
        </main>
    );
}