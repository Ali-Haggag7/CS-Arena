import React from "react";
import type { Metadata } from "next";
import { Cookie, Key, Database, EyeOff, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("cookies");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const CookiesPage = async () => {
    const t = await getTranslations("cookies");

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0d0d0f] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300">

            <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-40 pointer-events-none" aria-hidden="true" />
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-15 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center size-14 md:size-16 bg-primary/10 border border-primary/20 rounded-2xl mb-6 shadow-sm backdrop-blur-sm">
                        <Cookie className="size-7 md:size-8 text-primary" aria-hidden="true" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-6 tracking-tight">
                        {t("hero_title1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{t("hero_title2")}</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-medium text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <ShieldCheck className="size-4" />
                        <span>{t("effective_date")}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-sm dark:shadow-2xl">

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/70">

                        <p className="text-lg mb-10">
                            {t("intro")}
                        </p>

                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500">
                                    <Key className="size-5" />
                                </div>
                                {t("section1_title")}
                            </h2>
                            <p>
                                {t("section1_intro")}
                            </p>
                            <ul className="list-disc ps-6 space-y-3 mt-4 text-slate-600 dark:text-white/70 marker:text-slate-400 dark:marker:text-white/30">
                                <li dangerouslySetInnerHTML={{ __html: t.raw("section1_list1") as string }} />
                                <li dangerouslySetInnerHTML={{ __html: t.raw("section1_list2") as string }} />
                            </ul>
                        </div>

                        <div className="mb-12">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <Database className="size-5" />
                                </div>
                                {t("section2_title")}
                            </h2>
                            <p>
                                {t("section2_intro")}
                            </p>
                            <ul className="list-disc ps-6 space-y-3 mt-4 text-slate-600 dark:text-white/70 marker:text-slate-400 dark:marker:text-white/30">
                                <li dangerouslySetInnerHTML={{ __html: t.raw("section2_list1") as string }} />
                                <li dangerouslySetInnerHTML={{ __html: t.raw("section2_list2") as string }} />
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h2 className="flex items-center gap-3 text-2xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-500">
                                    <EyeOff className="size-5" />
                                </div>
                                {t("section3_title")}
                            </h2>
                            <p dangerouslySetInnerHTML={{ __html: t.raw("section3_intro") as string }} />
                            <ul className="list-disc ps-6 space-y-3 mt-4 text-slate-600 dark:text-white/70 marker:text-slate-400 dark:marker:text-white/30">
                                <li>{t("section3_list1")}</li>
                                <li>{t("section3_list2")}</li>
                                <li>{t("section3_list3")}</li>
                            </ul>
                            <p className="mt-4 font-medium text-black dark:text-white">
                                {t("section3_outro")}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
};

export default CookiesPage;