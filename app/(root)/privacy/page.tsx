import React from "react";
import type { Metadata } from "next";
import { Shield, Lock, Eye, Database, Server, ShieldCheck, Fingerprint, FileCode2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("privacy");
    return {
        title: t("title"),
        description: t("description"),
    };
}

const PrivacyPage = async () => {
    const t = await getTranslations("privacy");

    const trustCards = [
        { icon: FileCode2, title: t("trust_card1_title"), desc: t("trust_card1_desc"), color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: Fingerprint, title: t("trust_card2_title"), desc: t("trust_card2_desc"), color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { icon: ShieldCheck, title: t("trust_card3_title"), desc: t("trust_card3_desc"), color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 relative z-10">

                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 shadow-sm backdrop-blur-sm">
                        <Shield className="size-4 text-blue-500" aria-hidden="true" />
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{t("hero_badge")}</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black dark:text-white mb-6 tracking-tighter leading-tight">
                        {t("hero_title1")} <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                            {t("hero_title2")}
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                        {t("hero_subtitle")}
                    </p>

                    <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-full text-sm font-bold text-slate-500 dark:text-white/60 shadow-sm dark:shadow-none">
                        <Lock className="size-4" />
                        <span>{t("effective_date")}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {trustCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div key={idx} className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm dark:shadow-none relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300">
                                <div className={`size-12 rounded-xl flex items-center justify-center mb-5 ${card.bg}`}>
                                    <Icon className={`size-6 ${card.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-2">{card.title}</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-white/50 leading-relaxed">{card.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-xl dark:shadow-2xl relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-white/60 prose-p:font-medium prose-li:font-medium relative z-10">

                        <p className="text-xl mb-12 text-black dark:text-white/80 font-semibold">
                            {t("intro")}
                        </p>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 shadow-sm">
                                    <Eye className="size-6" />
                                </div>
                                {t("section1_title")}
                            </h2>
                            <p className="text-lg">
                                {t("section1_intro")}
                            </p>
                            <ul className="list-none space-y-4 mt-6">
                                {[t.raw("section1_list1"), t.raw("section1_list2"), t.raw("section1_list3")].map((item: any, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-white/70">
                                        <div className="mt-1.5 size-2 rounded-full bg-blue-500 shrink-0" />
                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-sm">
                                    <Database className="size-6" />
                                </div>
                                {t("section2_title")}
                            </h2>
                            <p className="text-lg">
                                {t("section2_intro")}
                            </p>
                            <ul className="list-none space-y-4 mt-6">
                                {[t("section2_list1"), t("section2_list2"), t("section2_list3"), t("section2_list4")].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-white/70">
                                        <div className="mt-1.5 size-2 rounded-full bg-emerald-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                                {t("section2_outro")}
                            </div>
                        </div>

                        <div className="mb-14">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 shadow-sm">
                                    <Server className="size-6" />
                                </div>
                                {t("section3_title")}
                            </h2>
                            <p className="text-lg mb-4">{t("section3_intro1")}</p>
                            <p className="text-lg">{t("section3_intro2")}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="flex items-center gap-4 text-2xl md:text-3xl text-black dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-500 shadow-sm">
                                    <Lock className="size-6" />
                                </div>
                                {t("section4_title")}
                            </h2>
                            <p className="text-lg">
                                {t("section4_intro")}
                            </p>
                            <ul className="list-none space-y-4 mt-6">
                                {[t("section4_list1"), t("section4_list2"), t("section4_list3")].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-white/70">
                                        <div className="mt-1.5 size-2 rounded-full bg-amber-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
};

export default PrivacyPage;