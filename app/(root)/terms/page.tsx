import React from "react";
import type { Metadata } from "next";
import { FileText, Scale, FileCode2, AlertTriangle, Terminal, Gavel, CheckCircle2, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("terms");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const TermsPage = async () => {
    const t = await getTranslations("terms");

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] font-work-sans pb-24 relative selection:bg-primary/30 transition-colors duration-300 overflow-hidden">

            <div className="absolute inset-0 pointer-events-none flex justify-center opacity-40 dark:opacity-20" aria-hidden="true">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent mx-[20vw]" />
                <div className="w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent mx-[20vw]" />
            </div>

            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30 dark:opacity-10 blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #3b82f6 0%, transparent 70%)" }}
                aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full mb-8 shadow-sm backdrop-blur-sm">
                        <Gavel className="size-4 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("hero_badge")}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black dark:text-white mb-6 tracking-tighter leading-tight">
                        {t("hero_title1")} <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400 dark:from-slate-400 dark:to-slate-200">
                            {t("hero_title2")}
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                        {t("hero_subtitle")}
                    </p>

                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <FileText className="size-4" />
                        <span>{t("effective_date")}</span>
                    </div>
                </div>

                {/* Developer TL;DR Section - The "Out of the box" idea */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Terminal className="size-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300 uppercase tracking-widest">{t("tldr_title")}</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[t("tldr_1"), t("tldr_2"), t("tldr_3")].map((rule, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white/60 dark:bg-black/20 p-4 rounded-2xl border border-white/50 dark:border-white/5">
                                <CheckCircle2 className="size-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-semibold text-slate-700 dark:text-white/70 leading-relaxed">{rule}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-xl dark:shadow-2xl relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-slate-200/50 dark:from-white/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/60 prose-p:font-medium prose-li:font-medium relative z-10">

                        <p className="text-xl mb-12 text-black dark:text-white/80 font-semibold">
                            {t("intro")}
                        </p>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-500 shadow-sm">
                                    <ShieldAlert className="size-6" />
                                </div>
                                {t("section1_title")}
                            </h2>
                            <p className="text-lg">
                                {t("section1_desc")}
                            </p>
                            <ul className="list-none space-y-4 mt-6">
                                {[t("section1_list1"), t("section1_list2"), t("section1_list3")].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-white/70">
                                        <div className="mt-1.5 size-2 rounded-full bg-rose-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 shadow-sm">
                                    <FileCode2 className="size-6" />
                                </div>
                                {t("section2_title")}
                            </h2>
                            <p className="text-lg">
                                {t("section2_intro")}
                            </p>
                            <ul className="list-none space-y-4 mt-6">
                                {[t.raw("section2_list1"), t.raw("section2_list2"), t.raw("section2_list3")].map((item: any, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-white/70">
                                        <div className="mt-1.5 size-2 rounded-full bg-purple-500 shrink-0" />
                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 font-bold">
                                {t("section2_outro")}
                            </div>
                        </div>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-500 shadow-sm">
                                    <Scale className="size-6" />
                                </div>
                                {t("section3_title")}
                            </h2>
                            <p className="text-lg mb-4">{t("section3_desc1")}</p>
                            <p className="text-lg">{t("section3_desc2")}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 shadow-sm">
                                    <AlertTriangle className="size-6" />
                                </div>
                                {t("section4_title")}
                            </h2>
                            <p className="text-lg" dangerouslySetInnerHTML={{ __html: t.raw("section4_desc") as string }} />
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default TermsPage;